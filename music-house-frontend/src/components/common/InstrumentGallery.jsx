import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import { Box } from '@mui/material'
import '../styles/instrumentGallery.styles.css'
import PropTypes from 'prop-types'

export const InstrumentGallery = ({ itemData }) => {
  return (
    <Box>
      <ImageList>
        {itemData?.map((item, index) => (
          <ImageListItem
            key={`gallery-image-${index}`}
            sx={{
              overflow: 'hidden',
              borderRadius: '14px',
              transition:
                'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.03)',
                boxShadow: 'var(--box-shadow)'
              }
            }}
          >
            <Box
              sx={{
                padding: '0.5rem',
                borderRadius: '10px'
              }}
            >
              <img
                src={item.imageUrl}
                alt={`Instrumento ${index + 1}`}
                loading="lazy"
              />
            </Box>
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  )
}
InstrumentGallery.propTypes = {
  itemData: PropTypes.arrayOf(
    PropTypes.shape({
      imageUrl: PropTypes.string.isRequired
    })
  )
}
