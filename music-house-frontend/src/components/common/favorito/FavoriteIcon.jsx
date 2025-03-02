import { Favorite, FavoriteBorder } from '@mui/icons-material'
import { Box, Button, Tooltip,Snackbar } from '@mui/material'
import { useAuthContext } from '../../utils/context/AuthGlobal'
import { useParams } from 'react-router-dom'
import {  useEffect, useState } from 'react'
import { addFavorite, getAllFavorites } from '../../../api/favorites';

const FavoriteIcon = () => {
  const { idUser } = useAuthContext()
  const { id } = useParams()
  const [isFavorite, setIsFavorite] = useState(false)
  const [error, setError] = useState('') // Estado para manejar errores
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
    <Box>
      <Tooltip title={isFavorite ? 'Ya está en favoritos' : 'Agregar a favoritos'}>
        <Button
          onClick={handleFavoriteClick}
          sx={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            zIndex: 1,
            padding: 0
          }}
        >
          {isFavorite ? (
            <Favorite
              color="error"
              sx={{
                fontSize: 60
              }}
              className="pulse"
            />
          ) : (
            <FavoriteBorder
              color="action"
              sx={{
                fontSize: 60
              }}
            />
          )}
        </Button>
      </Tooltip>

      {/* Snackbar para mostrar errores */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        message={error}
        onClose={handleCloseSnackbar}
      />
    </Box>
  )
}

export default FavoriteIcon
