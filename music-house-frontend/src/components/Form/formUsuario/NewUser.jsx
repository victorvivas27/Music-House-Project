import {  useState } from 'react'
import { UsersApi } from '../../../api/users'
import { UserForm } from './UserForm'
import { MessageDialog } from '../../common/MessageDialog'
import { useAuthContext } from '../../utils/context/AuthGlobal'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

const NewUser = ({ onSwitch }) => {
  const initialFormData = {
    name: '',
    lastName: '',
    email: '',
    password: '',
    repeatPassword: '',
    addresses: [{ street: '', number: '', city: '', state: '', country: '' }],
    phones: [{ phoneNumber: '' }]
  }

  const [showMessage, setShowMessage] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuthData } = useAuthContext()
  const navigate =useNavigate()

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
  
        setAuthData(userData)
  
        setMessage('Usuario registrado exitosamente.')
        setShowMessage(true)
  
  
  
        setTimeout(() => {
       
          navigate("/", { replace: true });
          window.location.reload();
        }, 1000)
      })
      .catch(() => {
        setMessage('No se pudo registrar usuario. Por favor, intenta de nuevo.')
        setShowMessage(true)
      })
      .finally(() => {
        setLoading(false)
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
        key={message} // Forzar actualización del modal
        onClose={() => setShowMessage(false)}
      />
    </>
  )
}

export default NewUser

NewUser.propTypes = {
  onSwitch: PropTypes.func.isRequired
}