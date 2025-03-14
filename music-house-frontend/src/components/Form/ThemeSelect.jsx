import { Select, MenuItem, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { getThemes } from '../../api/instruments'
import { Loader } from '../common/loader/Loader'
import PropTypes from 'prop-types'

const ThemeSelect = ({ label, onChange, selectedThemeId = undefined }) => {
  const [loading, setLoading] = useState(true)
  const [selectedTheme, setSelectedTheme] = useState('')
  const [themes] = getThemes()

  useEffect(() => {
    if (!themes) return
setLoading(false)
  }, [themes])



  useEffect(() => {
    if (!selectedThemeId || !themes) return

    const selectedTheme = themes.data.find(
      (theme) => theme.idTheme === selectedThemeId
    )
    setSelectedTheme(selectedTheme)
  }, [selectedThemeId, themes])

  useEffect(() => {
    if (loading) return
    if (typeof onChange === 'function')
      onChange({
        target: { name: 'idTheme', value: selectedTheme.idTheme }
      })
  }, [loading, onChange, selectedTheme])

  if (loading) {
    return <Loader fullSize={false} />
  }

  const handleThemeChange = (event) => {
    setSelectedTheme(event.target.value)
  }

  return (
    <Select
    displayEmpty
      value={selectedTheme}
      onChange={handleThemeChange}
      label={label}
      color="secondary"
    >
       {/* 📌 Placeholder */}
       <MenuItem value="" disabled>
        <Typography variant="h6">🎭 Selecciona una temática</Typography>
      </MenuItem>

      {themes?.data?.map((theme, index) => (
        <MenuItem key={`theme-select-${index}`} value={theme}>
          {theme.themeName}
        </MenuItem>
      ))}
    </Select>
  )
}

export default ThemeSelect

ThemeSelect.propTypes={
  label:PropTypes.string.isRequired,
  onChange:PropTypes.func.isRequired,
  selectedThemeId:PropTypes.string
}