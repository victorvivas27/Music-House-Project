import { useState, useEffect, useCallback } from 'react'
import { Box } from '@mui/material'
import { getThemeById, updateTheme } from '../../api/theme'
import { Loader } from '../common/loader/Loader'
import { ThemeForm } from './ThemeForm'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { useAppStates } from '../utils/global.context'
import { actions } from '../utils/actions'
import useAlert from '../../hook/useAlert'
import { getErrorMessage } from '../../api/getErrorMessage'

export const EditThemeForm = ({ id }) => {
  const [initialFormData, setInitialFormData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { state, dispatch } = useAppStates()
  const navigate = useNavigate()
  const { showSuccess, showError } = useAlert()

  const getTheme = useCallback(async () => {
    setLoading(true)

    try {
      const theme = await getThemeById(id)

      if (theme?.result) {
        setTimeout(() => {
          setInitialFormData({
            idTheme: theme.result.idTheme,
            themeName: theme.result.themeName,
            description: theme.result.description
          })
          setLoading(false)
        }, 100)
      } else {
        setInitialFormData(null)
        setLoading(false)
      }
    } catch (error) {
      setInitialFormData(null)
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    getTheme()
  }, [getTheme])

  const onSubmit = async (formData) => {
    if (!formData) return
    dispatch({ type: actions.SET_LOADING, payload: true })

    try {
      const response = await updateTheme(formData)

      if (response?.message) {
        setTimeout(() => {
          showSuccess(`✅ ${response.message}`)
          navigate('/theme')
        }, 1100)
      }
    } catch (error) {
      showError(`❌ ${getErrorMessage(error)}`)
    } finally {
      setTimeout(() => {
        dispatch({ type: actions.SET_LOADING, payload: false })
      }, 1000)
    }
  }
  if (loading) {
    return <Loader title="Un momento por favor" />
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {!loading && (
        <ThemeForm
          initialFormData={initialFormData}
          onSubmit={onSubmit}
          loading={state.loading}
        />
      )}
    </Box>
  )
}

EditThemeForm.propTypes = {
  id: PropTypes.string.isRequired
}
