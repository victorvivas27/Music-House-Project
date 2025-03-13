import { useState, useEffect } from 'react'
import { UsersApi } from '../../../api/users'
import { UserForm } from './UserForm'
import { Box, Typography } from '@mui/material'

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
import Swal from 'sweetalert2'

const EditUser = ({ onSwitch }) => {
  const { id } = useParams()
  const [user, setUser] = useState()
  const [formData, setFormData] = useState()
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { user: loggedUser, isUserAdmin } = useAuthContext()
  const isLoggedUser = loggedUser?.idUser && loggedUser.idUser === Number(id)
  const canEditUser = !(isUserAdmin && !isLoggedUser)

  useEffect(() => {
    UsersApi.getUserById(id)
      .then(([user, code]) => {
        if (code === Code.SUCCESS) {
          setUser(user)
          setFormData({
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
            }))
          })
        }
      })
      .catch(([code]) => {
        if (code === Code.NOT_FOUND) {
          Swal.fire({
            title: 'Error',
            text: 'Usuario no encontrado',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          })
          navigate('/')
        }
      })
      .finally(() => setLoading(false))
  }, [id, navigate])

  const handleSubmit = async (formData) => {
    if (!formData) return

    setIsSubmitting(true)

    setTimeout(async () => {
      try {
        const formDataToSend = new FormData()
        const { picture, ...userWithoutPicture } = formData

        if (
          !picture ||
          picture === '' ||
          (typeof picture === 'object' && !(picture instanceof File))
        ) {
          userWithoutPicture.picture = user?.data?.picture || ''
        }

        if (Object.keys(userWithoutPicture).length === 0) {
          console.error('Error: El objeto `userWithoutPicture` está vacío.')
          setIsSubmitting(false)
          return
        }

        formDataToSend.append('user', JSON.stringify(userWithoutPicture))

        if (picture instanceof File) {
          formDataToSend.append('file', picture)
        }

        await UsersApi.updateUser(formDataToSend)

        // ✅ Dirección
        const address = formData.addresses[0]
        await updateAddress({
          idAddress: address.idAddress,
          street: address.street,
          number: address.number,
          city: address.city,
          state: address.state,
          country: address.country
        })

        // ✅ Teléfono
        const phone = formData.phones[0]
        await updatePhone({
          idPhone: phone.idPhone,
          phoneNumber: phone.phoneNumber
        })

        // ✅ Manejo de roles
        //const oldRol = (user.data.roles.length && user.data.roles[0].rol) || undefined
        const newRol = roleById(formData.idRol)

        if (
          isUserAdmin &&
          newRol &&
          !user.data.roles.some((r) => r.rol === newRol)
        ) {
          await UsersApi.addUserRole(user.data.idUser, newRol)
        }

        // 🔹 Mostrar mensaje de éxito sin botón y cerrar automáticamente
        Swal.fire({
          title: 'Usuario actualizado',
          text: 'Los cambios se guardaron correctamente.',
          icon: 'success',
          showConfirmButton: false,
          timer: 1000
        })

        // 🔹 Esperar 2 segundos y redirigir
        setTimeout(() => {
          navigate(-1)
        }, 1100)
      } catch (error) {
        console.error('Error al actualizar usuario:', error)
        Swal.fire({
          title: 'Error',
          text: 'No fue posible guardar los cambios. Intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        })
      } finally {
        setIsSubmitting(false)
      }
    }, 1000) // 🔹 Pequeño retraso antes de iniciar la actualización
  }

  if (!(isLoggedUser || isUserAdmin)) {
    setTimeout(() => {
      navigate('/')
      setIsSubmitting(false)
    }, 1100)
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
              isSubmitting={isSubmitting}
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
  onSwitch: PropTypes.func
}
