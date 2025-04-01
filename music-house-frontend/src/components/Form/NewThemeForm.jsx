import { useCallback } from 'react'
import { createTheme } from '../../api/theme'
import { useAppStates } from '../utils/global.context'
import { actions } from '../utils/actions'
import { ThemeForm } from './ThemeForm'
import useAlert from '../../hook/useAlert'
import { getErrorMessage } from '../../api/getErrorMessage'
import { useNavigate } from 'react-router-dom'

export const NewThemeForm = () => {
  const { dispatch, state } = useAppStates()
  const { showSuccess, showError } = useAlert()
  const navigate = useNavigate()

  const initialFormData = {
    idTheme: '',
    themeName: '',
    description: '',
    imageUrls: []
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

      const themeJson = JSON.stringify({
        themeName: formData.themeName || '',
        description: formData.description || ''
      })

      formDataToSend.append(
        'theme',
        new Blob([themeJson], { type: 'application/json' })
      )
      if (formData.imageUrls && formData.imageUrls.length > 0) {
        for (let file of formData.imageUrls) {
          if (file instanceof File) {
            formDataToSend.append('files', file)
          }
        }
      }

      try {
        const response = await createTheme(formDataToSend)
        showSuccess(`✅ ${response.message}`)

        setTimeout(() => {
          navigate('/theme')
        }, 1100)
      } catch (error) {
        showError(`❌ ${getErrorMessage(error)}`)
      } finally {
        dispatch({ type: actions.SET_LOADING, payload: false })
      }
    },
    [dispatch, navigate, showError, showSuccess]
  )

  return (
    <>
      <ThemeForm
        initialFormData={initialFormData}
        onSubmit={onSubmit}
        loading={state.loading}
      />
    </>
  )
}
