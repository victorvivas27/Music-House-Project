import * as Yup from 'yup'

export const ThemeValidationSchema = Yup.object().shape({
  themeName: Yup.string().required('Este campo es obligatorio.'),
  description: Yup.string().required('Este campo es obligatorio.'),
  imageUrlTheme: Yup.mixed()
    .required('Se requiere una imagen.')
    .test(
      'fileType',
      'El archivo debe ser una imagen válida.',
      (value) => value instanceof File
    )
})