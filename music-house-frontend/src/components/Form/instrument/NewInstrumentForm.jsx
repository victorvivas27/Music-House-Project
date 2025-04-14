import { getErrorMessage } from '@/api/getErrorMessage'
import { createInstrument } from '@/api/instruments'
import ArrowBack from '@/components/utils/ArrowBack'
import { formDataToCharacteristics } from '@/components/utils/editInstrument'
import useAlert from '@/hook/useAlert'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import InstrumentForm from './InstrumentForm'
import { useAppStates } from '@/components/utils/global.context'
import { actions } from '@/components/utils/actions'

const NewInstrumentForm = () => {
  const navigate = useNavigate()
  const { dispatch, state } = useAppStates()
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
      dispatch({ type: actions.SET_LOADING, payload: true })

      if (!formData) {
        showError('⚠️ Formulario inválido.')
        dispatch({ type: actions.SET_LOADING, payload: false })
        return
      }

      const formDataToSend = new FormData()

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

      formDataToSend.append(
        'instrument',
        new Blob([instrumentJson], { type: 'application/json' })
      )
      if (formData.imageUrls && formData.imageUrls.length > 0) {
        for (let file of formData.imageUrls) {
          if (file instanceof File) {
            formDataToSend.append('files', file)
          }
        }
      }

      try {
        const response = await createInstrument(formDataToSend)
        showSuccess(`✅ ${response.message}`)

        setTimeout(() => {
          navigate('/instruments')
        }, 1000)
      } catch (error) {
        showError(`❌ ${getErrorMessage(error)}`)
      } finally {
        setTimeout(() => {
          dispatch({ type: actions.SET_LOADING, payload: false })
        }, 1000)
      }
    },
    [dispatch, navigate, showError, showSuccess]
  )

  return (
    <>
      <ArrowBack />
      <InstrumentForm
        initialFormData={initialFormData}
        onSubmit={onSubmit}
        loading={state.loading}
      />
    </>
  )
}

export default NewInstrumentForm
