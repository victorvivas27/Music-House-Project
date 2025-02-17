import { useState } from 'react'
import { UsersApi } from '../../../api/users'
import { UserForm } from './UserForm'
import { MessageDialog } from '../../common/MessageDialog'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../utils/context/AuthGlobal'

const NewUser = ({ onSwitch }) => {
  const initialFormData = {
    name: '',
    lastName: '',
    email: '',
    password: '',
    repeatPassword: '',
    addresses: [
      {
        street: '',
        number: '',
        city: '',
        state: '',
        country: ''
      }
    ],
    phones: [
      {
        phoneNumber: ''
      }
    ]
  }
  const [showMessage, setShowMessage] = useState(false)
  const [message, setMessage] = useState()
  const [isUserCreated, setIsUserCreated] = useState(false)
  const { isUserAdmin } = useAuthContext()
  const navigate = useNavigate()

  const onClose = () => {
    setShowMessage(false)

    if (isUserCreated && !isUserAdmin) {
      navigate(0)
    }
    if (isUserCreated && isUserAdmin) {
      navigate(-1)
    }
  }

  const handleSubmit = (formData) => {
    const formDataToSend = { ...formData }
    delete formDataToSend.repeatPassword
    // Aquí puedes enviar los datos del formulario a través de una función prop o realizar otras acciones
    UsersApi.registerUser(formDataToSend)
      .then((response) => {
        setMessage(
          `Usuario registrado exitosamente.${isUserAdmin ? '' : ' Ya puedes iniciar sesión'}`
        )
        setIsUserCreated(true)
      })
      .catch((error) => {
        setMessage(
          'No se pudo registrar usuario\nPor favor, vuelve a intentarlo'
        )
        setIsUserCreated(false)
      })
      .finally(() => setShowMessage(true))
  }

  return (
    <>
      <UserForm
        onSwitch={onSwitch}
        initialFormData={initialFormData}
        onSubmit={handleSubmit}
      />
      <MessageDialog
        title="Registrar Usuario"
        message={message}
        isOpen={showMessage}
        buttonText="Ok"
        onClose={onClose}
        onButtonPressed={onClose}
      />
    </>
  )
}

export default NewUser
