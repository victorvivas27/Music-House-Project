import {
  Box,
  Button,
  CircularProgress,
  Modal,
  TextField,
  Typography
} from '@mui/material'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

import { updateAddress } from '../../../api/addresses'

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

const ModalUpdateDireccion = ({
  open,
  handleCloseModalDireccionUpdate,
  refreshUserData,
  selectedDireccion
}) => {
  const [formData, setFormData] = useState({
    street: '',
    number: '',
    city: '',
    state: '',
    country: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // 🚀 Cuando el teléfono seleccionado cambia, actualizar el formulario
  useEffect(() => {
    
    if (selectedDireccion) {
      setFormData({
        street: selectedDireccion.street || '',
        number: selectedDireccion.number || '',
        city: selectedDireccion.city || '',
        state: selectedDireccion.state || '',
        country: selectedDireccion.country || ''
      })
    }
  }, [selectedDireccion, open])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await updateAddress({
        idAddress: selectedDireccion.idAddress,
        ...formData
      })

      refreshUserData()
      setTimeout(() => {
        setLoading(false)
        handleCloseModalDireccionUpdate()
        Swal.fire({
          title: 'Direccion modificada',
          text: 'La direccion ha sido modificado con éxito.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          allowOutsideClick: false,
          timerProgressBar: true
        })
      }, 1500)
    } catch (error) {
      setError('Hubo un error al modificar la direccion.')
      setLoading(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleCloseModalDireccionUpdate}
      aria-labelledby="modal-title"
    >
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" component="h2">
          Modificar Direccion
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
            multiline
            rows={1}
          />
          <TextField
            fullWidth
            label="Numero"
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
            label="Pais"
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
            <Button onClick={handleCloseModalDireccionUpdate} color="secondary">
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
                'Guardar'
              )}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  )
}

ModalUpdateDireccion.propTypes = {
  open: PropTypes.bool.isRequired,
  handleCloseModalDireccionUpdate: PropTypes.func.isRequired,
  refreshUserData: PropTypes.func.isRequired,
  selectedDireccion: PropTypes.object
}

export default ModalUpdateDireccion
