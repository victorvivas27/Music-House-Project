import { useEffect, useState } from 'react'
import { Box, Button, IconButton, Typography } from '@mui/material'
import { PhotoCamera, Delete } from '@mui/icons-material'
import PropTypes from 'prop-types'

const ImageUpload = ({ onImagesChange, initialImages = [], single = false }) => {
  const [previewUrl, setPreviewUrl] = useState(null) 
  const [newPreview, setNewPreview] = useState(null) 


  useEffect(() => {
    if (single && initialImages.length > 0 && typeof initialImages[0] === 'string') {
      setPreviewUrl(initialImages[0])
    }
  }, [initialImages, single])

  const handleFileChange = (event) => {
    const fileSelected = event.target.files?.[0]

    if (fileSelected && fileSelected.size <= 5 * 1024 * 1024) {
      const preview = URL.createObjectURL(fileSelected)
      setNewPreview(preview)
      
      onImagesChange([fileSelected])
    } else {
      alert('La imagen supera los 5MB permitidos.')
    }
  }

  const handleRemove = () => {
    setNewPreview(null)
    
    onImagesChange([])
  }

  return (
    <Box sx={{ textAlign: 'center', width: '100%' }}>
      {/* Selector */}
      <input
        type="file"
        accept="image/*"
        id="image-upload"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <label htmlFor="image-upload">
        <Button
          component="span"
          variant="contained"
          startIcon={<PhotoCamera />}
        >
          Subir Imagen
        </Button>
      </label>

      <Typography variant="body2" sx={{ marginTop: 1 }}>
        Máximo 5MB por imagen - JPG, PNG, etc.
      </Typography>

      {/* Imagen actual */}
      {previewUrl && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Imagen actual
          </Typography>
          <Box sx={{ position: 'relative', width: '150px', height: '150px', mx: 'auto' }}>
            <img
              src={previewUrl}
              alt="imagen-actual"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '8px',
                border: '2px solid var(--color-primario)'
              }}
            />
          </Box>
        </Box>
      )}

      {/* Nueva imagen */}
      {newPreview && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Nueva imagen a cargar
          </Typography>
          <Box sx={{ position: 'relative', width: '150px', height: '150px', mx: 'auto' }}>
            <img
              src={newPreview}
              alt="nueva-imagen"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '8px',
                border: '2px dashed var(--color-primario)'
              }}
            />
            <IconButton
              onClick={handleRemove}
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: 'rgba(255,255,255,0.8)',
                borderRadius: '50%'
              }}
            >
              <Delete color="error" />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  )
}

ImageUpload.propTypes = {
  onImagesChange: PropTypes.func.isRequired,
  initialImages: PropTypes.array,
  single: PropTypes.bool
}

export default ImageUpload
