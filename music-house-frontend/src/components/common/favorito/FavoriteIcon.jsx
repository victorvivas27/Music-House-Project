import { Favorite, FavoriteBorder } from '@mui/icons-material'
import { Box, Tooltip } from '@mui/material'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useAuth } from '@/hook/useAuth'
import { useAppStates } from '@/components/utils/global.context'
import useAlert from '@/hook/useAlert'
import { toggleFavorite } from '@/api/favorites'
import { getErrorMessage } from '@/api/getErrorMessage'
import { actions } from '@/components/utils/actions'

const FavoriteIcon = ({ idInstrument }) => {
  const { idUser } = useAuth()
  const params = useParams()
  const id = idInstrument || params.id
  const { dispatch, state } = useAppStates()
  const { showError } = useAlert()

  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const isInstrumentFavorite = state.favorites.some(
      (fav) => fav.instrument.idInstrument === id
    )
    setIsFavorite(isInstrumentFavorite)
  }, [id, state.favorites])

  const handleToggleFavorite = async () => {
    try {
      const response = await toggleFavorite(idUser, id)
      const favorite = response.result
      setIsFavorite(favorite.isFavorite)

      dispatch({
        type: actions.TOGGLE_FAVORITE,
        payload: { favorite }
      })
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
            sx={{ fontSize: { xs: 20, sm: 25, md: 30, lg: 35 } }}
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
