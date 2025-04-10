import { Select, MenuItem, Typography, CircularProgress } from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { useAppStates } from '@/components/utils/global.context'
import { actions } from '@/components/utils/actions'
import { getTheme } from '@/api/theme'
import { getErrorMessage } from '@/api/getErrorMessage'
import useAlert from '@/hook/useAlert'

const PAGE_SIZE = 2// o el número que prefieras

const ThemeSelect = ({ label, onChange, selectedThemeId }) => {
  const { state, dispatch } = useAppStates()
  const themes = useMemo(() => state.themes?.content || [], [state.themes])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const { showError } = useAlert()
  const{ loading }=state

  const fetchThemes = useCallback(async () => {
    if (loading || !hasMore) return
dispatch({ type: actions.SET_LOADING, payload: true })
    try {
      const response = await getTheme(page, PAGE_SIZE)
      const newThemes = response.result?.content || []

      const updated = [
        ...themes,
        ...newThemes.filter(
          (newTheme) => !themes.some((t) => t.idTheme === newTheme.idTheme)
        )
      ]

      dispatch({ type: actions.SET_THEMES, payload: updated })
      setHasMore(!response.result.last)
      setPage(prev => prev + 1)
    } catch (error) {
      showError(`❌ ${getErrorMessage(error)}`)
    } finally {
       dispatch({ type: actions.SET_LOADING, payload:false})
    }
  }, [dispatch, hasMore, loading, page, showError, themes])

  useEffect(() => {
    if (themes.length === 0) {
      fetchThemes()
    }
  }, [fetchThemes, themes.length])

  const handleChange = (event) => {
    onChange?.({
      target: {
        name: 'idTheme',
        value: event.target.value
      }
    })
  }

  const handleScroll = (event) => {
    const bottom =
      event.target.scrollTop + event.target.clientHeight >= event.target.scrollHeight - 10

    if (bottom && hasMore && !loading) {
      fetchThemes()
    }
  }

  return (
    <Select
      displayEmpty
      fullWidth
      value={selectedThemeId || ''}
      onChange={handleChange}
      label={label}
      color="secondary"
      MenuProps={{
        PaperProps: {
          sx: { 
            height: 120, 
            overflowY: 'auto' 
          },
          onScroll: handleScroll
        }
      }}
    >
      <MenuItem value="" disabled>
        <Typography variant="h6">🎭 Selecciona una temática</Typography>
      </MenuItem>

      {themes.map((theme) => (
        <MenuItem key={theme.idTheme} value={theme.idTheme}>
          {theme.themeName}
        </MenuItem>
      ))}

      {loading && (
        <MenuItem disabled>
          <CircularProgress size={20} />
          <Typography variant="body2" sx={{ ml: 1 }}>
            Cargando más...
          </Typography>
        </MenuItem>
      )}
    </Select>
  )
}

ThemeSelect.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  selectedThemeId: PropTypes.string
}

export default ThemeSelect
