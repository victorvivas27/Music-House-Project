import { useState } from 'react'
import { UsersApi } from '../../../api/users'
import { UserForm } from './UserForm'
import { MessageDialog } from '../../common/MessageDialog'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../utils/context/AuthGlobal'
import PropTypes from 'prop-types'

const NewUser = ({ onSwitch }) => {
  const initialFormData = {
    name: '',
    lastName: '',
    email: '',
    password: '',
    repeatPassword: '',
    addresses: [
      { street: '', number: '', city: '', state: '', country: '' }
    ],
    phones: [
      { phoneNumber: '' }
    ]
  }

  const [showMessage, setShowMessage] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const { setAuthData } = useAuthContext() // 🟢 Usamos setAuthData en lugar de setUser/setIsUserAdmin
  const navigate = useNavigate()

  const handleSubmit = (formData) => {
    setLoading(true)

    const formDataToSend = { ...formData }
    delete formDataToSend.repeatPassword

    UsersApi.registerUser(formDataToSend)
      .then((response) => {
        const userData = response.data

        if (!userData || !userData.token) {
          throw new Error('Error al registrar usuario o falta el token.')
        }

        // 🟢 Iniciar sesión automáticamente con setAuthData
        setAuthData(userData)

        setMessage('Usuario registrado exitosamente. Redirigiendo...')

        // 🔵 Redirigir según el rol
        setShowMessage(true)
        setTimeout(() => {
          navigate(userData.roles.some(role => role.rol === 'ADMIN') ? '/admin' : '/')
        }, 2000)
      })
      .catch((error) => {
        console.error(error)
        setMessage('No se pudo registrar usuario. Por favor, vuelve a intentarlo.')
      })
      .finally(() => {
        setLoading(false)
        setShowMessage(true)
      })
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
        buttonText="Ok"
        onClose={() => setShowMessage(false)}
      />
    </>
  )
}

export default NewUser

NewUser.propTypes={
  onSwitch:PropTypes.func.isRequired
}