import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography
} from '@mui/material'
import PropTypes from 'prop-types'

import { useState } from 'react'
import Swal from 'sweetalert2'
import { addPhone } from '../../../api/phones'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px'
}

// 📌 Lista de códigos de país para Latinoamérica (Mercosur)
const countryCodes = [
  { code: '+54', country: 'Argentina' },
  { code: '+55', country: 'Brasil' },
  { code: '+56', country: 'Chile' },
  { code: '+595', country: 'Paraguay' },
  { code: '+598', country: 'Uruguay' }
]

const ModalNewPhone = ({ open, handleCloseModalPhone, idUser, refreshPhoneData }) => {
  const [formData, setFormData] = useState({
    countryCode: '', // 📌 Código por defecto: Argentina
    phoneNumber: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Manejo de cambios en los inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Manejo del cambio en el código de país
  const handleCountryCodeChange = (event) => {
    setFormData({
      ...formData,
      countryCode: event.target.value
    })
  }

  // Enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const formattedPhoneNumber = `${formData.countryCode}${formData.phoneNumber}` // 📌 Formato final del número
      await addPhone({ idUser, phoneNumber: formattedPhoneNumber }) // 📌 Enviar al backend como un solo campo
      await refreshPhoneData() // 🔄 Asegurar que se actualiza la lista de teléfonos

      // 🔹 Limpiar el formulario antes de cerrar
      setFormData({
        countryCode: '',
        phoneNumber: ''
      })

    

      setTimeout(() => {
        setLoading(false)
        handleCloseModalPhone()
          // 🔹 Mostrar alerta y cerrar modal después de 1.5 segundos
      Swal.fire({
        title: 'Teléfono agregado',
        text: 'El teléfono ha sido agregado con éxito.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        allowOutsideClick: false,
        timerProgressBar: true
      })
      }, 1500)
    } catch (error) {
      setError('Hubo un error al agregar el teléfono.')
      setLoading(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleCloseModalPhone}
      aria-labelledby="modal-title"
    >
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" component="h2">
          Agregar un Nuevo Teléfono
        </Typography>
        <form onSubmit={handleSubmit}>
          {/* 📌 Select para elegir el código de país */}
          <FormControl fullWidth margin="normal">
           
            <Select
              value={formData.countryCode}
              onChange={handleCountryCodeChange}
            >
              {countryCodes.map((country) => (
                <MenuItem key={country.code} value={country.code}>
                  {country.country} ({country.code})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* 📌 Campo para el número de teléfono */}
          <TextField
            fullWidth
            label="Número de Teléfono"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            margin="normal"
            required
            multiline
            rows={1}
          />

          {error && <Typography color="error">{error}</Typography>}

          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={handleCloseModalPhone} color="secondary">
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{
                minWidth: '100px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                'Agregar'
              )}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  )
}

ModalNewPhone.propTypes = {
  open: PropTypes.bool.isRequired,
  handleCloseModalPhone: PropTypes.func.isRequired,
  idUser: PropTypes.string.isRequired,
  refreshPhoneData: PropTypes.func.isRequired
}

export default ModalNewPhone
