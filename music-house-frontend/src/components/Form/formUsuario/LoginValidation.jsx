import * as Yup from 'yup'

const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('❌ Email incorrecto')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      '❌ El email no tiene un formato válido'
    )
    .required('❌ El email es obligatorio'),

  password: Yup.string()
    .min(6, '❌ La contraseña debe tener al menos 6 caracteres')
    .max(20, '❌ La contraseña no puede tener más de 20 caracteres')
    .matches(
      /[A-Z]/,
      '❌ La contraseña debe contener al menos una letra mayúscula'
    )
    .matches(
      /[a-z]/,
      '❌ La contraseña debe contener al menos una letra minúscula'
    )
    .matches(/[0-9]/, '❌ La contraseña debe contener al menos un número')
    .matches(
      /[@$!%*?&]/,
      '❌ La contraseña debe contener al menos un carácter especial (@$!%*?&)'
    )
    .required('❌ La contraseña es obligatoria')
})

export default loginValidationSchema
