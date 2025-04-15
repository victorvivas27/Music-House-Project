import { Avatar, Box, Typography } from "@mui/material"
import { ErrorMessage } from "formik"
import PropTypes from "prop-types"

export const AvatarUploader = ({ preview, setPreview, setFieldValue, showError }) => {
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
          gap: 1,
          marginBottom: 2
        }}
      >
        <label htmlFor="avatar-upload">
          <Avatar
            src={preview}
            sx={{ width: 100, height: 100, cursor: 'pointer' }}
          >
            {!preview && 'A'}
          </Avatar>
        </label>
  
        <input
          id="avatar-upload"
          name="picture"
          type="file"
          hidden
          onChange={handleFileChange}
        />
  
        <ErrorMessage name="picture">
          {(msg) => <Typography color="error">{msg}</Typography>}
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