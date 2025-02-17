import { useEffect, useState } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { Typography, Box, Container } from '@mui/material'
import ProductsWrapper from '../common/ProductsWrapper'
import ProductCard from '../common/ProductCard'
import { Loader } from '../common/loader/Loader'
import { MainWrapper } from '../common/MainWrapper'
import { getAllFavorites } from '../../api/favorites'
import { useAuthContext } from '../utils/context/AuthGlobal'
import { removeFavorite } from '../../api/favorites'
import { Code } from '../../api/constants'

export const Favorites = () => {
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState()
  const { user } = useAuthContext()
  const [data, code] = getAllFavorites(user?.idUser, [])

  useEffect(() => {
    if (code === Code.SUCCESS) {
      setFavorites(data.data)
      setLoading(false)
    } else if (code === Code.NOT_FOUND) {
      setFavorites([])
      setLoading(false)
    }
  }, [data, code])

  const handleRemoveFavorite = (favorite) => {
    removeFavorite(
      favorite.idFavorite,
      favorite.idUser,
      favorite.instrument.idInstrument
    ).then((response) => {
      const favs = favorites.filter(
        (fav) => fav.idFavorite !== favorite.idFavorite
      )
      setFavorites(favs)
    })
  }

  if (loading) return <Loader title="Cargando favoritos..." />

  return (
    <main>
      {!loading && (
        <MainWrapper
          sx={{
            paddingLeft: { xs: '0' },
            paddingRight: { xs: '0' },
            minHeight: '90vh'
          }}
        >
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
                variant="h5"
                component="h2"
                textAlign="center"
                sx={{ paddingBottom: 1, fontWeight: 'bold' }}
              >
                Favoritos
              </Typography>
            </Box>
            {!loading && (
              <ProductsWrapper>
                {favorites?.length > 0 ? (
                  favorites?.map((favorite, index) => (
                    <ProductCard
                      key={`favorite-card-${index}`}
                      name={favorite.instrument.name}
                      imageUrl={favorite.imageUrl}
                      id={favorite.instrument.idInstrument}
                      isFavorite={true}
                      onClickTrash={() => handleRemoveFavorite(favorite)}
                    />
                  ))
                ) : (
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="h6"
                    textAlign="center"
                    sx={{ paddingBottom: 1, fontWeight: 'bold' }}
                  >
                    No se han encontrado favoritos
                  </Typography>
                )}
              </ProductsWrapper>
            )}
          </Container>
        </MainWrapper>
      )}
    </main>
  )
}
