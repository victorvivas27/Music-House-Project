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
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

import { updatePhone } from '../../../api/phones'

const ModalUpdatePhone = ({
  open,
  handleCloseModalPhoneUpdate,
  refreshUserData,
  selectedPhone
}) => {
  const [formData, setFormData] = useState({
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

  useEffect(() => {
    if (selectedPhone) {
      setFormData({
        phoneNumber: selectedPhone.phoneNumber || ''
      })
    }
  }, [selectedPhone, open])

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
      await updatePhone({ idPhone: selectedPhone.idPhone, ...formData })

      refreshUserData()
      setTimeout(() => {
        setLoading(false)
        handleCloseModalPhoneUpdate()
        Swal.fire({
          title: 'Teléfono modificado',
          text: 'El teléfono ha sido modificado con éxito.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          allowOutsideClick: false,
          timerProgressBar: true
        })
      }, 1500)
    } catch (error) {
      setError('Hubo un error al modificar el teléfono.')
      setLoading(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleCloseModalPhoneUpdate}
      aria-labelledby="modal-title"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" component="h2" textAlign="center">
          Modificar Teléfono
        </Typography>
        <form onSubmit={handleSubmit}>
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
            <Button onClick={handleCloseModalPhoneUpdate} color="secondary">
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
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Guardar'}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  )
}

ModalUpdatePhone.propTypes = {
  open: PropTypes.bool.isRequired,
  handleCloseModalPhoneUpdate: PropTypes.func.isRequired,
  refreshUserData: PropTypes.func.isRequired,
  selectedPhone: PropTypes.object
}

export default ModalUpdatePhone
