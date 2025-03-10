import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputAdornment,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material'
import PropTypes from 'prop-types'

import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { addPhone } from '../../../api/phones'
import { countryCodes } from '../../utils/codepaises/CountryCodes'
import { CustomButton } from '../../Form/formUsuario/CustomComponents'

const ModalNewPhone = ({
  open,
  handleCloseModalPhone,
  idUser,
  refreshPhoneData
}) => {
  const [formData, setFormData] = useState({
    countryCode: '', // 📌 Código vacío al inicio
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
  // 📌 Restablece el formulario cuando se cierra el modal
  useEffect(() => {
    if (!open) {
      setFormData({ countryCode: '', phoneNumber: '' })
      setError(null) // También limpia errores al cerrar
    }
  }, [open])

  // 📌 Manejo del cambio en el código de país
  const handleCountryCodeChange = (event) => {
    setFormData({
      countryCode: event.target.value,
      phoneNumber: '' // 🔹 Borra el número al cambiar el código de país
    })
    setError(null)
  }

  // 📌 Manejo del cambio en el número de teléfono
  const handlePhoneChange = (event) => {
    let value = event.target.value.replace(/\D/g, '') // 🔹 Solo permite números

    if (!formData.countryCode) {
      setError('Debe seleccionar un código de país antes de escribir.')
      return
    }

    setError(null)
    setFormData((prev) => ({
      ...prev,
      phoneNumber: value
    }))
  }

  // 📌 Validación antes de enviar
  const validatePhoneNumber = () => {
    const minLength = 7
    const maxLength = 15

    if (!formData.phoneNumber || formData.phoneNumber.length < minLength) {
      setError(`⚠️ Mínimo ${minLength} dígitos`)
      return false
    }
    if (formData.phoneNumber.length > maxLength) {
      setError(`⚠️ Máximo ${maxLength} dígitos`)
      return false
    }
    return true
  }

  // 📌 Manejo del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!formData.countryCode) {
      setError('Debe seleccionar un código de país.')
      setLoading(false)
      return
    }

    if (!validatePhoneNumber()) {
      setLoading(false)
      return
    }

    try {
      const fullPhoneNumber = `${formData.countryCode}${formData.phoneNumber}`
      await addPhone({ idUser, phoneNumber: fullPhoneNumber })

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

        setFormData({ countryCode: '', phoneNumber: '' }) // 🔹 Limpia el formulario
      }, 1500)
      await refreshPhoneData()
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
        <Typography
          id="modal-title"
          variant="h6"
          component="h2"
          textAlign="center"
        >
          Agregar un Nuevo Teléfono
        </Typography>
        <form onSubmit={handleSubmit}>
          {/* 📌 Select para código de país */}
          <FormControl fullWidth margin="normal">
            <Select
              displayEmpty
              value={formData.countryCode}
              onChange={handleCountryCodeChange}
              sx={{
                backgroundColor: '#D7D7D7D7',
                color: 'var(--color-secundario)',
                borderRadius: '5px',
                '&:hover': {
                  backgroundColor: '#D7D7D7D7'
                }
              }}
            >
              <MenuItem value="" disabled>
                Selecciona un código de país
              </MenuItem>
              {countryCodes.map((country) => (
                <MenuItem key={country.code} value={country.code}>
                  {country.country} ({country.code})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* 📌 Input para número de teléfono con código visible */}

          <TextField
            fullWidth
            label="Número de Teléfono"
            value={formData.phoneNumber}
            onChange={handlePhoneChange}
            margin="normal"
            required
            multiline
            disabled={!formData.countryCode} // 🔹 Bloquea el input hasta que se seleccione un código
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {formData.countryCode || '📞'}
                </InputAdornment>
              )
            }}
          />

          {/* 📌 Mensaje de error con espacio fijo debajo del input */}
          <Typography
            color="error"
            sx={{ minHeight: '20px', display: 'block' }}
          >
            {error || ' '}
          </Typography>

          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={handleCloseModalPhone} color="secondary">
              Cancelar
            </Button>
            <CustomButton
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{
                minWidth: '150px', // Ancho suficiente para acomodar el texto y el spinner
                minHeight: '40px',
               
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px' // Agrega un pequeño espacio entre el spinner y el texto
              }}
            >
              {loading ? (
                <>
                  <CircularProgress
                    size={20}
                    sx={{ color: 'var(--color-azul)' }}
                  />
                  Cargando...
                </>
              ) : (
                'Agregar'
              )}
            </CustomButton>
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
