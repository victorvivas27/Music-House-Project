import { useEffect, useRef, useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  Typography,
  Grid,
  Divider,
  Tooltip,
  Checkbox,
  MenuItem,
  FormHelperText,
  Avatar
} from '@mui/material'
import CategorySelect from './CategorySelect'
import ThemeSelect from './ThemeSelect'
import { useAppStates } from '../utils/global.context'

import '../styles/crearInstrumento.styles.css'
import PropTypes from 'prop-types'
import ValidatedTextField from '../Pages/Admin/common/ValidatedTextField'
import ImageUpload from '../common/ImageUpload '

const InstrumentForm = ({ initialFormData, onSubmit }) => {
  const [formData, setFormData] = useState({ ...initialFormData })

  const { state } = useAppStates()
  const [errors, setErrors] = useState({})
  const [preview, setPreview] = useState(null)
  // Refs para auto-focus en errores
  const fieldRefs = {
    name: useRef(),
    description: useRef(),
    measures: useRef(),
    weight: useRef(),
    rentalPrice: useRef(),
    idCategory: useRef(),
    idTheme: useRef(),
    imageUrlsText: useRef()
  }

  const title = formData.idInstrument
    ? 'Editar Instrumento'
    : 'Registrar Instrumento'

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files) // 📌 Convertir FileList a array

    if (files.length > 0) {
      const validFiles = files.filter((file) => file.size <= 5 * 1024 * 1024) // Filtrar archivos de más de 5MB

      if (validFiles.length !== files.length) {
        alert('Algunas imágenes fueron rechazadas porque superan los 5MB.')
      }

      const previews = validFiles.map((file) => URL.createObjectURL(file))

      setPreview(previews) // ✅ Mostrar todas las imágenes en previsualización

      setFormData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...validFiles] // ✅ Agregar nuevas imágenes a las existentes
      }))
    }
  }

  useEffect(() => {
    if (!formData.name) {
      setFormData(initialFormData)
    }
  }, [formData.name, initialFormData])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: value || ''
    }))

    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleCheckChange = (id) => {
    setFormData((prev) => ({
      ...prev,
      characteristics: {
        ...prev.characteristics,
        [id]: !prev.characteristics?.[id]
      }
    }))
  }

  const validateForm = () => {
    let newErrors = {}

    if (!formData.name) newErrors.name = 'Este campo es obligatorio.'
    if (!formData.description)
      newErrors.description = 'Este campo es obligatorio.'
    if (!formData.measures) newErrors.measures = 'Este campo es obligatorio.'
    if (!formData.weight) newErrors.weight = 'Este campo es obligatorio.'
    if (!formData.rentalPrice)
      newErrors.rentalPrice = 'Este campo es obligatorio.'
    if (!formData.idCategory)
      newErrors.idCategory = 'Debes seleccionar una categoría.'
    if (!formData.idTheme) newErrors.idTheme = 'Debes seleccionar una temática.'

    // ✅ Validar que se suba al menos una imagen
    if (!formData.imageUrls || formData.imageUrls.length === 0) {
      newErrors.imageUrlsText = 'Debes subir al menos una imagen.'
    }

    setErrors(newErrors)

    // 📌 Enfocar el primer campo con error
    const firstError = Object.keys(newErrors)[0]
    if (firstError) {
      fieldRefs[firstError]?.current?.focus()
      return false
    }

    return true
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!validateForm()) {
      console.log('❌ El formulario tiene errores, no se envía.')
      return
    }

    console.log('📌 Datos antes de enviar:', formData)
    onSubmit(formData)
  }

  return (
    <>
      {/*Contenedor formulario carga de nuevo instrumento*/}
      <Grid
        sx={{
          width: '80%',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <form onSubmit={handleSubmit} className="formulario">
          <Grid sx={{ display: 'flex', flexDirection: 'row' }}>
            {/*-----------------------Formulario lado izquierdo------------------------ */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{ padding: 2, width: '60%', height: '100%' }}
            >
              <Typography variant="h6">{title}</Typography>

              <ValidatedTextField
                label="Nombre"
                name="name"
                value={formData.name}
                onChange={handleChange}
                inputRef={fieldRefs.name}
                error={errors.name}
              />

              <ValidatedTextField
                label="Descripción"
                name="description"
                value={formData.description}
                onChange={handleChange}
                inputRef={fieldRefs.description}
                error={errors.description}
                multiline
                minRows={3}
                maxRows={10}
              />

              <ValidatedTextField
                label="Medidas"
                name="measures"
                onChange={handleChange}
                value={formData.measures}
                inputRef={fieldRefs.measures}
                error={errors.measures}
              />

              <ValidatedTextField
                label="Peso"
                name="weight"
                onChange={handleChange}
                value={formData.weight}
                inputRef={fieldRefs.weight}
                error={errors.weight}
              />

              <ValidatedTextField
                label="Precio"
                name="rentalPrice"
                onChange={handleChange}
                value={formData.rentalPrice}
                inputRef={fieldRefs.rentalPrice}
                error={errors.rentalPrice}
              />
            </Grid>
            {/*---------------------Fin formulario lado izquierdo----------------*/}

            {/*---------------------formulario lado derecho----------------*/}
            <Grid
              item
              xs={12}
              md={6}
              sx={{ padding: 2, width: '50%', height: '100%' }}
            >
              <FormControl
                fullWidth
                margin="normal"
                error={!!errors.idCategory}
              >
                <CategorySelect
                  onChange={handleChange}
                  selectedCategoryId={formData?.idCategory}
                  label="Categoría" // ✅ Asegurar que siempre haya un label
                />
                <MenuItem value="" disabled>
                  Selecciona una categoría
                </MenuItem>
                <FormHelperText sx={{ color: 'red' }}>
                  {errors.idCategory}
                </FormHelperText>
              </FormControl>

              <FormControl fullWidth margin="normal" error={!!errors.idTheme}>
                <ThemeSelect
                  onChange={handleChange}
                  selectedThemeId={formData?.idTheme}
                  label="Temática" // ✅ Asegurar que siempre haya un label
                />
                <MenuItem value="" disabled>
                  Selecciona una temática
                </MenuItem>
                <FormHelperText sx={{ color: 'red' }}>
                  {errors.idTheme}
                </FormHelperText>
              </FormControl>
            </Grid>
            {/*-----------------------Fin formulario lado derecho--------------*/}
          </Grid>

          {/*-----------------------Input imagen--------------*/}
          <Grid item xs={12} md={6} sx={{ padding: 2, width: '100%' }}>
            <ImageUpload
              onImagesChange={(files) =>
                setFormData((prev) => ({ ...prev, imageUrls: files }))
              }
            />
            {/* 📌 Mensaje de error si el usuario no sube una imagen */}
            {errors.imageUrlsText && (
              <Typography color="var(--color-error)" variant="body1">
                {errors.imageUrlsText}
              </Typography>
            )}
          </Grid>
          {/*-----------------------Fin input imagen--------------*/}

          <Divider />

          <Box>
            <Typography variant="h6">Características</Typography>
            <Box
              sx={{ display: 'flex', flexWrap: 'wrap', paddingBottom: '1rem' }}
            >
              {state?.characteristics?.map((characteristic) => (
                <Box
                  key={characteristic.id}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Tooltip title={characteristic.name}>
                    <img
                      src={characteristic.image}
                      className="characteristic-image"
                      alt={characteristic.name}
                    />
                  </Tooltip>
                  <Checkbox
                    checked={
                      formData.characteristics?.[characteristic.id] || false
                    }
                    color="secondary"
                    onChange={() => handleCheckChange(characteristic.id)}
                  />
                </Box>
              ))}
            </Box>
          </Box>

          <Divider />

          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              paddingRight: '1rem',
              paddingTop: '1rem'
            }}
          >
            <Button variant="contained" color="primary" type="submit">
              Enviar
            </Button>
          </Box>
        </form>
      </Grid>
    </>
  )
}

export default InstrumentForm

// **Aquí agregamos la validación de Props**
InstrumentForm.propTypes = {
  initialFormData: PropTypes.shape({
    idInstrument: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    measures: PropTypes.string,
    weight: PropTypes.string,
    rentalPrice: PropTypes.string,
    idCategory: PropTypes.string,
    idTheme: PropTypes.string,
    imageUrlsText: PropTypes.string,
    characteristics: PropTypes.object
  }).isRequired,

  onSubmit: PropTypes.func
}
