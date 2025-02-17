import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  TextField,
  Typography,
  Grid,
  Divider,
  Tooltip,
  Checkbox
} from '@mui/material'
import CategorySelect from './CategorySelect'
import ThemeSelect from './ThemeSelect'
import { useAppStates } from '../utils/global.context'

import '../styles/crearInstrumento.styles.css'

const InstrumentForm = ({ initialFormData, onSubmit }) => {
  const [formData, setFormData] = useState({ ...initialFormData })
  const [submitData, setSubmitData] = useState(false)
  const { state } = useAppStates()
  const title = formData.idInstrument
    ? 'Editar Instrumento'
    : 'Registrar Instrumento'

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData({ ...formData, [name]: value })
  }

  const handleCheckChange = (event) => {
    const characteristic = formData.characteristics[event.id]
    setFormData({
      ...formData,
      characteristics: {
        ...formData.characteristics,
        ...{ [event.id]: !characteristic }
      }
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const data = {
      idInstrument: formData.idInstrument,
      name: formData.name,
      description: formData.description,
      measures: formData.measures,
      weight: formData.weight,
      rentalPrice: formData.rentalPrice,
      idCategory: formData.idCategory,
      idTheme: formData.idTheme,
      imageUrls: formData.imageUrlsText.split(/[\n,\s]/),
      characteristics: formData.characteristics
    }

    setFormData(data)
    setSubmitData(true)
  }

  useEffect(() => {
    if (!submitData) return

    if (typeof onSubmit === 'function') onSubmit(formData)
  }, [submitData])

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
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                type="text"
                color="secondary"
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
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Medidas"
                name="measures"
                onChange={handleChange}
                value={formData.measures}
                type="text"
                color="secondary"
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Peso"
                name="weight"
                onChange={handleChange}
                value={formData.weight}
                type="number"
                color="secondary"
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Precio"
                name="rentalPrice"
                onChange={handleChange}
                value={formData.rentalPrice}
                type="number"
                color="secondary"
              />
            </FormControl>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{ padding: 2, width: '50%', height: '100%' }}
          >
            <Typography variant="h6">Asignar Categoría</Typography>
            <FormControl fullWidth margin="normal">
              <CategorySelect
                onChange={handleChange}
                selectedCategoryId={formData?.idCategory}
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <ThemeSelect
                onChange={handleChange}
                selectedThemeId={formData?.idTheme}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{ padding: 2, width: '100%', height: '100%' }}
        >
          <FormControl fullWidth margin="normal">
            <Typography variant="h6">Imágenes</Typography>
            <TextField
              placeholder="Agregue las urls de las imágenes separadas mediante espacios"
              name="imageUrlsText"
              multiline
              rows={5}
              onChange={handleChange}
              value={formData.imageUrlsText}
              color="secondary"
            />
          </FormControl>
        </Grid>
        <Divider />
        <Box>
          <Typography variant="h6">Características</Typography>
          <Box
            sx={{ display: 'flex', flexWrap: 'wrap', paddingBottom: '1rem' }}
          >
            {state?.characteristics?.map((characteristic) => {
              return (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Tooltip title={characteristic.name}>
                    <img
                      src={characteristic.image}
                      className="characteristic-image"
                    />
                  </Tooltip>
                  <Checkbox
                    checked={formData.characteristics[characteristic.id]}
                    color="secondary"
                    onChange={() => handleCheckChange(characteristic)}
                  />
                </Box>
              )
            })}
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
