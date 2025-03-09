import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Modal,
  TextField,
  Typography
} from '@mui/material'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { UsersApi } from '../../../api/users'

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

const ModalUpdateUser = ({
  open,
  handleCloseModalUser,
  idUser,
  refreshUserData,
  userData
}) => {
  // Estado para los campos del formulario
  const [formData, setFormData] = useState({
    picture: '',
    name: '',
    lastName: '',

    email: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [preview, setPreview] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.size <= 5 * 1024 * 1024) {
      setPreview(URL.createObjectURL(file))
      setFormData((prev) => ({ ...prev, picture: file }))
    } else {
      alert('El archivo supera el límite de 5MB.')
    }
  }

  // 🚀 Cuando `userData` cambia, actualizar el formulario con los datos actuales del usuario
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        lastName: userData.lastName || '',
        picture: userData.picture || '',
        email: userData.email || ''
      })
    }
  }, [userData, open]) // 🔹 Se ejecuta cuando `userData` cambia o cuando se abre el modal

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
      // Crear FormData
      const formDataToSend = new FormData()

      // Agregar `idUser` dentro del objeto `user`
      const { picture, ...userWithoutEmail } = formData
      const userWithId = { ...userWithoutEmail, idUser } // 🔹 Agregar idUser dentro del objeto

      // Convertir a JSON y agregarlo a FormData
      formDataToSend.append('user', JSON.stringify(userWithId))

      // Si el usuario subió una nueva imagen, agregarla
      if (picture instanceof File) {
        formDataToSend.append('file', picture)
      }

      // Enviar datos a la API
      await UsersApi.updateUser(formDataToSend)

      // 🔄 Refrescar datos y cerrar modal
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
    >
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" component="h2">
          Modificar Datos
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl
            fullWidth
            sx={{
              display: 'flex',
              alignItems: 'center',
              minHeight: '60px',
              margin: 2
            }}
          >
            {/* Contenedor del avatar y la subida de imagen */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              {/* 📌 Avatar que dispara la subida de imagen */}
              <label htmlFor="avatar-upload">
                <Avatar
                  src={preview}
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: 'var(--color-secundario)',
                    fontSize: 40,
                    cursor: 'pointer',
                    color: 'var(--color-primario)',
                    margin: 2,
                    border: '2px solid var(--color-primario)',
                    '&:hover': { opacity: 0.8 }
                  }}
                >
                  {/* Letra inicial si no hay imagen */}
                  {!preview && 'A'}
                </Avatar>
              </label>

              {/* 📌 Input oculto que maneja la subida de imagen */}
              <input
                type="file"
                accept="image/*"
                id="avatar-upload"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />

              {/* 📌 Mensaje con información del tamaño y formatos permitidos */}
              <Typography
                variant="body2"
                color="var(--text-primario)"
                sx={{ mt: 1, textAlign: 'center' }}
              >
                Máximo 5MB - Formatos permitidos: JPG, PNG
              </Typography>
            </Box>

            {/* Mensaje de error si existe */}
            {/*  {error.picture && (
                              <Typography color="var(--color-error)" variant="body1">
                                {error.picture}
                              </Typography>
                            )} */}
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

          {/* 📌 Campo de email deshabilitado */}
          <TextField
            fullWidth
            label="Email (No modificable)"
            name="email"
            value={formData.email}
            margin="normal"
            multiline
            rows={1}
            disabled={true} // 🔹 Evita que se pueda editar
          />

          {/* 📌 Mensaje indicando que el email no se puede modificar */}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Para modificar tu correo electrónico, por favor contacta con
            soporte.
          </Typography>

          {error && <Typography color="error">{error}</Typography>}

          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={handleCloseModalUser} color="secondary">
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

ModalUpdateUser.propTypes = {
  open: PropTypes.bool.isRequired,
  handleCloseModalUser: PropTypes.func.isRequired,
  idUser: PropTypes.string.isRequired,
  refreshUserData: PropTypes.func.isRequired,
  userData: PropTypes.object
}

export default ModalUpdateUser
