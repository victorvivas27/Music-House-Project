import { useEffect, useRef, useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  TextField,
  Typography,
  Grid,
  Divider,
  Tooltip,
  Checkbox,
  MenuItem,
  FormHelperText
} from '@mui/material'
import CategorySelect from './CategorySelect'
import ThemeSelect from './ThemeSelect'
import { useAppStates } from '../utils/global.context'

import '../styles/crearInstrumento.styles.css'
import PropTypes from 'prop-types'
import ValidatedTextField from '../Pages/Admin/common/ValidatedTextField'

const InstrumentForm = ({ initialFormData, onSubmit }) => {
  const [formData, setFormData] = useState({ ...initialFormData })
  const [submitData, setSubmitData] = useState(false)
  const { state } = useAppStates()
  const [errors, setErrors] = useState({})
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

  useEffect(() => {
    setFormData({ ...initialFormData }) // Asegurar que los datos iniciales se actualicen correctamente
  }, [initialFormData])

  useEffect(() => {
    if (submitData) {
      if (typeof onSubmit === 'function') {
        onSubmit(formData)
      }
      setSubmitData(false) // Restablecer estado después del envío
    }
  }, [formData, onSubmit, submitData]) // Solo se ejecuta cuando se activa `submitData`

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' })) // Limpiar errores cuando el usuario escribe
  }

  const handleCheckChange = (id) => {
    setFormData((prev) => ({
      ...prev,
      characteristics: {
        ...prev.characteristics,
        [id]: !prev.characteristics?.[id] // Usar opcional chaining para evitar errores
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
    if (!formData.imageUrlsText)
      newErrors.imageUrlsText = 'Este campo es obligatorio.'

    setErrors(newErrors)

    // Si hay errores, hacer focus en el primero
    const firstError = Object.keys(newErrors)[0]
    if (firstError) {
      fieldRefs[firstError]?.current?.focus()
      return false
    }

    return true
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!validateForm()) return
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrlsText.split(/[\n,\s]+/) // Evita errores en separación de URLs
    }))

    setSubmitData(true) // Activa el `useEffect` para enviar datos
  }

  return (
    <Grid
      sx={{
        width: '80%',
        border: '3px solid black',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <form onSubmit={handleSubmit} className="formulario">
        <Grid sx={{ display: 'flex', flexDirection: 'row' }}>
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

          <Grid
            item
            xs={12}
            md={6}
            sx={{ padding: 2, width: '50%', height: '100%' }}
          >
            <FormControl fullWidth margin="normal" error={!!errors.idCategory}>
              <CategorySelect
                onChange={handleChange}
                selectedCategoryId={formData?.idCategory}
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
              />
              <MenuItem value="" disabled>
                Selecciona una temática
              </MenuItem>
              <FormHelperText sx={{ color: 'red' }}>
                {errors.idTheme}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>

        <Grid
          item
          xs={12}
          md={6}
          sx={{ padding: 2, width: '100%', height: '100%' }}
        >
          <Typography variant="h6">Imágenes</Typography>
          <ValidatedTextField
            placeholder="Agregue las URLs de las imágenes separadas por comas"
            name="imageUrlsText"
            multiline
            rows={5}
            onChange={handleChange}
            value={formData.imageUrlsText}
            inputRef={fieldRefs.imageUrlsText}
            error={errors.imageUrlsText}
          />
        </Grid>

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
  )
}

export default InstrumentForm

// **Aquí agregamos la validación de Props**
InstrumentForm.propTypes = {
  initialFormData: PropTypes.shape({
    idInstrument: PropTypes.number, // Puede ser `null` si es un nuevo instrumento
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    measures: PropTypes.string,
    weight: PropTypes.number,
    rentalPrice: PropTypes.number.isRequired,
    idCategory: PropTypes.number.isRequired,
    idTheme: PropTypes.number.isRequired,
    imageUrlsText: PropTypes.string.isRequired, // Para evitar errores en `split`
    characteristics: PropTypes.object // Un objeto con claves dinámicas de características
  }).isRequired,

  onSubmit: PropTypes.func.isRequired
}
