import * as Yup from 'yup'

export const CategoryValidationSchema = Yup.object().shape({
  categoryName: Yup.string()
    .trim()
    .min(3, 'El nombre de la categoría debe tener al menos 3 caracteres.')
    .max(50, 'El nombre de la categoría no puede exceder los 50 caracteres.')
    .required('Este campo es obligatorio.'),
  description: Yup.string()
    .trim()
    .min(10, 'La descripción de la categoría debe tener al menos 10 caracteres.')
    .max(1024, 'La descripción de la categoría no puede exceder los 1024 caracteres.')
    .required('Este campo es obligatorio.'),

})