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
import Swal from 'sweetalert2'


export const Favorites = () => {
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState([])
  const { idUser } = useAuthContext()

  // Obtener favoritos al cargar el componente
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await getAllFavorites(idUser)
        setLoading(false)
        if (response?.length > 0) {
          setFavorites(response)
        } else {
          setFavorites([])
        }
      } catch (error) {
        setLoading(false)
        setFavorites([])
      }
    }

    fetchFavorites()
  }, [idUser])

  // Función para manejar la eliminación de un favorito con confirmación
  const handleRemoveFavorite = (favorite) => {
    // Mostrar la confirmación usando Swal
    Swal.fire({
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // Eliminar favorito si el usuario confirma
        removeFavorite(
          favorite.idFavorite,
          favorite.idUser,
          favorite.instrument.idInstrument
        ).then(() => {
          const updatedFavorites = favorites.filter(
            (fav) => fav.idFavorite !== favorite.idFavorite
          )
          setFavorites(updatedFavorites)
          Swal.fire({
            icon: 'success',
            title: 'Eliminado!',
            timer: 1500, // Desaparece después de 1.5 segundos
            showConfirmButton: false
          })
        }).catch(() => {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Ocurrió un error al eliminar el favorito.',
            timer: 1500, // Desaparece después de 1.5 segundos
            showConfirmButton: false
          })
        })
      }
    })
  }

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
              variant="h6"  // Reducir el tamaño de la fuente
              component="h2"
              textAlign="center"
              sx={{ paddingBottom: 1, fontWeight: 'bold' }}
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
                  onClickTrash={() => handleRemoveFavorite(favorite)} 
                  sx={{ // Reducir el tamaño de los cards
                    maxWidth: 250,  // Reducir tamaño máximo de los cards
                    height: 'auto',
                  }}
                />
              ))
            ) : (
              <Typography
                gutterBottom
                variant="subtitle2"  // Reducir tamaño del texto
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