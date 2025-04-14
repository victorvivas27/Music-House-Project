import { getErrorMessage } from '@/api/getErrorMessage'
import { createTheme } from '@/api/theme'
import { actions } from '@/components/utils/actions'
import { useAppStates } from '@/components/utils/global.context'
import useAlert from '@/hook/useAlert'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ThemeForm } from './ThemeForm'

export const NewThemeForm = () => {
  const { dispatch, state } = useAppStates()
  const { showSuccess, showError } = useAlert()
  const navigate = useNavigate()

  const initialFormData = {
    idTheme: '',
    themeName: '',
    description: '',
    imageUrlTheme: ''
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

      if (formData.imageUrlTheme && formData.imageUrlTheme instanceof File) {
        formDataToSend.append('image', formData.imageUrlTheme)
      }

      try {
        const response = await createTheme(formDataToSend)
        showSuccess(`✅ ${response.message}`)

        setTimeout(() => {
          navigate('/theme')
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
    <ThemeForm
      initialFormData={initialFormData}
      onSubmit={onSubmit}
      loading={state.loading}
    />
  )
}
