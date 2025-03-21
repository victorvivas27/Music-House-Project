import { Favorite, FavoriteBorder } from '@mui/icons-material'
import { Box, Tooltip } from '@mui/material'
import { useAuthContext } from '../../utils/context/AuthGlobal'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getAllFavorites, toggleFavorite } from '../../../api/favorites'

import PropTypes from 'prop-types'
import { useAppStates } from '../../utils/global.context'
import { actions } from '../../utils/actions'
import useAlert from '../../../hook/useAlert'

const FavoriteIcon = ({ idInstrument }) => {
  const { idUser } = useAuthContext()
  const params = useParams()
  const id = idInstrument || params.id
  const [isFavorite, setIsFavorite] = useState(false)
  const { dispatch } = useAppStates()
  const { showError } = useAlert()

  useEffect(() => {
    const checkIfFavorite = async () => {
      const response = await getAllFavorites(idUser)
      const isInstrumentFavorite = response.some(
        (favorite) => favorite.instrument.idInstrument === id
      )
      setIsFavorite(isInstrumentFavorite)
    }

    checkIfFavorite()
  }, [idUser, id])

  const handleToggleFavorite = async () => {
    try {
      const result = await toggleFavorite(idUser, id)
      const newStatus = result.data.isFavorite
      setIsFavorite(newStatus)

      if (newStatus) {
        // ✅ Se agregó
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
        // ❌ Se eliminó
        dispatch({
          type: actions.TOGGLE_FAVORITE,
          payload: {
            instrumentId: id,
            isFavorite: false
          }
        })
      }
    } catch (error) {
      showError(error?.message)
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
