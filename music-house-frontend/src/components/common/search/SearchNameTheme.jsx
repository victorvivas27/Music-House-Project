import { getTheme, searchThemeName } from '@/api/theme'
import { actions } from '@/components/utils/actions'
import { useAppStates } from '@/components/utils/global.context'
import { Box, IconButton, TextField } from '@mui/material'
import { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'

const SearchNameTheme = () => {
  const [localSearchTerm, setLocalSearchTerm] = useState('')
  const { dispatch } = useAppStates()
  const [page] = useState(0)
  const [size] = useState(5)
  const [orderBy] = useState('themeName')
  const [order] = useState('asc')

  const handleInputChange = async (event) => {
    const newTerm = event.target.value
    setLocalSearchTerm(newTerm)
    const sort = `${orderBy},${order}`
    try {
      let data
      if (newTerm.trim() !== '') {
        data = await searchThemeName(newTerm, page, size, sort)
      } else {
        data = await getTheme(page, size, sort)
      }
      dispatch({ type: actions.SET_THEMES, payload: data.result })
    } catch (error) {
      dispatch({
        type: actions.SET_THEMES,
        payload: { content: [], totalElements: 0 }
      })
    }
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, px: 2 }}>
      <TextField
        label="Buscar por nombre"
        variant="outlined"
        value={localSearchTerm}
        onChange={handleInputChange}
        InputProps={{
          endAdornment: (
            <IconButton disabled>
              <SearchIcon sx={{ color: 'var(--color-azul)' }} />
            </IconButton>
          )
        }}
      />
    </Box>
  )
}

export default SearchNameTheme
