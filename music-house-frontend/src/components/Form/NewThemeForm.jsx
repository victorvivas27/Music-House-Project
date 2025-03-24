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
    description: ''
  }

  const onSubmit = useCallback(
    async (formData) => {
      if (!formData) return

      dispatch({ type: actions.SET_LOADING, payload: true })

      try {
        const response = await createTheme({
          themeName: formData.themeName,
          description: formData.description
        })

        if (response?.message) {
          setTimeout(() => {
            showSuccess(`✅ ${response.message}`)
            navigate('/theme')
          }, 1100)

          dispatch({
            type: actions.THEME_CREATED,
            payload: { created: true }
          })
        }
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
      <ThemeForm
        initialFormData={initialFormData}
        onSubmit={onSubmit}
        loading={state.loading}
      />
    </>
  )
}
