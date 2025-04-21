import * as Yup from 'yup'

export  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Este campo es obligatorio.'),
    description: Yup.string().required('Este campo es obligatorio.'),
    measures: Yup.string().required('Este campo es obligatorio.'),
    weight: Yup.number().typeError('Debe ser un número válido.').required('Este campo es obligatorio.'),
    rentalPrice: Yup.number().typeError('Debe ser un número válido.').required('Este campo es obligatorio.'),
    idCategory: Yup.string().required('Debes seleccionar una categoría.'),
    imageUrls: Yup.array().min(1, 'Se requiere al menos una imagen.')
  })