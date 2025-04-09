import * as Yup from 'yup'

export const ThemeValidationSchema = Yup.object().shape({
  themeName: Yup.string()
    .trim()
    .min(3, 'El nombre del tema debe tener al menos 3 caracteres.')
    .max(50, 'El nombre del tema no puede exceder los 50 caracteres.')
    .required('Este campo es obligatorio.'),
  description: Yup.string()
    .trim()
    .min(10, 'La descripción del tema debe tener al menos 10 caracteres.')
    .max(1024, 'La descripción del tema no puede exceder los 1024 caracteres.')
    .required('Este campo es obligatorio.'),
  imageUrlTheme: Yup.mixed()
    .required('Se requiere una imagen.')
   
})