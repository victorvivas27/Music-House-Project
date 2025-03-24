import { Select, MenuItem, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { getThemes } from '../../api/instruments'
import { Loader } from '../common/loader/Loader'
import PropTypes from 'prop-types'

const ThemeSelect = ({ label, onChange, selectedThemeId = undefined }) => {
  const [themes, setThemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTheme, setSelectedTheme] = useState('')

  // ✅ Obtener temáticas del backend
  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const response = await getThemes()
        setThemes(response.result || [])
      } catch (error) {
        
        setThemes([])
      } finally {
        setLoading(false)
      }
    }

    fetchThemes()
  }, [])

  // ✅ Establecer el tema seleccionado desde la prop si viene
  useEffect(() => {
    if (!selectedThemeId || themes.length === 0) return

    const foundTheme = themes.find(theme => theme.idTheme === selectedThemeId)
    if (foundTheme) {
      setSelectedTheme(foundTheme)
    }
  }, [selectedThemeId, themes])

  // ✅ Comunicar cambio al padre
  useEffect(() => {
    if (loading || !selectedTheme) return
    if (typeof onChange === 'function') {
      onChange({
        target: {
          name: 'idTheme',
          value: selectedTheme.idTheme
        }
      })
    }
  }, [selectedTheme, loading, onChange])

  // ✅ Manejador de cambios en el select
  const handleThemeChange = (event) => {
    setSelectedTheme(event.target.value)
  }

  // ✅ Mostrar loader mientras se carga
  if (loading) {
    return <Loader fullSize={false} />
  }

  return (
    <Select
      displayEmpty
      value={selectedTheme}
      onChange={handleThemeChange}
      label={label}
      color="secondary"
    >
      {/* Placeholder */}
      <MenuItem value="" disabled>
        <Typography variant="h6">🎭 Selecciona una temática</Typography>
      </MenuItem>

      {/* Opciones */}
      {themes.map((theme, index) => (
        <MenuItem key={`theme-select-${index}`} value={theme}>
          {theme.themeName}
        </MenuItem>
      ))}
    </Select>
  )
}

export default ThemeSelect

ThemeSelect.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  selectedThemeId: PropTypes.string
}