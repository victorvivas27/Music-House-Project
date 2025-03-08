import { useState } from 'react'
import { UsersApi } from '../../../api/users'
import { UserForm } from './UserForm'
import { MessageDialog } from '../../common/MessageDialog'
import { useAuthContext } from '../../utils/context/AuthGlobal'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

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

  const [showMessage, setShowMessage] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuthData } = useAuthContext()
  const navigate = useNavigate()

  const handleSubmit = async (formData) => {
    setLoading(true)

    try {
      // 🔹 Crear `FormData`
      const formDataToSend = new FormData()
      const { picture, ...userWithoutPicture } = formData
      // Eliminar `repeatPassword` del objeto `userWithoutPicture`
      delete userWithoutPicture.repeatPassword
      // 🔹 Convertir el JSON a string y agregarlo a FormData
      formDataToSend.append('user', JSON.stringify(userWithoutPicture))

      // 🔹 Solo agregar la imagen si el usuario seleccionó una
      if (picture instanceof File) {
        formDataToSend.append('file', picture)
      }

      // 🔹 Llamamos a `UsersApi.registerUser()`
      const response = await UsersApi.registerUser(formDataToSend)

      // 🔹 Verificar si la API devuelve `data.token`
      if (response && response.data && response.data.token) {
        setAuthData(response.data) // Guardar usuario en el contexto
        setMessage('Usuario registrado exitosamente.')
        setShowMessage(true)

        setTimeout(() => {
          navigate('/about', { replace: true })
          // window.location.reload()
        }, 1000)
      } else {
        throw new Error('Error al registrar usuario. No se recibió el token.')
      }
    } catch (error) {
      let errorMessage = 'No se pudo registrar usuario. Intenta de nuevo.'

      if (error.response) {
        errorMessage = error.response.data.message || errorMessage
      }

      setMessage(errorMessage)
      setShowMessage(true)
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
      <MessageDialog
        title="Registrar Usuario"
        message={message}
        isOpen={showMessage}
        key={message}
        onClose={() => setShowMessage(false)}
      />
    </>
  )
}

export default NewUser

NewUser.propTypes = {
  onSwitch: PropTypes.func.isRequired
}
