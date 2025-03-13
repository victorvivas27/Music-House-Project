import { Favorite, FavoriteBorder } from '@mui/icons-material'
import { Box, Button, Tooltip, Snackbar, Alert } from '@mui/material'
import { useAuthContext } from '../../utils/context/AuthGlobal'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { addFavorite, getAllFavorites } from '../../../api/favorites'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined' // 📌 Importa el icono

const FavoriteIcon = () => {
  const { idUser } = useAuthContext()
  const { id } = useParams()
  const [isFavorite, setIsFavorite] = useState(false)
  const [error, setError] = useState('')
  const [openSnackbar, setOpenSnackbar] = useState(false)

  // Obtener todos los favoritos del usuario al cargar el componente
  useEffect(() => {
    const checkIfFavorite = async () => {
      try {
        const response = await getAllFavorites(idUser)
        const isInstrumentFavorite = response.some(
          (favorite) => favorite.instrument.idInstrument === id
        )
        setIsFavorite(isInstrumentFavorite)
      } catch (error) {
        setError('Error al verificar favoritos')
        setOpenSnackbar(true)
      }
    }

    checkIfFavorite()
  }, [idUser, id])

  // Función para agregar a favoritos
  const handleAddFavorite = async () => {
    try {
      await addFavorite(idUser, id)
      setIsFavorite(true)
    } catch (error) {
      setError('Error al agregar a favoritos')
      setOpenSnackbar(true)
    }
  }

  // Función para manejar clic en el icono de favoritos
  const handleFavoriteClick = () => {
    if (!isFavorite) {
      handleAddFavorite()
    } else {
      setError('Ya está agregado a favoritos')
      setOpenSnackbar(true)
    }
  }

  // Cerrar el snackbar de error
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  return (
    <Box
      sx={{
        position: 'relative',
        bottom: {
          xs: 7,
          sm: 8,
          md: 9,
          lg: 10
        },
        right: {
          xs: 150,
          sm: 160,
          md: 180,
          lg: 190
        },
        zIndex: 2
      }}
    >
      <Tooltip
        title={isFavorite ? 'Ya está en favoritos' : 'Agregar a favoritos'}
        arrow
      >
        <Button
          onClick={handleFavoriteClick}
          disableRipple 
          disableElevation 
          sx={{
            padding: 0,
            minWidth: 'auto', 
            '&:hover': { backgroundColor: 'transparent' } 
          }}
        >
          {isFavorite ? (
            <Favorite
              color="error"
              sx={{
                fontSize: {
                  xs: 30,
                  sm: 35,
                  md: 45,
                  lg: 50
                }
              }}
              className="pulse"
            />
          ) : (
            <FavoriteBorder
              color="action"
              sx={{
                fontSize: {
                  xs: 30,
                  sm: 35,
                  md: 45,
                  lg: 50
                },
                transition: 'transform 0.2s ease-in-out',
                '&:hover': { transform: 'scale(1.1)' }
              }}
            />
          )}
        </Button>
      </Tooltip>

      {/* Snackbar para mostrar errores */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'botton', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="info"
          sx={{
            backgroundColor: 'var(--color-azul)', 
            color: 'var(--texto-inverso)',
            fontWeight: 'bold',
            fontSize: '1rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
          icon={<InfoOutlinedIcon sx={{ color: 'var(--texto-inverso)'}} />} 
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default FavoriteIcon
