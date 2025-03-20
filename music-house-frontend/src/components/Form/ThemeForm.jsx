import { useEffect, useState } from 'react'
import {
  Box,
 FormControl,
  TextField,
  Typography,
  Grid,
  CircularProgress
} from '@mui/material'

import '../styles/crearInstrumento.styles.css'
import PropTypes from 'prop-types'
import ArrowBack from '../utils/ArrowBack'
import { flexRowContainer, inputStyles } from '../styles/styleglobal'
import { CustomButton } from './formUsuario/CustomComponents'

export const ThemeForm = ({ initialFormData, onSubmit, loading }) => {
  const [formData, setFormData] = useState({ ...initialFormData })
  const [submitData, setSubmitData] = useState(false)
  const title = formData.idTheme ? 'Editar Tematica' : 'Registrar Tematica'

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const data = {
      idTheme: formData.idTheme,
      themeName: formData.themeName,
      description: formData.description
    }

    setFormData(data)
    setSubmitData(true)

    setTimeout(() => {
      setFormData({
        idTheme: '',
        themeName: '',
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
        borderRadius: '10px',
        ...flexRowContainer
      }}
    >
      <form onSubmit={handleSubmit}>
        <Grid sx={{ ...flexRowContainer }}>
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
                name="themeName"
                value={formData.themeName}
                onChange={handleChange}
                required
                type="text"
                color="secondary"
                multiline
                minRows={1}
                maxRows={5}
                sx={{ ...inputStyles, width: '900px' }}
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
                sx={{ ...inputStyles, width: '900px' }}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center'
          }}
        >
          <ArrowBack />
          <CustomButton variant="contained" type="submit">
            {loading ? (
              <>
                Enviando...
                <CircularProgress
                  size={30}
                  sx={{ color: 'var(--color-azul)' }}
                />
              </>
            ) : (
              'Enviar'
            )}
          </CustomButton>
        </Box>
      </form>
    </Grid>
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
