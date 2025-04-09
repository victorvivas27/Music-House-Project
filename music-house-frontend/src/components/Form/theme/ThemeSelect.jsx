import { Select, MenuItem, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { getThemes } from '@/api/instruments'
import { Loader } from '@/components/common/loader/Loader'

const ThemeSelect = ({ label, onChange, selectedThemeId = undefined }) => {
  const [themes, setThemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTheme, setSelectedTheme] = useState('')

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

  useEffect(() => {
    if (!selectedThemeId || themes.length === 0) return

    const foundTheme = themes.find((theme) => theme.idTheme === selectedThemeId)
    if (foundTheme) {
      setSelectedTheme(foundTheme)
    }
  }, [selectedThemeId, themes])

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

  const handleThemeChange = (event) => {
    setSelectedTheme(event.target.value)
  }

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
