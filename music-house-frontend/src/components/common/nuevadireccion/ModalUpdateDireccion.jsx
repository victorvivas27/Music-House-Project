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
import { updateAddress } from '../../../api/addresses'
import { CustomButton } from '../../Form/formUsuario/CustomComponents'
import useAlert from '../../../hook/useAlert'
import { getErrorMessage } from '../../../api/getErrorMessage'

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
  const { showSuccess} = useAlert()
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
        showSuccess(
           'Dirección modificada',
         'La dirección ha sido modificada con éxito.'
        )
      }, 1500)
    } catch (error) {
      setError(`❌ ${getErrorMessage(error)}`)
      setLoading(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleCloseModalDireccionUpdate}
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
          Modificar Dirección
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
            <Button onClick={handleCloseModalDireccionUpdate} color="secondary">
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
                'Guardar'
              )}
            </CustomButton>
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
