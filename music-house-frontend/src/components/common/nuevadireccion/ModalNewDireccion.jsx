import {
  Box,
  Button,
  CircularProgress,
  Modal,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material'
import PropTypes from 'prop-types'
import { addAddress } from '../../../api/addresses'
import { useState } from 'react'
import Swal from 'sweetalert2'

const ModalNewDireccion = ({ open, handleClose, idUser, refreshUserData }) => {
  const [formData, setFormData] = useState({
    street: '',
    number: '',
    city: '',
    state: '',
    country: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await addAddress({ idUser, ...formData })
      refreshUserData()

      setFormData({
        street: '',
        number: '',
        city: '',
        state: '',
        country: ''
      })

      setTimeout(() => {
        setLoading(false)
        handleClose()
        Swal.fire({
          title: 'Dirección agregada',
          text: 'La dirección ha sido agregada con éxito.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          allowOutsideClick: false,
          timerProgressBar: true
        })
      }, 1500)
    } catch (error) {
      setError('Hubo un error al agregar la dirección.')
      setLoading(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" component="h2" textAlign="center">
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
            multiline
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
          />

          {error && <Typography color="error">{error}</Typography>}

          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={handleClose} color="secondary">
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

ModalNewDireccion.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  idUser: PropTypes.string.isRequired,
  refreshUserData: PropTypes.func.isRequired
}

export default ModalNewDireccion
