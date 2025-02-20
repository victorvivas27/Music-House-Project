import { useEffect, useState } from 'react'
import {
  FormControl,
  Typography,
  Grid,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Button
} from '@mui/material'
import Link from '@mui/material/Link'
import { styled } from '@mui/material/styles'
import { CustomButton, InputCustom } from './CustomComponents'
import { RoleSelect } from './RoleSelect'
//import { useAuthContext } from '../../utils/context/AuthGlobal'
import PropTypes from 'prop-types'
import { UsersApi } from '../../../api/users'
import Swal from 'sweetalert2'

const ContainerForm = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  width: '100vw',
  alignItems: 'center !important',
  justifyContent: 'center',
  padding: '0px',

  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-end !important',
    flexDirection: 'column'
  }
}))

const ContainerBottom = styled(Grid)(({ theme }) => ({
  width: '100%',
  height: '100px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',

  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    width: '100%',
    marginLeft: '0px'
  }
}))

const buttonStyle = {
  backgroundColor: '#FF5733', 
  color: 'white',
  padding: '8px 15px',
  borderRadius: '5px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '12px',
  margin:"2px"
}

export const UserForm = ({
  onSwitch,
  initialFormData,
  onSubmit,
  loading,
  user,
  setUser
}) => {
  const initialErrorState = {
    name: '',
    lastName: '',
    email: '',
    password: '',
    telegramChatId: '',
    repeatPassword: '',
    general: ''
  }
  const initialSuccessState = {
    repeatPassword: ''
  }

  const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
    color: 'black',
    '&.Mui-checked': {
      color: theme.palette.secondary.main
    },
    '& .MuiSvgIcon-root': {
      fontSize: 32
    }
  }))

  const [formData, setFormData] = useState({ ...initialFormData })
  const [accept, setAccept] = useState(!!formData.idUser)
  const [errors, setErrors] = useState(initialErrorState)
  const [success, setSuccess] = useState(initialSuccessState)

 const isUserAdmin = user?.data?.roles?.some((role) => role.rol === 'ADMIN') || false
const isUser = user?.data?.roles?.some((role) => role.rol === 'USER') || false
const idUser = user?.data?.idUser || null
  const isLoggedUser = idUser && idUser === Number(initialFormData?.idUser)

  const title = isLoggedUser
    ? 'Mi perfil'
    : formData.idUser
      ? 'Editar cuenta usuario'
      : 'Crear una cuenta'

  const buttonText = formData.idUser || isUserAdmin ? 'Guardar' : 'Registrar'

  useEffect(() => {
    if (isUserAdmin) setAccept(true)
  }, [isUserAdmin])

  const handleChange = (event) => {
    const { name, value } = event.target
    const [field, index] = name.split('-')
    if (index !== undefined) {
      const updatedArray = [...formData[field]]
      updatedArray[index] = {
        ...updatedArray[index],
        [event.target.dataset.field]: value
      }
      setFormData({ ...formData, [field]: updatedArray })
    } else {
      setFormData({ ...formData, [name]: value })
    }

    setFormData({ ...formData, [name]: value })
    setErrors({ ...errors, [name]: '', general: '' })

    if (name === 'repeatPassword' && formData.password === value) {
      setSuccess({ ...success, repeatPassword: 'Las password son identicas' })
    } else {
      setSuccess({ ...success, repeatPassword: '' })
    }
  }

  const handleCheckBoxChange = (e) => {
    setAccept(e.target.checked)
    if (e.target.checked) {
      setErrors({ ...errors, general: '' })
    }
  }

  const handleAddressChange = (index, e) => {
    const { name, value } = e.target
    const updateAddresses = formData.addresses.map((address, i) =>
      i === index ? { ...address, [name]: value } : address
    )
    setFormData((prevState) => ({
      ...prevState,
      addresses: updateAddresses
    }))
  }
  const handlePhoneChange = (index, e) => {
    const { name, value } = e.target
    const updatedPhones = formData.phones.map((phone, i) =>
      i === index ? { ...phone, [name]: value } : phone
    )
    setFormData((prevState) => ({
      ...prevState,
      phones: updatedPhones
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    let formIsValid = true
    let newErrors = { ...initialErrorState }

    if (!formData.name) {
      newErrors.name = 'El nombre es requerido'
      formIsValid = false
    }
    if (!formData.lastName) {
      newErrors.lastName = 'El apellido es requerido'
      formIsValid = false
    }
    if (!formData.email) {
      newErrors.email = 'El email es requerido'
      formIsValid = false
    }
    if (!formData.idUser) {
      if (!formData.password) {
        newErrors.password = 'La contraseña es requerida'
        formIsValid = false
      }
      if (!formData.repeatPassword) {
        newErrors.repeatPassword = 'Repetir la contraseña es requerido'
        formIsValid = false
      } else if (formData.password !== formData.repeatPassword) {
        newErrors.repeatPassword = 'Las contraseñas no coinciden'
        formIsValid = false
      }
      if (!formData.telegramChatId) {
        newErrors.telegramChatId = 'El codigo de telegram es requerido'
        formIsValid = false
      }
      if (!accept) {
        newErrors.general = 'Debe aceptar los términos y condiciones'
        formIsValid = false
      }
    }
    if (!formIsValid) {
      setErrors(newErrors)
    } else {
      if (typeof onSubmit === 'function') onSubmit(formData)
    }
  }

  const handleRemoveRole = (roleToRemove) => {
    if (!isUserAdmin) return
    if (user.data.roles.length <= 1) return
    const role = user.data.roles.find((r) => r.rol === roleToRemove)
    if (role) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: `Estás a punto de eliminar el rol ${roleToRemove}. ¿Deseas continuar?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          UsersApi.deleteUserRole(idUser, roleToRemove)
            .then(() => {
              const updatedRoles = user.data.roles.filter(
                (r) => r.rol !== roleToRemove
              )
              setUser((prevUser) => ({
                ...prevUser,
                data: {
                  ...prevUser.data,
                  roles: updatedRoles
                }
              }))
              Swal.fire({
                title: 'Rol eliminado!',
                text: `El rol ${roleToRemove} ha sido eliminado exitosamente.`,
                icon: 'success',
                showConfirmButton: false,
                timer: 2000
              })
            })
            .catch(() => {
              Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al eliminar el rol. Por favor, intenta nuevamente.',
                icon: 'error',
                showConfirmButton: false,
                timer: 2000
              })
            })
        }
      })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <ContainerForm>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            padding: 3,
            width: { md: '70%', xs: '90%' },
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '20px'
          }}
        >
          <Typography
            variant="h3"
            sx={{ color: { xs: 'white', md: 'black' }, fontWeight: 'light' }}
          >
            {title}
          </Typography>
          <Grid
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Grid
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: { xs: 'center', md: 'flex-start' },
                flexDirection: { md: 'row', xs: 'column' },
                gap: '10px'
              }}
            >
              <Grid
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <FormControl fullWidth margin="normal">
                  <InputCustom
                    placeholder="Nombre"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    type="text"
                    color="primary"
                    error={Boolean(errors.name)}
                    helperText={errors.name}
                  />
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputCustom
                    placeholder="Apellido"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    type="text"
                    color="primary"
                    error={Boolean(errors.lastName)}
                    helperText={errors.lastName}
                  />
                </FormControl>
                {formData.addresses.map((address, index) => (
                  <Grid
                    key={index}
                    container
                    spacing={2}
                    sx={{ marginTop: '1px' }}
                  >
                    <Grid item xs={12} sm={6}>
                      <InputCustom
                        placeholder="Calle"
                        name="street"
                        value={address.street}
                        onChange={(e) => handleAddressChange(index, e)}
                        required
                        type="text"
                        color="primary"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InputCustom
                        placeholder="Número"
                        name="number"
                        value={address.number}
                        onChange={(e) => handleAddressChange(index, e)}
                        required
                        type="number"
                        color="primary"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <InputCustom
                        placeholder="Ciudad"
                        name="city"
                        value={address.city}
                        onChange={(e) => handleAddressChange(index, e)}
                        required
                        type="text"
                        color="primary"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <InputCustom
                        placeholder="Provincia"
                        name="state"
                        value={address.state}
                        onChange={(e) => handleAddressChange(index, e)}
                        required
                        type="text"
                        color="primary"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <InputCustom
                        placeholder="País"
                        name="country"
                        value={address.country}
                        onChange={(e) => handleAddressChange(index, e)}
                        required
                        type="text"
                        color="primary"
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                ))}
                {formData.phones.map((phone, index) => (
                  <FormControl key={index} fullWidth margin="normal">
                    <InputCustom
                      placeholder="Teléfono"
                      name="phoneNumber"
                      value={phone.phoneNumber}
                      onChange={(e) => handlePhoneChange(index, e)}
                      required
                      type="text"
                      color="primary"
                    />
                  </FormControl>
                ))}
              </Grid>
              <Grid
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'center'
                }}
              >
                <FormControl fullWidth margin="normal">
                  <InputCustom
                    placeholder="Email"
                    name="email"
                    onChange={handleChange}
                    value={formData.email}
                    type="email"
                    color="primary"
                    error={Boolean(errors.email)}
                    helperText={errors.email}
                  />
                </FormControl>
                {formData.idUser && (
                  <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{ padding: 2, width: '100%', height: '100%' }}
                  >
                    {/* Botones de eliminación de roles con estilo */}
                    {isUser && (
                      <Button
                        onClick={() => handleRemoveRole('USER')}
                        style={buttonStyle}
                        onMouseLeave={(e) =>
                          (e.target.style.backgroundColor =
                            buttonStyle.backgroundColor)
                        }
                      >
                        Eliminar rol USER
                      </Button>
                    )}

                    {isUserAdmin && (
                      <Button
                        onClick={() => handleRemoveRole('ADMIN')}
                        style={buttonStyle}
                        onMouseLeave={(e) =>
                          (e.target.style.backgroundColor =
                            buttonStyle.backgroundColor)
                        }
                      >
                        Eliminar rol ADMIN
                      </Button>
                    )}
                    <p>
                      Recuerda que siempre debe existir un rol, el botón se
                      desactiva si queda un rol para eliminar.
                    </p>
                    <Typography variant="h6">Asignar Rol</Typography>
                    <FormControl fullWidth margin="normal">
                      <RoleSelect
                        selectedRoleId={formData?.idRol}
                        onChange={handleChange}
                        sx={{
                          backgroundColor: 'rgba(255, 255, 255, 0.4) !important'
                        }}
                      />
                    </FormControl>
                  </Grid>
                )}

                {!formData.idUser && (
                  <>
                    <FormControl fullWidth margin="normal">
                      <InputCustom
                        placeholder="Password"
                        name="password"
                        onChange={handleChange}
                        value={formData.password}
                        type="password"
                        color="primary"
                        error={Boolean(errors.password)}
                        helperText={
                          errors.password ||
                          (success.repeatPassword && (
                            <span style={{ color: 'green' }}>
                              {success.repeatPassword}
                            </span>
                          ))
                        }
                      />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                      <InputCustom
                        placeholder="Repeat password"
                        name="repeatPassword"
                        onChange={handleChange}
                        value={formData.repeatPassword}
                        type="password"
                        color="primary"
                        error={Boolean(errors.repeatPassword)}
                        helperText={
                          errors.repeatPassword ||
                          (success.repeatPassword && (
                            <span style={{ color: 'green' }}>
                              {success.repeatPassword}
                            </span>
                          ))
                        }
                      />
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                      <InputCustom
                        placeholder="Codigo de Telegram "
                        name="telegramChatId"
                        onChange={handleChange}
                        value={formData.telegramChatId}
                        error={Boolean(errors.telegramChatId)}
                        helperText={errors.telegramChatId}
                        type="number"
                        color="primary"
                      />
                    </FormControl>
                    <Typography sx={{ fontSize: '14px', marginTop: '5px' }}>
                      ¿No sabes tu código?{' '}
                      <Link
                        href="https://t.me/MyBotJva_bot"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ fontWeight: 'bold' }}
                      >
                        Haz clic aquí para obtenerlo en Telegram
                      </Link>
                    </Typography>
                  </>
                )}
              </Grid>
            </Grid>
            {!formData.idUser && !isUserAdmin && (
              <FormControlLabel
                control={
                  <CustomCheckbox
                    checked={accept}
                    onChange={handleCheckBoxChange}
                  />
                }
                label={
                  <Typography sx={{ fontWeight: 'bold' }}>
                    Acepto los términos y condiciones del servicio
                  </Typography>
                }
                sx={{ color: 'black', marginTop: '30px', marginRight: '0' }}
              />
            )}
            {errors.general && (
              <Typography color="error" sx={{ marginTop: '10px' }}>
                {errors.general}
              </Typography>
            )}
          </Grid>

          <ContainerBottom>
            <CustomButton
              variant="contained"
              color="primary"
              type="submit"
              sx={{ minWidth: '150px', minHeight: '50px' }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={40} sx={{ color: '#FFD700' }} />
              ) : (
                buttonText
              )}
            </CustomButton>

            {!formData.idUser && !isUserAdmin && (
              <Link
                href=""
                underline="always"
                sx={{ color: 'black', marginTop: { xs: '40px', md: '20px' } }}
                onClick={onSwitch}
              >
                <Typography sx={{ fontWeight: '600' }}>
                  Ya tengo una cuenta
                </Typography>
              </Link>
            )}
          </ContainerBottom>
        </Grid>
      </ContainerForm>
    </form>
  )
}

UserForm.propTypes = {
  onSwitch: PropTypes.func, // Función para cambiar entre el formulario de registro e inicio de sesión
  initialFormData: PropTypes.shape({
    idUser: PropTypes.string,
    name: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
    repeatPassword: PropTypes.string,
    telegramChatId: PropTypes.string,
    addresses: PropTypes.arrayOf(
      PropTypes.shape({
        street: PropTypes.string,
        number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        city: PropTypes.string,
        state: PropTypes.string,
        country: PropTypes.string
      })
    ),
    phones: PropTypes.arrayOf(
      PropTypes.shape({
        phoneNumber: PropTypes.string
      })
    ),
    idRol: PropTypes.number
  }),
  loading: PropTypes.bool,
  onSubmit: PropTypes.func,

  // Agregar la validación de `user`
  user: PropTypes.shape({
    data: PropTypes.shape({
      roles: PropTypes.arrayOf(
        PropTypes.shape({
          rol: PropTypes.string.isRequired
        })
      ).isRequired,
      idUser: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  setUser: PropTypes.func
}
