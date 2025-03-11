import { useState, useEffect } from 'react'
import { UsersApi } from '../../../api/users'
import { UserForm } from './UserForm'
import { Box, Typography } from '@mui/material'
import { MessageDialog } from '../../common/MessageDialog'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { MainCrearUsuario } from '../../common/crearUsuario/MainCrearUsuario'
import { Loader } from '../../common/loader/Loader'
import BoxLogoSuperior from '../../common/crearUsuario/BoxLogoSuperior'
import BoxFormUnder from '../../common/crearUsuario/BoxFormUnder'
import { Logo } from '../../Images/Logo'
import { Code } from '../../../api/constants'
import { roleById } from '../../utils/roles/constants'
import { useAuthContext } from '../../utils/context/AuthGlobal'
import { updateAddress } from '../../../api/addresses'
import { updatePhone } from '../../../api/phones'
import PropTypes from 'prop-types'

const EditUser = ({ onSwitch }) => {
  const { id } = useParams()
  const [user, setUser] = useState()
  const [formData, setFormData] = useState()
  const [showMessage, setShowMessage] = useState(false)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState()
  const [isUserUpdated, setIsUserUpdated] = useState()
  const [isNewRoleAdded, setIsNewRoleAdded] = useState()
  const [isAddressUpdated, setIsAddressUpdated] = useState()
  const [isPhoneUpdated, setIsPhoneUpdated] = useState()
  const { user: loggedUser, isUserAdmin } = useAuthContext()
  const navigate = useNavigate()
  const isLoggedUser = loggedUser?.idUser && loggedUser.idUser === Number(id)
  const canEditUser = !(isUserAdmin && !isLoggedUser)

  useEffect(() => {
    if (!user) return
    // console.log("Usuario cargado:", user.data);
    const initialFormData = {
      idUser: id,
      picture: user.data.picture,
      name: user.data.name,
      lastName: user.data.lastName,
      email: user.data.email,
      addresses: user.data.addresses,
      phones: user.data.phones,
      roles: user.data.roles.map((role) => ({
        idRol: role.idRol,
        rol: role.rol
      })) // Guarda todos los roles
    }
    setFormData(initialFormData)
    setLoading(false)
  }, [id, user])

  useEffect(() => {
    if (
      isUserUpdated === undefined ||
      isNewRoleAdded === undefined ||
      isAddressUpdated === undefined ||
      isPhoneUpdated === undefined
    )
      return

    if (
      (isLoggedUser &&
        isUserUpdated === true &&
        isAddressUpdated === true &&
        isPhoneUpdated === true) ||
      (isUserAdmin &&
        isAddressUpdated === true &&
        isPhoneUpdated === true &&
        isUserUpdated === true &&
        isNewRoleAdded === true)
    ) {
      setMessage('Usuario guardado exitosamente')
    } else {
      setMessage(
        'No fue posible guardar el usuario. Por favor, inténtalo nuevamente'
      )
    }
    setIsNewRoleAdded(undefined)
    setIsAddressUpdated(undefined)
    setIsPhoneUpdated(undefined)
    setShowMessage(true)
  }, [
    isUserUpdated,
    isNewRoleAdded,
    isAddressUpdated,
    isPhoneUpdated,
    isLoggedUser,
    isUserAdmin
  ])

  const getUserInfo = () => {
    UsersApi.getUserById(id)
      .then(([user, code]) => {
        if (code === Code.SUCCESS) {
          setUser(user)
        }
      })
      .catch(([code]) => {
        if (code === Code.NOT_FOUND) {
          setMessage('Usuario no encontrado')
          setShowMessage(true)
        }
      })
  }

  useEffect(() => {
    getUserInfo()
  }, [])

  const onClose = () => {
    setShowMessage(false)

    if (isUserUpdated) {
      navigate(-1)
    }
  }

  const handleSubmit = (formData) => {
    if (!formData) {
      console.error('Error: No hay datos para enviar.')
      return
    }

    const formDataToSend = new FormData()
    const { picture, ...userWithoutPicture } = formData

    // 📌 1️⃣ Verificar si `picture` es un archivo o si se mantiene la URL actual
    if (
      !picture ||
      picture === '' ||
      (typeof picture === 'object' && !(picture instanceof File))
    ) {
      userWithoutPicture.picture = user?.data?.picture || '' // Mantiene la URL si no hay nueva imagen
    }

    // 📌 2️⃣ Validar el objeto antes de enviarlo
    console.log('Datos antes de enviar:', userWithoutPicture)

    // 📌 3️⃣ Si el objeto está vacío, evitar la solicitud
    if (Object.keys(userWithoutPicture).length === 0) {
      console.error('Error: El objeto `userWithoutPicture` está vacío.')
      return
    }

    // 📌 4️⃣ Agregar datos al FormData
    formDataToSend.append('user', JSON.stringify(userWithoutPicture))

    // 📌 5️⃣ Solo agregar `file` si hay una nueva imagen
    if (picture instanceof File) {
      formDataToSend.append('file', picture)
    } else {
      console.log('No hay nueva imagen, manteniendo la actual.')
    }

   /*  // 📌 6️⃣ Confirmar que `FormData` está bien antes de enviarlo
    for (let pair of formDataToSend.entries()) {
      console.log(pair[0] + ':', pair[1])
    } */

    // 📌 7️⃣ Enviar solicitud
    UsersApi.updateUser(formDataToSend)
      .then(() => {
        setIsUserUpdated(true)
      })
      .catch((error) => {
        console.error('Error al actualizar usuario:', error)
        setMessage(
          'No fue posible guardar usuario. Por favor, vuelve a intentarlo'
        )
        setIsUserUpdated(false)
      })

    // 📌 8️⃣ Actualizar dirección y teléfono
    const address = formData.addresses[0]
    const { idAddress, street, number, city, state, country } = address
    updateAddress({ idAddress, street, number, city, state, country })
      .then(() => setIsAddressUpdated(true))
      .catch(() => setIsAddressUpdated(false))

    const phone = formData.phones[0]
    const { idPhone, phoneNumber } = phone
    updatePhone({ idPhone, phoneNumber })
      .then(() => setIsPhoneUpdated(true))
      .catch(() => setIsPhoneUpdated(false))

    // 📌 9️⃣ Manejo de roles
    const oldRol =
      (user.data.roles.length && user.data.roles[0].rol) || undefined
    const newRol = roleById(formData.idRol)

    if (!isUserAdmin || newRol === undefined) setIsNewRoleAdded(true)

    if (oldRol === newRol) {
      setIsNewRoleAdded(true)
    }

    if (
      isUserAdmin &&
      newRol &&
      !user.data.roles.some((r) => r.rol === newRol)
    ) {
      UsersApi.addUserRole(user.data.idUser, newRol)
        .then(() => {
          setIsNewRoleAdded(true)
        })
        .catch(() => {
          setIsNewRoleAdded(false)
        })
    }
  }

  if (!(isLoggedUser || isUserAdmin)) {
    navigate('/')
  }

  if (loading) {
    return <Loader title="Un momento por favor" />
  }

  return (
    <MainCrearUsuario>
      <>
        <BoxLogoSuperior>
          <Link to="/">
            <Logo />
          </Link>
        </BoxLogoSuperior>
        {formData && (
          <BoxFormUnder
            sx={{ display: { xs: canEditUser ? 'flex' : 'none', lg: 'flex' } }}
          >
            <UserForm
              onSwitch={onSwitch}
              initialFormData={formData}
              onSubmit={handleSubmit}
              user={user}
              setUser={setUser}
            />
            <MessageDialog
              title="Editar Usuario"
              message={message}
              isOpen={showMessage}
              buttonText="Ok"
              onClose={onClose}
              onButtonPressed={onClose}
            />
          </BoxFormUnder>
        )}
      </>
      {!canEditUser && (
        <Box
          sx={{
            display: {
              xs: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              lg: 'none'
            },
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100vh'
          }}
        >
          <Typography
            gutterBottom
            variant="h6"
            component="h6"
            textAlign="center"
            sx={{
              paddingTop: 30,
              fontWeight: 'bold'
            }}
          >
            Funcionalidad no disponible en esta resolución
          </Typography>
        </Box>
      )}
    </MainCrearUsuario>
  )
}

export default EditUser
EditUser.propTypes = {
  onSwitch: PropTypes.func, // Si es opcional
};