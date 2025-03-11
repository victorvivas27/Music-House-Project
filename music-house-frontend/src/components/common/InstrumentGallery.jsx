import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import { Box, Typography } from '@mui/material'
import { HeaderWrapper } from '../Layout/HeaderWrapper'

import useMediaQuery from '@mui/material/useMediaQuery'

import '../styles/instrumentGallery.styles.css'
import background from '../../assets/background.svg'
import PropTypes from 'prop-types'

export const InstrumentGallery = ({ itemData }) => {
  const matches = useMediaQuery((theme) => theme.breakpoints.up('md'))

  return (
    <Box
      sx={{
        marginTop: 50,
        width: '100vw', // 100% del ancho de la ventana
        height: '100vh', // 100% del alto de la ventana
        display: 'flex', // Flexbox para manejar contenido
        flexDirection: 'column', // Organizar en columna
        justifyContent: 'center', // Centrar verticalmente
        alignItems: 'center', // Centrar horizontalmente
        backgroundColor: '#F8F9FA' // Color de fondo opcional
      }}
    >
      {/* ✅ Encabezado con imagen de fondo */}
      <HeaderWrapper backgroundImageUrl={background}>
        <Box sx={{ position: 'relative', height: '100%' }}>
          <Typography
            sx={{
              my: 2,
              color: 'white',
              fontSize: { xs: '1.5rem', md: '2rem' },
              fontWeight: 'bold',
              padding: '0 .6rem',
              position: 'absolute',
              bottom: 20,
              left: 20,
              textShadow: '2px 2px 8px rgba(0, 0, 0, 0.6)'
            }}
          >
            🎵 Galería de Instrumentos 🎵
          </Typography>
        </Box>
      </HeaderWrapper>

      {/* ✅ Contenedor de imágenes */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          px: 2
        }}
      >
        <ImageList
          sx={{
            width: '100%'
          }}
          variant="masonry"
          cols={matches ? 3 : 2} // 3 columnas en desktop, 2 en móvil
        >
          {itemData?.map((item, index) => (
            <ImageListItem
              key={`gallery-image-${index}`}
              sx={{
                overflow: 'hidden',
                borderRadius: '14px',

                boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
                transition:
                  'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.15)'
                }
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)' // Fondo borroso
                }}
              >
                <img
                  src={item.imageUrl}
                  alt={`Instrumento ${index + 1}`}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '14px'
                  }}
                />
              </Box>
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
    </Box>
  )
}

// ✅ PropTypes
InstrumentGallery.propTypes = {
  itemData: PropTypes.arrayOf(
    PropTypes.shape({
      imageUrl: PropTypes.string.isRequired
    })
  )
}
