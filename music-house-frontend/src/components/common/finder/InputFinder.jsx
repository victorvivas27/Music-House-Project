import { Search } from './Search'
import { SearchIconWrapper } from './SearchIconWrapper'
import { StyledInputBase } from './StyledInputBase'
import SearchIcon from '@mui/icons-material/Search'
import Close from '@mui/icons-material/Close'
import { Box, IconButton } from '@mui/material'
import PropTypes from 'prop-types'

export const InputFinder = ({
  value,
  setValue,
  onKeyUp,
  onKeyDown,
  inputRef,
  onClose
}) => {
  const handleKeyUp = (event) => {
    const keyCode = event.keyCode

    if (typeof onKeyUp === 'function') onKeyUp(keyCode)
  }

  const handleKeyDown = (event) => {
    const keyCode = event.keyCode

    if (typeof onKeyDown === 'function') onKeyDown(keyCode)
  }

  const handleChange = (event) => {
    const value = event.target.value

    if (typeof setValue === 'function') setValue(value.trim())
  }

  const handleClose = () => {
    if (typeof onClose === 'function') onClose()
  }

  return (
    <Search ref={inputRef}>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Busca tu instrumento favorito..."
        inputProps={{ 'aria-label': 'búsqueda' }}
        onChange={handleChange}
        onKeyUp={handleKeyUp}
        onKeyDown={handleKeyDown}
        value={value}
      />
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'absolute',
          height: '100%',
          top: 0,
          right: 0,
          '& svg': { height: '1.5rem' }
        }}
      >
        <IconButton sx={{ zIndex: 1300 }} onClick={handleClose}>
          <Close />
        </IconButton>
      </Box>
    </Search>
  )
}

// 🔹 Agregamos validación de `PropTypes`
InputFinder.propTypes = {
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  onKeyUp: PropTypes.func,
  onKeyDown: PropTypes.func,
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  onClose: PropTypes.func
};