import { Favorite, FavoriteBorder } from '@mui/icons-material'
import { Box, Tooltip } from '@mui/material'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useAuth } from '@/hook/useAuth'
import { useAppStates } from '@/components/utils/global.context'
import useAlert from '@/hook/useAlert'
import { getAllFavorites, toggleFavorite } from '@/api/favorites'
import { getErrorMessage } from '@/api/getErrorMessage'
import { actions } from '@/components/utils/actions'



const FavoriteIcon = ({ idInstrument }) => {
  const { idUser } = useAuth()
  const params = useParams()
  const id = idInstrument || params.id
  const [isFavorite, setIsFavorite] = useState(false)
  const { dispatch } = useAppStates()
  const { showError } = useAlert()

  useEffect(() => {
    const checkIfFavorite = async () => {
      try {
        const response = await getAllFavorites(idUser)
        const favorites = Array.isArray(response.result) ? response.result : []
        const isInstrumentFavorite = favorites.some(
          (fav) => fav.instrument.idInstrument === id
        )
        setIsFavorite(isInstrumentFavorite)
      } catch (error) {
        showError(`❌ ${getErrorMessage(error)}`)
      }
    }

    if (idUser) {
      checkIfFavorite()
    }
  }, [idUser, id, showError])

  const handleToggleFavorite = async () => {
    try {
      const result = await toggleFavorite(idUser, id)
      const newStatus = result.result.isFavorite
      setIsFavorite(newStatus)

      if (newStatus) {
        const newFavorite = {
          instrument: { idInstrument: id },
          isFavorite: true
        }

        dispatch({
          type: actions.TOGGLE_FAVORITE,
          payload: {
            favorite: newFavorite,
            isFavorite: true
          }
        })
      } else {
        dispatch({
          type: actions.TOGGLE_FAVORITE,
          payload: {
            instrumentId: id,
            isFavorite: false
          }
        })
      }
    } catch (error) {
      showError(`❌ ${getErrorMessage(error)}`)
    }
  }

  return (
    <Tooltip
      title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      arrow
    >
      <Box
        onClick={handleToggleFavorite}
        sx={{
          cursor: 'pointer',
          minWidth: 'auto',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {isFavorite ? (
          <Favorite
            color="error"
            sx={{
              fontSize: { xs: 20, sm: 25, md: 30, lg: 35 }
            }}
            className="pulse"
          />
        ) : (
          <FavoriteBorder
            color="action"
            sx={{
              fontSize: { xs: 20, sm: 25, md: 30, lg: 35 },
              transition: 'transform 0.2s ease-in-out',
              '&:hover': { transform: 'scale(1.1)' }
            }}
          />
        )}
      </Box>
    </Tooltip>
  )
}

FavoriteIcon.propTypes = {
  idInstrument: PropTypes.string
}

export default FavoriteIcon
