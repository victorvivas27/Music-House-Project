import { getErrorMessage } from '@/api/getErrorMessage'
import { UsersApi } from '@/api/users'
import { ContainerBottom, CustomButton } from '@/components/styles/ResponsiveComponents'
import useAlert from '@/hook/useAlert'
import {
  Avatar,
  Box,
  CircularProgress,
  FormControl,
  Modal,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import LoadingText from '../loadingText/LoadingText'


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
  const { showSuccess } = useAlert()

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
        showSuccess(
          'Usuario modificado',
          'El usuario ha sido modificado con éxito.',
          () => {}
        )
      }, 4500)
    } catch (error) {
      setError(`❌ ${getErrorMessage(error)}`)
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

          <Typography variant="body2" color="text.secondary" sx={{ m: 2 }}>
            Para modificar tu correo, contacta con soporte.
          </Typography>

          {error && <Typography color="error">{error}</Typography>}

          <ContainerBottom>
            <CustomButton type="submit" disabled={loading}>
              {loading ? (
                <>
                  <LoadingText text="Guardando" />
                  <CircularProgress
                    size={25}
                    sx={{ color: 'var(--color-exito)' }}
                  />
                </>
              ) : (
                'Guardar'
              )}
            </CustomButton>

            <Typography
              onClick={handleCloseModalUser}
              sx={{
                cursor: 'pointer', 
                fontWeight: '600',
                color: 'var(--color-azul)',
                marginTop: { xs: '40px', md: '20px' },
                '&:hover': {
                  textDecoration: 'underline',
                  opacity: 0.8
                }
              }}
            >
              Cancelar
            </Typography>
          </ContainerBottom>
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
