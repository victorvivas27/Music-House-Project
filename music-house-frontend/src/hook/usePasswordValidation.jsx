import { useState } from 'react'

const usePasswordValidation = () => {
  const [passwordErrors, setPasswordErrors] = useState({})
  const [success, setSuccess] = useState({})

  // 📌 Validación de seguridad de la contraseña
  const validatePassword = (password) => {
    let errorMessage = ''
    const strongPasswordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/

    if (!password) {
      errorMessage = '❌ La contraseña es obligatoria'
    } else if (password.length < 6) {
      errorMessage = '❌ Debe tener al menos 6 caracteres'
    } else if (!strongPasswordRegex.test(password)) {
      errorMessage =
        '⚠️1 mayúscula, 1 minúscula, 1 número y 1 carácter especial (@$!%*?&)'
    }

    setPasswordErrors((prev) => ({
      ...prev,
      password: errorMessage
    }))
  }

  // 📌 Validación de coincidencia de contraseñas
  const validateRepeatPassword = (password, repeatPassword) => {
    if (!repeatPassword) {
      setPasswordErrors((prev) => ({
        ...prev,
        repeatPassword: '⚠️ Debes repetir la contraseña'
      }))
      setSuccess((prev) => ({ ...prev, repeatPassword: '' }))
    } else if (password !== repeatPassword) {
      setPasswordErrors((prev) => ({
        ...prev,
        repeatPassword: '❌ Las contraseñas no coinciden'
      }))
      setSuccess((prev) => ({ ...prev, repeatPassword: '' }))
    } else {
      setPasswordErrors((prev) => ({
        ...prev,
        repeatPassword: ''
      }))
      setSuccess((prev) => ({
        ...prev,
        repeatPassword: '✅ Las contraseñas coinciden'
      }))
    }
  }

  return {
    passwordErrors,
    success,
    validatePassword,
    validateRepeatPassword
  }
}

export default usePasswordValidation
