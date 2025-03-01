import { styled, alpha } from '@mui/material/styles'
import { IconButton } from '@mui/material'

export const FavoriteIconWrapper = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'isFavorite' // Evita que `isFavorite` se pase al DOM
})(({ isFavorite }) => ({
    backgroundColor: isFavorite ? '#FAED74' : '#FFFFFF',
    '&:hover': {
      backgroundColor: isFavorite ? alpha('#FAED74', 0.7) : '#FFFFFF',
      boxShadow: '0 0 8px rgba(0, 0, 0, 0.3)'
    },
    border: '1px solid black'
  })
)
