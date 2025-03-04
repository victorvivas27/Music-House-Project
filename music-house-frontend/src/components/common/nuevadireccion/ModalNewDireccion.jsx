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
import Swal from 'sweetalert2'

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

    try {
      await addAddress({ idUser, ...formData })
      refreshUserData() // 🔄 Actualiza la lista de direcciones

      setFormData({
        street: '',
        number: '',
        city: '',
        state: '',
        country: ''
      }) // Limpiar formulario

      // 🔹 Cerrar modal después de mostrar la alerta
      setTimeout(() => {
        setLoading(false)
        handleClose()
        // 🔹 Mostrar SweetAlert2 sin botón de confirmación y con auto-cierre en 1.5s
        Swal.fire({
          title: 'Dirección agregada',
          text: 'La dirección ha sido agregada con éxito.',
          icon: 'success',
          timer: 1500, // ⏳ Se cierra en 1.5 segundos
          showConfirmButton: false, // ❌ Oculta el botón de "OK"
          allowOutsideClick: false, // Evita que se cierre si el usuario hace clic afuera
          timerProgressBar: true // Muestra barra de tiempo de cierre
        })
      }, 1500) // ⏳ Mismo tiempo que la alerta
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
            multiline
            rows={1} // 🔹 Hace el campo más alto (3 líneas)
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
            multiline
            rows={1}
          />
          <TextField
            fullWidth
            label="Ciudad"
            name="city"
            value={formData.city}
            onChange={handleChange}
            margin="normal"
            required
            multiline
            rows={1}
          />
          <TextField
            fullWidth
            label="Estado"
            name="state"
            value={formData.state}
            onChange={handleChange}
            margin="normal"
            required
            multiline
            rows={1}
          />
          <TextField
            fullWidth
            label="País"
            name="country"
            value={formData.country}
            onChange={handleChange}
            margin="normal"
            required
            multiline
            rows={1}
          />
          {error && <Typography color="error">{error}</Typography>}

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
