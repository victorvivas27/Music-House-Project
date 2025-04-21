import { imageUrlsAllInstrumentId, removeImage } from "@/api/imagesInstrument"
import useAlert from "@/hook/useAlert"
import { Delete } from "@mui/icons-material"
import { Box, IconButton } from "@mui/material"
import PropTypes from "prop-types"
import { useEffect, useState } from "react"

const ImageUrlsEdit = ({ idInstrument }) => {
    const [imageUrls, setImageUrls] = useState([])
    const { showSuccess, showLoading } = useAlert()
  
    useEffect(() => {
      const fetchData = async () => {
        if (!idInstrument) return
        const response = await imageUrlsAllInstrumentId(idInstrument)
        if (response.result) {
          setImageUrls(response.result || [])
        }
      }
  
      fetchData()
    }, [idInstrument])
  
    const handleRemoveImage = async (idImage) => {
      if (!idInstrument || !idImage) return
  
      try {
        showLoading('⌛Eliminando imagen...')
        await removeImage(idImage, idInstrument)
        setImageUrls((prev) => prev.filter((img) => img.idImage !== idImage))
        setTimeout(() => {
          showSuccess('Imagen eliminada con éxito ✅')
        }, 500)
      } catch (error) {
        console.error('Error al eliminar la imagen:', error)
      }
    }
  
    return (
      <>
        {/* 📌 Galería de imágenes */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
            gap: 1,
            marginTop: 2,
            justifyContent: 'center'
          }}
        >
          {imageUrls.map((img, index) => (
            <Box
              key={img.idImage || index}
              sx={{ position: 'relative', width: '100px', height: '100px' }}
            >
              <img
                src={img.imageUrl}
                alt={`preview-${index}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: '2px solid #ddd'
                }}
              />
              <IconButton
                onClick={() => handleRemoveImage(img.idImage)}
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '50%',
                  '&:hover': { backgroundColor: 'var(--color-error)' }
                }}
              >
                <Delete color="error" />
              </IconButton>
            </Box>
          ))}
        </Box>
      </>
    )
  }
  
  export default ImageUrlsEdit
  ImageUrlsEdit.propTypes = {
    idInstrument: PropTypes.string
  }