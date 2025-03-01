import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import { Box, Container, Typography } from '@mui/material'
import { HeaderWrapper } from '../Layout/HeaderWrapper'
import { MainWrapper } from './MainWrapper'
import useMediaQuery from '@mui/material/useMediaQuery'

import '../styles/instrumentGallery.styles.css'
import background from '../../assets/background.svg'
import PropTypes from 'prop-types'

const srcset = (image, size, rows = 1, cols = 1) => {
  const urlHasParams = /\?/.test(image)
  const paramsJoin = urlHasParams ? '&' : '?'
  return {
    src: `${image}${paramsJoin}w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}${paramsJoin}w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`
  }
}

export const InstrumentGallery = ({ itemData }) => {
  const matches = useMediaQuery((theme) => theme.breakpoints.up('md'))

  return (
    <Container sx={{ backgroundColor: '#F2F2F2', height: '100%' }}>
      <HeaderWrapper backgroundImageUrl={background} height={200}>
        <Box sx={{ position: 'relative', height: '100%' }}>
          <Typography
            sx={{
              my: 2,
              color: 'white',
              display: 'block',
              fontSize: '1.3rem',
              fontWeight: 'bold',
              padding: '0 .6rem',
              position: 'absolute',
              bottom: 3,
              left: 10
            }}
          >
            Galería de imágenes
          </Typography>
        </Box>
      </HeaderWrapper>
      <MainWrapper>
        <ImageList
          sx={{
            width: { xs: '100%', md: '70%' },
            height: 520
          }}
          variant="quilted"
          cols={4}
          rowHeight={121}
        >
          {itemData?.map((item, index) => (
            <ImageListItem
              key={`gallery-image-${index}`}
              cols={matches ? (index === 0 ? 2 : 1) : 4}
              rows={matches ? (index === 0 ? 4 : 2) : 4}
              sx={{
                display: 'grid',
                backgroundColor: 'white',
                margin: '.5rem',
                borderRadius: '.625rem'
              }}
            >
              <img
                className="instrument-gallery-image"
                {...srcset(item.imageUrl, 121, item.rows, item.cols)}
                alt=""
                loading="lazy"
              />
            </ImageListItem>
          ))}
        </ImageList>
      </MainWrapper>
    </Container>
  )
}

InstrumentGallery.propTypes = {
  itemData: PropTypes.arrayOf(
    PropTypes.shape({
      imageUrl: PropTypes.string,
      rows: PropTypes.number, // Opcional: cantidad de filas
      cols: PropTypes.number // Opcional: cantidad de columnas
    })
  )
};