import { useState } from 'react'
import { UsersApi } from '../../../api/users'
import { UserForm } from './UserForm'

import { useAuthContext } from '../../utils/context/AuthGlobal'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import useAlert from '../../../hook/useAlert'

const NewUser = ({ onSwitch }) => {
  const initialFormData = {
    name: '',
    picture: '',
    lastName: '',
    email: '',
    password: '',
    repeatPassword: '',
    telegramChatId: '',
    addresses: [{ street: '', number: '', city: '', state: '', country: '' }],
    phones: [{ phoneNumber: '', countryCode: '' }]
  }

  const [loading, setLoading] = useState(false)
  const { setAuthData } = useAuthContext()
  const navigate = useNavigate()
  const { showSuccess, showError } = useAlert()

  const handleSubmit = async (formData) => {
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      const { picture, ...userWithoutPicture } = formData
      delete userWithoutPicture.repeatPassword
      formDataToSend.append('user', JSON.stringify(userWithoutPicture))

      if (picture instanceof File) {
        formDataToSend.append('file', picture)
      }

      const response = await UsersApi.registerUser(formDataToSend)

      if (response && response.data && response.data.token) {
        setAuthData(response.data)
        showSuccess('Usuario registrado exitosamente.')

        setTimeout(() => {
          navigate('/')
        }, 1700)
      } else {
        showError('Error al registrar usuario. No se recibió el token.')
      }
    } catch (error) {
      showError('No se pudo registrar usuario. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <UserForm
        onSwitch={onSwitch}
        initialFormData={initialFormData}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </>
  )
}

export default NewUser

NewUser.propTypes = {
  onSwitch: PropTypes.func
}
