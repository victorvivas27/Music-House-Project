import { Delete, PhotoCamera } from "@mui/icons-material"
import { Box, Button, IconButton, Typography } from "@mui/material"
import PropTypes from "prop-types"
import { useEffect, useState } from "react"

const ImageUploadMultiple = ({ onImagesChange, initialImages = [] }) => {
    const [previewUrls, setPreviewUrls] = useState([])
    const [files, setFiles] = useState([])
  
    useEffect(() => {
      const previews = initialImages.map((img) =>
        typeof img === 'string' ? img : URL.createObjectURL(img)
      )
      setPreviewUrls(previews)
      setFiles(initialImages)
    }, [initialImages])
  
    const handleFileChange = (event) => {
      const selected = Array.from(event.target.files || [])
      const validFiles = selected.filter((file) => file.size <= 5 * 1024 * 1024)
  
      if (validFiles.length !== selected.length) {
        alert('Algunas imágenes superan los 5MB permitidos.')
      }
  
      const newPreviews = validFiles.map((file) => URL.createObjectURL(file))
      const updatedFiles = [...files, ...validFiles]
  
      setFiles(updatedFiles)
      setPreviewUrls((prev) => [...prev, ...newPreviews])
      onImagesChange(updatedFiles)
    }
  
    const handleRemove = (index) => {
      const updatedPreviews = [...previewUrls]
      const updatedFiles = [...files]
      updatedPreviews.splice(index, 1)
      updatedFiles.splice(index, 1)
  
      setPreviewUrls(updatedPreviews)
      setFiles(updatedFiles)
      onImagesChange(updatedFiles)
    }
  
    return (
        <Box
        sx={{
          textAlign: 'center',
          border: '2px dashed #aaa',
          borderRadius: 2,
          p: 2,
          mt: 2,
          backgroundColor: '#fafafa',
          cursor: 'pointer'
        }}
        onDrop={(e) => {
          e.preventDefault()
          const droppedFiles = Array.from(e.dataTransfer.files || [])
          const validFiles = droppedFiles.filter((file) => file.size <= 5 * 1024 * 1024)
      
          if (validFiles.length !== droppedFiles.length) {
            alert('Algunas imágenes superan los 5MB permitidos.')
          }
      
          const newPreviews = validFiles.map((file) => URL.createObjectURL(file))
          const updatedFiles = [...files, ...validFiles]
      
          setFiles(updatedFiles)
          setPreviewUrls((prev) => [...prev, ...newPreviews])
          onImagesChange(updatedFiles)
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        <input
          type="file"
          accept="image/*"
          id="image-upload-multiple"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <label htmlFor="image-upload-multiple">
          <Button variant="contained" component="span" startIcon={<PhotoCamera />}>
            Subir Imágenes o arrástralas aquí
          </Button>
        </label>
      
        <Typography variant="body2" sx={{ mt: 1 }}>
          Máximo 5MB por imagen - JPG, PNG, etc.
        </Typography>
      
        {previewUrls.length > 0 && (
          <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            {previewUrls.map((url, index) => (
              <Box key={index} sx={{ position: 'relative', width: 150, height: 150 }}>
                <img
                  src={url}
                  alt={`img-${index}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 8,
                    border: '2px solid var(--color-primario)'
                  }}
                />
                <IconButton
                  onClick={() => handleRemove(index)}
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
            ))}
          </Box>
        )}
      </Box>
    )
  }
  
  ImageUploadMultiple.propTypes = {
    onImagesChange: PropTypes.func.isRequired,
    initialImages: PropTypes.array
  }
  
  export default ImageUploadMultiple