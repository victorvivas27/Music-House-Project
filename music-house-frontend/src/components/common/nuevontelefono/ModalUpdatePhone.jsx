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
 
import { updatePhone } from '../../../api/phones'
  
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
  
  const ModalUpdatePhone = ({
    open,
    handleCloseModalPhoneUpdate,
    refreshUserData,
    selectedPhone // 📌 Recibir el teléfono seleccionado
  }) => {
    const [formData, setFormData] = useState({
      phoneNumber: ''
    });
  
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    // 🚀 Cuando el teléfono seleccionado cambia, actualizar el formulario
    useEffect(() => {
      if (selectedPhone) {
        setFormData({
          phoneNumber: selectedPhone.phoneNumber || ''
        });
      }
    }, [selectedPhone, open]);
  
    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
  
      try {
        await updatePhone({ idPhone: selectedPhone.idPhone, ...formData });
  
        refreshUserData();
        setTimeout(() => {
          setLoading(false);
          handleCloseModalPhoneUpdate();
          Swal.fire({
            title: 'Teléfono modificado',
            text: 'El teléfono ha sido modificado con éxito.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            allowOutsideClick: false,
            timerProgressBar: true
          });
        }, 1500);
      } catch (error) {
        setError('Hubo un error al modificar el teléfono.');
        setLoading(false);
      }
    };
  
    return (
      <Modal open={open} onClose={handleCloseModalPhoneUpdate} aria-labelledby="modal-title">
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
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
              rows={1}
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
                  minWidth: '100px',
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
    );
  };
  
  ModalUpdatePhone.propTypes = {
    open: PropTypes.bool.isRequired,
    handleCloseModalPhoneUpdate: PropTypes.func.isRequired,
    refreshUserData: PropTypes.func.isRequired,
    selectedPhone: PropTypes.object
  };
  
  export default ModalUpdatePhone;