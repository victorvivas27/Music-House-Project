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

import { roleById } from '../../utils/roles/constants'
import { useAuthContext } from '../../utils/context/AuthGlobal'
import { updateAddress } from '../../../api/addresses'
import { updatePhone } from '../../../api/phones'
import PropTypes from 'prop-types'
import useAlert from '../../../hook/useAlert'

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
  const { showSuccess, showError } = useAlert()

  // 🔹 Función normal sin `useCallback`
  const fetchUser = async () => {
    if (!id) return

    setLoading(true)
    try {
      const userData = await UsersApi.getUserById(id)
      setUser(userData)
      setFormData({
        idUser: id,
        picture: userData.data.picture || '',
        name: userData.data.name || '',
        lastName: userData.data.lastName || '',
        email: userData.data.email || '',
        addresses: userData.data.addresses || [],
        phones: userData.data.phones || [],
        roles:
          userData.data.roles?.map((role) => ({
            idRol: role.idRol,
            rol: role.rol
          })) || []
      })
    } catch (error) {
      console.error('Error al obtener usuario:', error)
      showError(error?.message || 'Error al obtener usuario')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [id])

  const handleSubmit = async (formData) => {
    if (!formData) return

    setIsSubmitting(true)

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
        setIsSubmitting(false)
        return
      }

      formDataToSend.append('user', JSON.stringify(userWithoutPicture))

      if (picture instanceof File) {
        formDataToSend.append('file', picture)
      }

      const response = await UsersApi.updateUser(formDataToSend)

      // ✅ Actualizar dirección
      const address = formData.addresses[0]
      await updateAddress({
        idAddress: address.idAddress,
        street: address.street,
        number: address.number,
        city: address.city,
        state: address.state,
        country: address.country
      })

      const phone = formData.phones[0]
      await updatePhone({
        idPhone: phone.idPhone,
        phoneNumber: phone.phoneNumber
      })

      const newRol = roleById(formData.idRol)

      if (
        isUserAdmin &&
        newRol &&
        !user.data.roles.some((r) => r.rol === newRol)
      ) {
        await UsersApi.addUserRole(user.data.idUser, newRol)
      }

      if (response && response.message) {
        setTimeout(() => {
          showSuccess(`✅ ${response.message}`)
          navigate(-1)
        }, 1100)
      }

     
    } catch (error) {
      if (error.data) {
     
        showError(`❌ ${error.data.message||
           '⚠️ No se pudo conectar con el servidor.'}`)
      } 
    } finally {
      setTimeout(() => {
        setIsSubmitting(false) 
      }, 1100)
    }
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
