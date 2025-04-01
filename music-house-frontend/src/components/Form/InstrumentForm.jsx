import { useEffect, useRef, useState } from 'react'
import {
  Box,
  FormControl,
  Typography,
  Grid,
  Divider,
  Tooltip,
  Checkbox,
  FormHelperText,
  CircularProgress
} from '@mui/material'
import CategorySelect from './CategorySelect'
import ThemeSelect from './ThemeSelect'
import { useAppStates } from '../utils/global.context'
import PropTypes from 'prop-types'
import ValidatedTextField from '../Pages/Admin/common/ValidatedTextField'

import { inputStyles } from '../styles/styleglobal'
import ArrowBack from '../utils/ArrowBack'

import ImageUpload from '../common/imageUrls/ImageUpload '
import ImageUrlsEdit from '../common/imageUrls/ImageUrlsEdit'
import { CustomButton } from './formUsuario/CustomButton'

const InstrumentForm = ({
  initialFormData,
  onSubmit,
  loading,
  isEditing = false
}) => {
  const [formData, setFormData] = useState({ ...initialFormData })
  const { state } = useAppStates()
  const [errors, setErrors] = useState({})
  const title = isEditing ? 'Editar Instrumento' : 'Registrar Instrumento'
  const titleDelLoader = isEditing ? 'Editando...' : 'Creando...'

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

    if (!formData.weight) {
      newErrors.weight = 'Este campo es obligatorio.'
    } else if (isNaN(formData.weight)) {
      newErrors.weight = 'Debe ser un número válido.'
    }

    if (!formData.rentalPrice) {
      newErrors.rentalPrice = 'Este campo es obligatorio.'
    } else if (isNaN(formData.rentalPrice)) {
      newErrors.rentalPrice = 'Debe ser un número válido.'
    }

    if (
      !formData.idCategory ||
      (typeof formData.idCategory === 'string' &&
        formData.idCategory.trim() === '')
    ) {
      newErrors.idCategory = 'Debes seleccionar una categoría.'
    }

    setErrors(newErrors)

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
      return
    }

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
          justifyContent: 'center',
          boxShadow: 'var(--box-shadow)'
        }}
      >
        <form onSubmit={handleSubmit} className="formulario">
          <Grid
            sx={{
              display: 'flex',
              flexDirection: 'row'
            }}
          >
            {/*-----------------------Formulario lado izquierdo------------------------ */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                padding: 2,
                width: '90%'
              }}
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
              <FormHelperText>
                ℹ️ Formato: Menos de 1 kg se mostrará en gramos (ej: 0.3 → 300
                gramos). 1 kg o más se mostrará como kilos y gramos (ej: 1.4 → 1
                kilo 400 gramos).
              </FormHelperText>
            </Grid>
            {/*---------------------Fin formulario lado izquierdo----------------*/}

            {/*---------------------Formulario lado derecho----------------*/}
            <Grid item xs={12} md={6} sx={{ padding: 2, width: '90%' }}>
              <FormControl
                margin="normal"
                sx={{
                  ...inputStyles,
                  '& .MuiInputBase-input': {
                    color: 'var(--color-azul)'
                  }
                }}
              >
                <CategorySelect
                  onChange={handleChange}
                  selectedCategoryId={formData?.idCategory}
                  label=""
                />
                {/* 📌 Leyenda debajo del select */}
                <FormHelperText
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'orange'
                  }}
                >
                  ⚠️ Recuerda seleccionar una categoría antes de continuar.
                </FormHelperText>
              </FormControl>

              <FormControl
                margin="normal"
                sx={{
                  ...inputStyles,
                  '& .MuiInputBase-input': {
                    color: 'var(--color-azul)'
                  }
                }}
              >
                <ThemeSelect
                  onChange={handleChange}
                  selectedThemeId={formData?.idTheme}
                  label=""
                />
                {/* 📌 Leyenda debajo del select */}
                <FormHelperText
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'orange'
                  }}
                >
                  ⚠️ No olvides elegir una temática para tu instrumento.
                </FormHelperText>
              </FormControl>

              <ValidatedTextField
                label="Precio"
                name="rentalPrice"
                onChange={handleChange}
                value={formData.rentalPrice}
                inputRef={fieldRefs.rentalPrice}
                error={errors.rentalPrice}
              />
              <ImageUrlsEdit idInstrument={formData.idInstrument} />
            </Grid>
            {/*-----------------------Fin formulario lado derecho--------------*/}
          </Grid>

          {/*-----------------------Input imagen--------------*/}

          <Grid
            item
            xs={12}
            md={6}
            sx={{
              padding: 2,
              width: '100%',
              height: '230px',
              boxShadow: 'var(--box-shadow)',
              borderRadius: 4
            }}
          >
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
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                paddingBottom: '1rem',
                justifyContent: 'space-evenly'
              }}
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
          <ArrowBack />

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
            <CustomButton
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{
                width: '280px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              <Box sx={{ width: '100%', textAlign: 'center' }}>
                {loading ? (
                  <>
                    {titleDelLoader}
                    <CircularProgress
                      size={25}
                      sx={{ color: 'var(--color-azul)', ml: 1 }}
                    />
                  </>
                ) : (
                  title
                )}
              </Box>
            </CustomButton>
          </Box>
        </form>
      </Grid>
    </>
  )
}

export default InstrumentForm
InstrumentForm.propTypes = {
  initialFormData: PropTypes.object,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  isEditing: PropTypes.bool
}
