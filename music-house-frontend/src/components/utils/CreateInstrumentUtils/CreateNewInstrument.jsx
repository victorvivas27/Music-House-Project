import * as yup from 'yup'

export const CreateNewInstrumentValidationSchema = yup.object().shape({
  registDate: yup.date().required('Este campo es requerido'),
  name: yup.string().required('Este campo es requerido'),
  description: yup.string().required('Este campo es requerido'),
  measures: yup.string().required('Este campo es requerido'),
  weight: yup.number().required('Este campo es requerido'),
  rentalPrice: yup.number().required('Este campo es requerido'),
  category: yup.object().shape({
    idCategory: yup.number().required('Este campo es requerido'),
    registDate: yup.date().required('Este campo es requerido'),
    categoryName: yup.string().required('Este campo es requerido'),
    description: yup.string().required('Este campo es requerido')
  }),
  theme: yup.object().shape({
    idTheme: yup.number().required('Este campo es requerido'),
    registDate: yup.date().required('Este campo es requerido'),
    themeName: yup.string().required('Este campo es requerido'),
    description: yup.string().required('Este campo es requerido')
  }),
  imageUrls: yup
    .array()
    .of(
      yup.object().shape({
        idImage: yup.number().required('Este campo es requerido'),
        registDate: yup.date().required('Este campo es requerido'),
        imageUrl: yup.string().required('Este campo es requerido')
      })
    )
    .required()
})

const instrumentData = {
  data: {
    registDate: '2024-05-13',
    name: 'Batería Acústica',
    description:
      'Batería completa que incluye bombo, cajas, platillos y timbales, ideal para músicos y bandas que buscan un sonido potente y versátil.',
    measures: '350x150',
    weight: 700.0,
    rentalPrice: 15000.0,
    category: {
      idCategory: 1,
      registDate: '2024-05-12',
      categoryName: 'PERCUSION',
      description:
        'La categoría de percusión abarca instrumentos como la batería, los timbales, los platillos y la marimba, que se tocan golpeándolos para producir ritmos y efectos rítmicos en la música.'
    },
    theme: {
      idTheme: 1,
      registDate: '2024-05-12',
      themeName: 'CLASICO',
      description:
        'Clásico se caracteriza por la simetría, el equilibrio y la proporción, con columnas griegas o romanas, frontones triangulares, arcos semicirculares y una paleta de colores sobria y elegante.'
    },
    imageUrls: [
      {
        idImage: 1,
        registDate: '2024-05-13',
        imageUrl:
          'https://http2.mlstatic.com/D_NQ_NP_2X_671814-MLU74548953344_022024-F.webp'
      },
      {
        idImage: 2,
        registDate: '2024-05-13',
        imageUrl:
          'https://http2.mlstatic.com/D_NQ_NP_811057-MLU74675398433_022024-O.webp'
      }
    ]
  }
}

CreateNewInstrumentValidationSchema.validate(instrumentData)
  .then((valid) => console.log(valid))
  .catch((error) => console.error(error))
