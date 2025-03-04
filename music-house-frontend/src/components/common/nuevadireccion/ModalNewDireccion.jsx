import {
  Box,
  Button,
  CircularProgress,
  Modal,
  TextField,
  Typography
} from '@mui/material'
import PropTypes from 'prop-types'
import { addAddress } from '../../../api/addresses'
import { useState } from 'react'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px'
}

const ModalNewDireccion = ({ open, handleClose, idUser, refreshUserData }) => {
  // Estado para los campos del formulario
  const [formData, setFormData] = useState({
    street: '',
    number: '',
    city: '',
    state: '',
    country: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Manejo de cambios en los inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await addAddress({ idUser, ...formData })
      refreshUserData() // 🔄 Actualiza la lista de direcciones

      setSuccess('Dirección agregada con éxito.')
      setFormData({
        street: '',
        number: '',
        city: '',
        state: '',
        country: ''
      }) // Limpiar formulario

      // 🔹 Mantenemos el `loading` activo por 1.5 segundos antes de cerrar
      setTimeout(() => {
        setLoading(false)
        handleClose()
      }, 1500)
    } catch (error) {
      setError('Hubo un error al agregar la dirección.')
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" component="h2">
          Agregar Nueva Dirección
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Calle"
            name="street"
            value={formData.street}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Número"
            name="number"
            value={formData.number}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Ciudad"
            name="city"
            value={formData.city}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Estado"
            name="state"
            value={formData.state}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="País"
            name="country"
            value={formData.country}
            onChange={handleChange}
            margin="normal"
            required
          />
          {error && <Typography color="error">{error}</Typography>}
          {success && <Typography color="green">{success}</Typography>}
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={handleClose} color="secondary">
              Cancelar
            </Button>
            {/* Botón con Loading */}
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

ModalNewDireccion.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  idUser: PropTypes.string.isRequired,
  refreshUserData: PropTypes.func.isRequired
}

export default ModalNewDireccion
