import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material'
import PropTypes from 'prop-types'

import { useState } from 'react'
import Swal from 'sweetalert2'
import { addPhone } from '../../../api/phones'
import { countryCodes } from '../../utils/codepaises/CountryCodes'
const ModalNewPhone = ({ open, handleCloseModalPhone, idUser, refreshPhoneData }) => {
  const [formData, setFormData] = useState({
    countryCode: '+54', // 📌 Código por defecto: Argentina
    phoneNumber: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isMobile = useMediaQuery('(max-width:600px)')

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isMobile ? '90%' : 500,
    bgcolor: 'background.paper',
    borderRadius: '8px',
    boxShadow: 24,
    p: isMobile ? 3 : 4
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleCountryCodeChange = (event) => {
    setFormData({
      ...formData,
      countryCode: event.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const formattedPhoneNumber = `${formData.countryCode}${formData.phoneNumber}`
      await addPhone({ idUser, phoneNumber: formattedPhoneNumber })
      await refreshPhoneData()

      setFormData({
        countryCode: '+54',
        phoneNumber: ''
      })

      setTimeout(() => {
        setLoading(false)
        handleCloseModalPhone()
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
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" component="h2" textAlign="center">
          Agregar un Nuevo Teléfono
        </Typography>
        <form onSubmit={handleSubmit}>
          {/* 📌 Select para código de país */}
          <FormControl fullWidth margin="normal">
            <Select
              value={formData.countryCode}
              onChange={handleCountryCodeChange}
              displayEmpty
              sx={{ height: '50px' }} // 🔹 Ajuste para móviles
            >
              {countryCodes.map((country) => (
                <MenuItem key={country.code} value={country.code}>
                  {country.country} ({country.code})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* 📌 Campo para número de teléfono */}
          <TextField
            fullWidth
            label="Número de Teléfono"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            margin="normal"
            required
            multiline
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
                minWidth: isMobile ? '80px' : '100px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Agregar'}
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
