import { useEffect, useRef, useState } from 'react'
import { Box, CircularProgress, TextField, FormControl } from '@mui/material'
import PropTypes from 'prop-types'
import ArrowBack from '../utils/ArrowBack'
import { inputStyles } from '../styles/styleglobal'
import ImageUpload from '../common/imageUrls/ImageUpload '
import LoadingText from '../common/loadingText/LoadingText'
import { ContainerBottom, CustomButton, ParagraphResponsive } from '../styles/ResponsiveComponents'

export const ThemeForm = ({ initialFormData, onSubmit, loading }) => {
  const [formData, setFormData] = useState({ ...initialFormData })

  const [errors, setErrors] = useState({})
  const title = formData.idTheme ? 'Editar Tematica' : 'Registrar Tematica'

  const fileRefs = {
    themeName: useRef(),
    description: useRef(),
    imageUrlsText: useRef()
  }

  useEffect(() => {
    if (!formData) {
      setFormData(initialFormData)
    }
  }, [formData, initialFormData])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: value || ''
    }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    let newErrors = {}
    if (!formData.themeName) newErrors.themeName = 'Este campo es obligatorio.'

    if (!formData.description)
      newErrors.description = 'Este campo es obligatorio.'

    if (!formData.imageUrls || formData.imageUrls.length === 0) {
      newErrors.imageUrlsText = 'Se requiere una imagen.'
    }

    setErrors(newErrors)

    const firstError = Object.keys(newErrors)[0]
    if (firstError && fileRefs[firstError]?.current) {
      fileRefs[firstError].current.focus()
      return false
    }
    return true
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!validateForm()) {
      return
    }
    onSubmit(formData)
  }

  return (
    <fieldset
      disabled={loading}
      style={{ border: 'none', padding: 0, margin: 0 }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '700px',
          margin: '0 auto',
          p: 4,
          border: '1px solid #ccc',
          borderRadius: 4,
          boxShadow: 3,
          backgroundColor: '#fff',
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}
      >

        <FormControl>
          <TextField
            label="Nombre"
            name="themeName"
            value={formData.themeName}
            onChange={handleChange}
            type="text"
            inputRef={fileRefs.themeName}
            error={Boolean(errors.themeName)}
            helperText={errors.themeName}
            multiline
            minRows={1}
            maxRows={5}
            fullWidth
            sx={{ ...inputStyles }}
          />
        </FormControl>

        <FormControl>
          <TextField
            label="Descripción"
            name="description"
            value={formData.description}
            onChange={handleChange}
            inputRef={fileRefs.description}
            error={Boolean(errors.description)}
            helperText={errors.description}
            type="text"
            multiline
            minRows={3}
            maxRows={10}
            fullWidth
            sx={{ ...inputStyles }}
          />
        </FormControl>

        <Box
          sx={{
            border: '1px dashed #aaa',
            borderRadius: 2,
            padding: 2,
            backgroundColor: '#fafafa'
          }}
        >
          <ImageUpload
            onImagesChange={(files) => {
              setFormData((prev) => ({ ...prev, imageUrls: files }))
              if (files.length > 0) {
                setErrors((prev) => ({ ...prev, imageUrlsText: '' }))
              }
            }}
          />
          {errors.imageUrlsText && (
            <ParagraphResponsive
              color="var(--color-error)"
              mt={1}
            >
              {errors.imageUrlsText}
            </ParagraphResponsive>
          )}
        </Box>

        <ContainerBottom>
          <ArrowBack />
          <CustomButton disabled={loading} type="submit">
            {loading ? (
              <>
                <LoadingText text={title} />
                <CircularProgress
                  size={24}
                  sx={{ ml: 1, color: 'var(--color-azul)' }}
                />
              </>
            ) : (
              'Enviar'
            )}
          </CustomButton>
        </ContainerBottom>
      </Box>
    </fieldset>
  )
}

ThemeForm.propTypes = {
  initialFormData: PropTypes.shape({
    idTheme: PropTypes.string,
    themeName: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
}
