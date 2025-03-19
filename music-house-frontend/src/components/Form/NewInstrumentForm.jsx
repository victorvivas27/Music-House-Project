import { useCallback, useState } from 'react'
import InstrumentForm from './InstrumentForm'
import { createInstrument } from '../../api/instruments'
import { formDataToCharacteristics } from '../utils/editInstrument'
import ArrowBack from '../utils/ArrowBack'
import { useNavigate } from 'react-router-dom'
import useAlert from '../../hook/useAlert'

const NewInstrumentForm = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { showSuccess, showError } = useAlert()

  const initialFormData = {
    idInstrument: null,
    name: '',
    description: '',
    measures: '',
    weight: '',
    rentalPrice: '',
    idCategory: '',
    idTheme: '',
    imageUrls: [],
    characteristics: {
      instrumentCase: false,
      support: false,
      tuner: false,
      microphone: false,
      phoneHolder: false
    }
  }

  const onSubmit = useCallback(
    async (formData) => {
      setLoading(true)

      if (!formData) {
        showError('⚠️ Formulario inválido.')
        setLoading(false)
        return
      }

      const formDataToSend = new FormData()

      // 📌 Convertir JSON correctamente
      const instrumentJson = JSON.stringify({
        name: formData.name || '',
        description: formData.description || '',
        rentalPrice: formData.rentalPrice || '',
        weight: formData.weight || '',
        measures: formData.measures || '',
        idCategory: formData.idCategory || '',
        idTheme: formData.idTheme || '',
        characteristic: formDataToCharacteristics(formData)
      })

      // ✅ Agregar JSON correctamente como un Blob con application/json
      formDataToSend.append(
        'instrument',
        new Blob([instrumentJson], { type: 'application/json' })
      )

      // ✅ Agregar imágenes correctamente
      if (formData.imageUrls && formData.imageUrls.length > 0) {
        for (let file of formData.imageUrls) {
          if (file instanceof File) {
            formDataToSend.append('files', file)
          }
        }
      }

      try {
        await createInstrument(formDataToSend)

        // ✅ Éxito: Mostrar alerta y redirigir
        showSuccess('El instrumento se ha registrado correctamente.')

        setTimeout(() => {
          navigate('/instruments') // ✅ Redirigir después de 1s
        }, 1000)
      } catch (error) {
        if (error.response?.data?.message) {
          // ✅ Capturar mensaje del backend
          showError(`❌ ${error.response.data.message}`)
        } else if (error.request) {
          showError('⚠️ No se pudo conectar con el servidor.')
        } else {
          showError('❌ Error inesperado. Intenta nuevamente.')
        }
      } finally {
        setLoading(false)
      }
    },
    [navigate, showError, showSuccess]
  )

  return (
    <>
      <ArrowBack />
      <InstrumentForm
        initialFormData={initialFormData}
        onSubmit={onSubmit}
        loading={loading}
      />
    </>
  )
}

export default NewInstrumentForm
