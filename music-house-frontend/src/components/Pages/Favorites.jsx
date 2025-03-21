import { useEffect, useState } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { Typography, Box, Container } from '@mui/material'
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
    <main>
      <MainWrapper
        sx={{
          paddingLeft: { xs: '0' },
          paddingRight: { xs: '0' },
          minHeight: '90vh'
        }}
      >
        <ArrowBack />
        <CssBaseline />
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            paddingBottom: 5,
            paddingLeft: { xs: '0' },
            paddingRight: { xs: '0' }
          }}
        >
          <Box>
            <Typography
              gutterBottom
              variant="h6"
              component="h2"
              textAlign="center"
              sx={{
                paddingBottom: 1,
                fontWeight: 'bold'
              }}
            >
              Favoritos
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
                gutterBottom
                variant="subtitle2"
                component="h6"
                textAlign="center"
                sx={{ paddingBottom: 1, fontWeight: 'bold' }}
              >
                No se han encontrado favoritos
              </Typography>
            )}
          </ProductsWrapper>
        </Container>
      </MainWrapper>
    </main>
  )
}
