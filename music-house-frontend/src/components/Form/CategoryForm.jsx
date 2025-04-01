import { useEffect, useRef, useState } from 'react'
import { Box, FormControl, TextField, CircularProgress } from '@mui/material'
import PropTypes from 'prop-types'
import ArrowBack from '../utils/ArrowBack'

import { inputStyles } from '../styles/styleglobal'
import {
  ContainerBottom,
  CustomButton,
  TitleResponsive
} from './formUsuario/CustomButton'
import LoadingText from '../common/loadingText/LoadingText'

export const CategoryForm = ({ initialFormData, onSubmit, loading }) => {
  const [formData, setFormData] = useState({ ...initialFormData })
  const [submitData, setSubmitData] = useState(false)
  const [errors, setErrors] = useState({})
  const title = formData.idCategory ? 'Editar Categoría' : 'Registrar Categoría'

  const fileRefs = {
    categoryName: useRef(),
    description: useRef()
  }

  const validateForm = () => {
    let newErrors = {}
    if (!formData.categoryName)
      newErrors.categoryName = 'Este campo es obligatorio.'

    if (!formData.description)
      newErrors.description = 'Este campo es obligatorio.'

    setErrors(newErrors)

    const firstError = Object.keys(newErrors)[0]
    if (firstError && fileRefs[firstError]?.current) {
      fileRefs[firstError].current.focus()
      return false
    }
    return true
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const data = {
      idCategory: formData.idCategory,
      categoryName: formData.categoryName,
      description: formData.description
    }
    if (!validateForm()) {
      return
    }
    setFormData(data)
    setSubmitData(true)
  }

  useEffect(() => {
    if (!submitData) return

    if (typeof onSubmit === 'function') onSubmit(formData)
    setSubmitData(false)
  }, [formData, onSubmit, submitData])

  return (
    <fieldset
      disabled={loading}
      style={{ border: 'none', padding: 0, margin: 0 }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '600px',
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
        <TitleResponsive>{title}</TitleResponsive>

        <FormControl>
          <TextField
            label="Nombre"
            name="categoryName"
            value={formData.categoryName}
            onChange={handleChange}
            type="text"
            inputRef={fileRefs.categoryName}
            error={Boolean(errors.categoryName)}
            helperText={errors.categoryName}
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
            type="text"
            inputRef={fileRefs.description}
            error={Boolean(errors.description)}
            helperText={errors.description}
            multiline
            minRows={3}
            maxRows={10}
            sx={{ ...inputStyles }}
          />
        </FormControl>

        <ContainerBottom>
          <ArrowBack />

          <CustomButton disabled={loading} type="submit">
            {loading ? (
              <>
                <LoadingText text="Creando tematica" />
                <CircularProgress
                  size={30}
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

CategoryForm.propTypes = {
  initialFormData: PropTypes.shape({
    idCategory: PropTypes.string,
    categoryName: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
}
