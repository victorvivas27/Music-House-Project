import { useEffect, useRef, useState } from 'react'
import {
  Box,
  Grid,
  Tooltip,
  Checkbox,
  FormHelperText,
  CircularProgress
} from '@mui/material'
import { useAppStates } from '@/components/utils/global.context'
import ValidatedTextField from '@/Pages/Admin/common/ValidatedTextField'

import ImageUrlsEdit from '@/components/common/imageUrls/ImageUrlsEdit'
import ImageUpload from '@/components/common/imageUrls/ImageUpload '
import {
  ContainerBottom,
  CustomButton,
  ParagraphResponsive,
  TitleResponsive
} from '@/components/styles/ResponsiveComponents'
import ArrowBack from '@/components/utils/ArrowBack'
import LoadingText from '@/components/common/loadingText/LoadingText'
import PropTypes from 'prop-types'
import SelectInfinete from '@/components/common/selectInfinite/SelectInfinite'
import { getCategories } from '@/api/categories'
import { getTheme } from '@/api/theme'

const InstrumentForm = ({
  initialFormData,
  onSubmit,
  loading,
  isEditing = false
}) => {
  const [formData, setFormData] = useState({ ...initialFormData })
  const { state } = useAppStates()
  const [errors, setErrors] = useState({})
  const title = isEditing ? 'Editar Instrumento' : 'Crear Instrumento'
  const titleDelLoader = isEditing ? 'Editando' : 'Creando Instrumento'

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

    if (!formData.imageUrls || formData.imageUrls.length === 0) {
      newErrors.imageUrlsText = 'Se requiere una imagen.'
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
    <fieldset
      disabled={loading}
      style={{ border: 'none', padding: 0, margin: 0 }}
    >
      {/*Contenedor formulario carga de nuevo instrumento*/}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '1000px',
          margin: '0 auto',
          p: 4,
          borderRadius: 4,
          boxShadow: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}
      >
        <Grid container spacing={2}>
          {/*-----------------------Formulario lado izquierdo------------------------ */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              padding: 2
            }}
          >
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
          <Grid item xs={12} md={6}>
          
              <SelectInfinete
                label="🎸🎷Selecciona una Categoría 🥁🪘"
                name="idCategory"
                selectedValue={formData?.idCategory}
                onChange={handleChange}
                fetchDataFn={getCategories}
                getId={(cat) => cat.idCategory}
                getLabel={(cat) => cat.categoryName}
                pageSize={2}
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
            

           
              <SelectInfinete
                label="🎭 Selecciona una temática"
                name="idTheme"
                selectedValue={formData?.idTheme}
                onChange={handleChange}
                fetchDataFn={getTheme} 
                getId={(item) => item.idTheme}
                getLabel={(item) => item.themeName}
                pageSize={2}
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

          {/*-----------------------Input imagen--------------*/}

          <Box
            sx={{
              border: '1px dashed #aaa',
              borderRadius: 2,
              padding: 2,

              width: '100%',
              height: '300px'
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
            {/* 📌 Mensaje de error si el usuario no sube una imagen */}
            {errors.imageUrlsText && (
              <ParagraphResponsive color="var(--color-error)" mt={1}>
                {errors.imageUrlsText}
              </ParagraphResponsive>
            )}
          </Box>

          {/*-----------------------Fin input imagen--------------*/}

          <Box sx={{ width: '100%', paddingBottom: '1rem' }}>
            <TitleResponsive gutterBottom>Características</TitleResponsive>

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-evenly',
                gap: 2
              }}
            >
              {state?.characteristics?.map((characteristic) => (
                <Box
                  key={characteristic.id}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <Tooltip title={characteristic.name}>
                    <img
                      src={characteristic.image}
                      alt={characteristic.name}
                      style={{
                        width: '90px',
                        height: '90px',
                        objectFit: 'cover',
                        border: '2px solid #ccc',
                        borderRadius: '8px',
                        padding: '4px',
                        backgroundColor: '#fff',
                        boxShadow: 'var(--box-shadow)',
                        transition: 'transform 0.2s ease-in-out',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = 'scale(1.1)')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = 'scale(1)')
                      }
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

          <ArrowBack />

          <ContainerBottom>
            <CustomButton type="submit" disabled={loading}>
              {loading ? (
                <>
                  <LoadingText text={titleDelLoader} />

                  <CircularProgress
                    size={25}
                    sx={{ color: 'var(--color-azul)', ml: 1 }}
                  />
                </>
              ) : (
                title
              )}
            </CustomButton>
          </ContainerBottom>
        </Grid>
      </Box>
    </fieldset>
  )
}

export default InstrumentForm
InstrumentForm.propTypes = {
  initialFormData: PropTypes.object,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  isEditing: PropTypes.bool
}
