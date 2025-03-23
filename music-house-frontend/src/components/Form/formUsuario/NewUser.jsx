import { useState } from 'react'
import { UsersApi } from '../../../api/users'
import { UserForm } from './UserForm'


import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import useAlert from '../../../hook/useAlert'
import { useAuth } from '../../../hook/useAuth'

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
    phones: [{ phoneNumber: '', countryCode: '' }],
    roles: [],        
    idRol: '' 
  }

  const [loading, setLoading] = useState(false)
  const { setAuthData } = useAuth()
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
        showSuccess(`✅${response.message}`)
        setTimeout(() => {
          navigate('/')
        }, 1700)
      } else {
        showError(`${response.message}`)
      }
    } catch (error) {
      if (error.data) {
        // ✅ Ahora sí capturamos el mensaje que envía el backend
        showError(`❌ ${error.data.message||
           '⚠️ No se pudo conectar con el servidor.'}`)
      }
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
