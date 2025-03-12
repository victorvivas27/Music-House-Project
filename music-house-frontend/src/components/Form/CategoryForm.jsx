import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  TextField,
  Typography,
  Grid
} from '@mui/material'

import '../styles/crearInstrumento.styles.css'
import PropTypes from 'prop-types'
import ArrowBack from '../utils/ArrowBack'

export const CategoryForm = ({ initialFormData, onSubmit }) => {
  const [formData, setFormData] = useState({ ...initialFormData })
  const [submitData, setSubmitData] = useState(false)
  const title = formData.idCategory ? 'Editar Categoría' : 'Registrar Categoría'

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

    setFormData(data)
    setSubmitData(true)

    // Reiniciar el formulario después de enviar
    setTimeout(() => {
      setFormData({
        idCategory: '',
        categoryName: '',
        description: ''
      })
      setSubmitData(false) 
    }, 500)
  }

  useEffect(() => {
    if (!submitData) return

    if (typeof onSubmit === 'function') onSubmit(formData)
    setSubmitData(false)
  }, [formData, onSubmit, submitData])

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

            <FormControl fullWidth margin="normal">
              <TextField
                label="Nombre"
                name="categoryName"
                value={formData.categoryName}
                onChange={handleChange}
                required
                type="text"
                color="secondary"
                multiline
                minRows={1}
                maxRows={8}
                sx={{width:500}}
              />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <TextField
                label="Descripción"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                type="text"
                color="secondary"
                multiline
                minRows={3}
                maxRows={10}
                sx={{width:500}}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            
          }}
        >

          <ArrowBack  />
          <Button variant="contained" color="primary" type="submit">
            Enviar
          </Button>
        </Box>
      </form>
    </Grid>
  )
}
// **Aquí agregamos la validación de Props**
CategoryForm.propTypes = {
  initialFormData: PropTypes.shape({
    idCategory: PropTypes.string,
    categoryName: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  }).isRequired,
  onSubmit: PropTypes.func.isRequired
}
