import { useEffect, useState } from 'react'

import { Typography, Box } from '@mui/material'
import ProductsWrapper from '../common/ProductsWrapper'
import ProductCard from '../common/ProductCard'
import { Loader } from '../common/loader/Loader'
import { MainWrapper } from '../common/MainWrapper'
import { getAllFavorites } from '../../api/favorites'
import { useAuthContext } from '../utils/context/AuthGlobal'

import ArrowBack from '../utils/ArrowBack'
import { useAppStates } from '../utils/global.context'
import { actions } from '../utils/actions'

export const Favorites = () => {
  const [loading, setLoading] = useState(true)
  const { state, dispatch } = useAppStates()
  const { favorites } = state
  const { idUser } = useAuthContext()

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await getAllFavorites(idUser)
        dispatch({ type: actions.UPDATE_FAVORITES, payload: response })
      } catch (error) {
        dispatch({ type: actions.UPDATE_FAVORITES, payload: [] })
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [idUser, dispatch])

  if (loading) return <Loader title="Cargando favoritos..." />

  return (
    <MainWrapper
      sx={{
        padding: { xs: '2rem 1rem', sm: '2rem' },
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        alignItems: 'center',
        justifyContent: 'flex-start', 
        minHeight: '100vh', 
        boxSizing: 'border-box'
      }}
    >
      <ArrowBack />

      <Box
        sx={{
          textAlign: 'center'
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          sx={{
            color: 'var(--color-primario)',
            marginBottom: 1
          }}
        >
          🎵 Tus Favoritos
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: 'text.secondary'
          }}
        >
          Aquí puedes ver los instrumentos que marcaste como favoritos.
        </Typography>
      </Box>

      <ProductsWrapper>
        {favorites.length > 0 ? (
          favorites.map((favorite, index) => (
            <ProductCard
              key={`favorite-card-${index}`}
              name={favorite.instrument.name}
              imageUrl={favorite.imageUrl}
              id={favorite.instrument.idInstrument}
              isFavorite={true}
            />
          ))
        ) : (
          <Typography
            variant="subtitle1"
            sx={{
              textAlign: 'center',
              marginTop: 4,
              color: 'text.secondary',
              fontStyle: 'italic'
            }}
          >
            No se han encontrado favoritos. ¡Explora instrumentos y agrega
            algunos! 🎸🎺
          </Typography>
        )}
      </ProductsWrapper>
    </MainWrapper>
  )
}
