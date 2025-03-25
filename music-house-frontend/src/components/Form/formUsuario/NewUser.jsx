import { useState } from 'react'
import { UsersApi } from '../../../api/users'
import { UserForm } from './UserForm'


import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import useAlert from '../../../hook/useAlert'
import { useAuth } from '../../../hook/useAuth'
import { getErrorMessage } from '../../../api/getErrorMessage'

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
   const { isUserAdmin } = useAuth()

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
  
      if (response?.result?.token) {
        showSuccess(`✅${response.message}`)
  
        setTimeout(() => {
          if (isUserAdmin) {
            // ⚠️ NO guardar el token si es admin
            navigate(-1) // 🔙 vuelve a la página anterior
          } else {
            // ✅ Guardamos el token para el usuario normal
            setAuthData({ token: response.result.token })
            navigate('/')
          }
        }, 1700)
      } else {
        showError(`${response.message}`)
      }
    } catch (error) {
      showError(`❌ ${getErrorMessage(error)}`)
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
