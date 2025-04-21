import { Delete, PhotoCamera } from "@mui/icons-material"
import { Box, Button, IconButton, Typography } from "@mui/material"
import PropTypes from "prop-types"
import { useEffect, useState } from "react"

const ImageUploadSingle = ({ onImageChange, initialImage = null }) => {
    const [previewUrl, setPreviewUrl] = useState(null)
  
    useEffect(() => {
      if (typeof initialImage === 'string') {
        setPreviewUrl(initialImage)
      }
    }, [initialImage])
  
    const handleFile = (file) => {
      if (!file) return
  
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen supera los 5MB permitidos.')
        return
      }
  
      const preview = URL.createObjectURL(file)
      setPreviewUrl(preview)
      onImageChange(file)
    }
  
    const handleFileChange = (event) => {
      const file = event.target.files?.[0]
      handleFile(file)
    }
  
    const handleDrop = (e) => {
      e.preventDefault()
      const file = e.dataTransfer.files?.[0]
      handleFile(file)
    }
  
    const handleRemove = () => {
      setPreviewUrl(null)
      onImageChange(null)
    }
  
    return (
      <Box
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        sx={{
          textAlign: 'center',
          border: '2px dashed #aaa',
          borderRadius: 2,
          p: 2,
          mt: 2,
        cursor: 'pointer',
      
        }}
      >
        <input
          type="file"
          accept="image/*"
          id="image-upload-single"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <label htmlFor="image-upload-single">
          <Button variant="contained" component="span" startIcon={<PhotoCamera />}>
            Subir Imagen o arrastrala aquí
          </Button>
        </label>
  
        <Typography variant="body2" sx={{ mt: 1 }}>
          Máximo 5MB por imagen - JPG, PNG, etc.
        </Typography>
  
        {previewUrl && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2">Vista previa</Typography>
            <Box sx={{ position: 'relative', width: 150, height: 150, mx: 'auto' }}>
              <img
                src={previewUrl}
                alt="preview"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 8,
                  border: '2px solid var(--color-primario)'
                }}
              />
              <IconButton
                onClick={handleRemove}
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                
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
  
  ImageUploadSingle.propTypes = {
    onImageChange: PropTypes.func.isRequired,
    initialImage: PropTypes.string
  }
  
  export default ImageUploadSingle