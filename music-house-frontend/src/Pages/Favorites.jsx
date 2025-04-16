import { useEffect, useState } from 'react'
import { Typography, Box } from '@mui/material'
import { useAppStates } from '@/components/utils/global.context'
import { useAuth } from '@/hook/useAuth'
import {  getFavoritesByUserId } from '@/api/favorites'
import { actions } from '@/components/utils/actions'
import { Loader } from '@/components/common/loader/Loader'
import { MainWrapper, ProductsWrapper } from '@/components/styles/ResponsiveComponents'
import ArrowBack from '@/components/utils/ArrowBack'
import ProductCard from '@/components/common/instrumentGallery/ProductCard'


export const Favorites = () => {
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const pageSize = 3
const { state, dispatch } = useAppStates()
  const { favorites } = state
  const { idUser } = useAuth()

  const fetchFavorites = async (pageToLoad = 0) => {
    const response = await getFavoritesByUserId(idUser, pageToLoad, pageSize)
    const data = response?.result

    dispatch({
      type: actions.UPDATE_FAVORITES,
      payload: pageToLoad === 0
        ? data.content
        : [...favorites, ...data.content]
    })

    setHasMore(!data.last)
    setLoading(false)
  }

  useEffect(() => {
    fetchFavorites(0)
  }, [idUser])

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchFavorites(nextPage)
  }

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

      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          sx={{ color: 'var(--color-primario)', marginBottom: 1 }}
        >
          🎵 Tus Favoritos
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
          Aquí puedes ver los instrumentos que marcaste como favoritos.
        </Typography>
      </Box>

      <ProductsWrapper>
        {favorites.length > 0 ? (
          favorites.map((favorite, index) => (
            <ProductCard
              key={`favorite-card-${index}`}
              name={favorite.instrument.name}
              imageUrl={favorite.instrument.imageUrl}
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
            No se han encontrado favoritos. ¡Explora instrumentos y agrega algunos! 🎸🎺
          </Typography>
        )}
      </ProductsWrapper>

      {/* 🔽 Botón de paginación */}
      {hasMore && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <button
            onClick={handleLoadMore}
            style={{
              padding: '10px 20px',
              fontSize: '1rem',
              borderRadius: '8px',
              backgroundColor: 'var(--color-primario)',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Cargar más favoritos
          </button>
        </Box>
      )}
    </MainWrapper>
  )
}
