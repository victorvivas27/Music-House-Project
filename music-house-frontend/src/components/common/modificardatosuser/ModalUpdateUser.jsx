import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Modal,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { UsersApi } from '../../../api/users'
import { CustomButton } from '../../Form/formUsuario/CustomComponents'

const ModalUpdateUser = ({
  open,
  handleCloseModalUser,
  idUser,
  refreshUserData,
  userData
}) => {
  const [formData, setFormData] = useState({
    picture: '',
    name: '',
    lastName: '',
    email: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [preview, setPreview] = useState(null)
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

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.size <= 5 * 1024 * 1024) {
      setPreview(URL.createObjectURL(file))
      setFormData((prev) => ({ ...prev, picture: file }))
    } else {
      alert('El archivo supera el límite de 5MB.')
    }
  }

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        lastName: userData.lastName || '',
        picture: userData.picture || '',
        email: userData.email || ''
      })
    }
  }, [userData, open])

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
      const formDataToSend = new FormData()
      const { picture, ...userWithoutEmail } = formData
      const userWithId = { ...userWithoutEmail, idUser }

      formDataToSend.append('user', JSON.stringify(userWithId))

      if (picture instanceof File) {
        formDataToSend.append('file', picture)
      }

      await UsersApi.updateUser(formDataToSend)

      refreshUserData()
      setTimeout(() => {
        setLoading(false)
        handleCloseModalUser()
        Swal.fire({
          title: 'Usuario modificado',
          text: 'El usuario ha sido modificado con éxito.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          allowOutsideClick: false,
          timerProgressBar: true
        })
      }, 1500)
    } catch (error) {
      setError('Hubo un error al modificar el usuario.')
      setLoading(false)
    }
  }

  useEffect(() => {
    if (formData.picture && typeof formData.picture === 'string') {
      setPreview(formData.picture)
    }
  }, [formData.picture])

  return (
    <Modal
      open={open}
      onClose={handleCloseModalUser}
      aria-labelledby="modal-title"
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Box sx={style}>
        <Typography
          id="modal-title"
          variant="h6"
          component="h2"
          textAlign="center"
        >
          Modificar Datos
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl
            fullWidth
            sx={{ display: 'flex', alignItems: 'center', margin: 2 }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <label htmlFor="avatar-upload">
                <Avatar
                  src={preview}
                  sx={{
                    width: isMobile ? 80 : 100,
                    height: isMobile ? 80 : 100,
                    bgcolor: 'var(--color-secundario)',
                    fontSize: 40,
                    cursor: 'pointer',
                    color: 'var(--color-primario)',
                    margin: 2,
                    border: '2px solid var(--color-primario)',
                    '&:hover': { opacity: 0.8 }
                  }}
                >
                  {!preview && 'A'}
                </Avatar>
              </label>

              <input
                type="file"
                accept="image/*"
                id="avatar-upload"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />

              <Typography
                variant="body2"
                color="var(--text-primario)"
                sx={{ mt: 1, textAlign: 'center' }}
              >
                Máximo 5MB - Formatos: JPG, PNG
              </Typography>
            </Box>
          </FormControl>

          <TextField
            fullWidth
            label="Nombre"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
            multiline
            rows={1}
          />

          <TextField
            fullWidth
            label="Apellido"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            margin="normal"
            required
            multiline
            rows={1}
          />

          <TextField
            fullWidth
            label="Email (No modificable)"
            name="email"
            value={formData.email}
            margin="normal"
            multiline
            rows={1}
            disabled
          />

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Para modificar tu correo, contacta con soporte.
          </Typography>

          {error && <Typography color="error">{error}</Typography>}

          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={handleCloseModalUser} color="secondary">
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

ModalUpdateUser.propTypes = {
  open: PropTypes.bool.isRequired,
  handleCloseModalUser: PropTypes.func.isRequired,
  idUser: PropTypes.string.isRequired,
  refreshUserData: PropTypes.func.isRequired,
  userData: PropTypes.object
}

export default ModalUpdateUser
