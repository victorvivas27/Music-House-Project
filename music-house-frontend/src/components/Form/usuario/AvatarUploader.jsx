import { ParagraphResponsive } from '@/components/styles/ResponsiveComponents'
import { Avatar, Box, Typography } from '@mui/material'
import { ErrorMessage } from 'formik'
import PropTypes from 'prop-types'

export const AvatarUploader = ({
  preview,
  setPreview,
  setFieldValue,
  showError
}) => {
  const handleFileChange = (e) => {
    const file = e.currentTarget.files[0]
    if (file && file.size <= 5 * 1024 * 1024) {
      setPreview(URL.createObjectURL(file))
      setFieldValue('picture', file)
    } else {
      showError('El archivo supera el límite de 5MB')
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        padding: 2,
        border: '2px dashed #ccc',
        borderRadius: 3,
        backgroundColor: 'var(--color-primario)',
        width: 'fit-content',
        margin: '0 auto'
      }}
    >
      <label htmlFor="avatar-upload" style={{ cursor: 'pointer' }}>
        <Avatar
          src={preview}
          sx={{
            width: 100,
            height: 100,
            border: '2px solid #1976d2',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
        >
          {!preview && <ParagraphResponsive>Avatar</ParagraphResponsive>}
        </Avatar>
      </label>

      <input
        id="avatar-upload"
        name="picture"
        type="file"
        hidden
        onChange={handleFileChange}
      />

      <ParagraphResponsive
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: 'center' }}
      >
        Haz clic en la imagen para subir una nueva (máx 5MB)
      </ParagraphResponsive>

      <ErrorMessage name="picture">
        {(msg) => (
          <Typography color="error" variant="caption" sx={{ mt: 1 }}>
            {msg}
          </Typography>
        )}
      </ErrorMessage>
    </Box>
  )
}

AvatarUploader.propTypes = {
  preview: PropTypes.string,
  setPreview: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  showError: PropTypes.func.isRequired
}
