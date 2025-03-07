import { useEffect, useState } from 'react'
import {
  FormControl,
  Typography,
  Grid,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Button,
  InputAdornment,
  IconButton,
  OutlinedInput,
  FormHelperText,
  Box,
  Avatar,
  Select,
  MenuItem
} from '@mui/material'
import Link from '@mui/material/Link'
import { styled } from '@mui/material/styles'
import { CustomButton, InputCustom } from './CustomComponents'
import { RoleSelect } from './RoleSelect'
import PropTypes from 'prop-types'
import { UsersApi } from '../../../api/users'
import Swal from 'sweetalert2'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import usePasswordValidation from '../../../hook/usePasswordValidation'
import { inputStyles } from '../../styles/StyleGeneral'
import { countryCodes } from '../../utils/codepaises/CountryCodes'

const ContainerForm = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  width: '100vw',

  justifyContent: 'center',

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
    width: '100%'
  }
}))

const buttonStyle = {
  backgroundColor: '#FF5733',
  color: 'var(--texto-inverso)',
  padding: '8px 15px',
  borderRadius: '5px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '12px',
  margin: '2px'
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

  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false)
  const { passwordErrors, success, validatePassword, validateRepeatPassword } =
    usePasswordValidation()

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

  const isUserAdmin =
    user?.data?.roles?.some((role) => role.rol === 'ADMIN') || false
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

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))

    // Limpiar errores generales
    setErrors((prev) => ({
      ...prev,
      general: ''
    }))

    // 📌 Validación de email en tiempo real
    if (name === 'email') {
      setErrors((prev) => ({
        ...prev,
        email:
          !value || value.trim() === ''
            ? '❌ El email es requerido'
            : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
              ? '⚠️ El email no es válido'
              : ''
      }))
    }

    if (name === 'name') {
      setErrors((prev) => ({
        ...prev,
        name:
          !value || value.trim() === ''
            ? '❌ El nombre es requerido'
            : value.length < 3
              ? '⚠️Minimo 3 caracteres'
              : ''
      }))
    }

    if (name === 'lastName') {
      setErrors((prev) => ({
        ...prev,
        lastName:
          !value || value.trim() === ''
            ? '❌ El apellido es requerido'
            : value.length < 3
              ? '⚠️Minimo 3 caracteres'
              : ''
      }))
    }

    // 📌 Validación de contraseña en tiempo real
    if (name === 'password') {
      validatePassword(value)
    }

    // 📌 Validación de coincidencia de contraseñas
    if (name === 'password' || name === 'repeatPassword') {
      validateRepeatPassword(
        name === 'password' ? value : formData.password,
        name === 'repeatPassword' ? value : formData.repeatPassword
      )
    }

    if (name === 'telegramChatId') {
      const stringValue = String(value).trim()
      setErrors((prev) => ({
        ...prev,
        telegramChatId: !stringValue
          ? '❌ El código de Telegram es requerido'
          : /\D/.test(stringValue)
            ? '⚠️ El código de Telegram debe contener solo números'
            : stringValue.length < 5 || stringValue.length > 15
              ? '⚠️ El código de Telegram debe tener entre 5 y 15 dígitos'
              : ''
      }))
    }
  }
  // Fusionamos errores
  const allErrors = { ...errors, ...passwordErrors }

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
    // 📌 Validación de la calle (street)
    if (name === 'street') {
      setErrors((prev) => ({
        ...prev,
        [`street_${index}`]:
          !value || value.trim() === ''
            ? '❌ La calle es requerida'
            : value.length < 3
              ? '⚠️ Minimo 3 caracteres'
              : ''
      }))
    }

    if (name === 'number') {
      const stringValue = String(value).trim()
      setErrors((prev) => ({
        ...prev,
        [`number_${index}`]: !stringValue
          ? '❌ El numero es requerido'
          : /\D/.test(stringValue)
            ? '⚠️Solo números'
            : stringValue.length < 2 || stringValue.length > 15
              ? '⚠️Entre 1 y 15 dígitos'
              : ''
      }))
    }

    if (name === 'city') {
      setErrors((prev) => ({
        ...prev,
        [`city_${index}`]:
          !value || value.trim() === ''
            ? '❌La ciudad es requerida'
            : value.length < 3
              ? '⚠️ Minimo 3 caracteres'
              : ''
      }))
    }

    if (name === 'state') {
      setErrors((prev) => ({
        ...prev,
        [`state_${index}`]:
          !value || value.trim() === ''
            ? '❌El estado es requerido'
            : value.length < 3
              ? '⚠️ Minimo 3 caracteres'
              : ''
      }))
    }

    if (name === 'country') {
      setErrors((prev) => ({
        ...prev,
        [`country_${index}`]:
          !value || value.trim() === ''
            ? '❌El pais es requerido'
            : value.length < 3
              ? '⚠️ Minimo 3 caracteres'
              : ''
      }))
    }
  }
  const handlePhoneChange = (index, field, value) => {
    const updatedPhones = formData.phones.map((phone, i) => {
      if (i === index) {
        let newPhoneNumber = phone.phoneNumber
        // 📌 1️⃣ Filtrar solo números y el signo "+"
        const validValue = value.replace(/[^0-9+]/g, '')

        if (field === 'countryCode') {
          // 📌 Si cambia el código de país, reemplaza solo el prefijo
          newPhoneNumber = `${validValue}${phone.phoneNumber.replace(phone.countryCode, '')}`
        } else if (field === 'phoneNumber') {
          // 📌 Si cambia el número, mantiene el código de país
          newPhoneNumber = `${phone.countryCode}${validValue.replace(phone.countryCode, '')}`
        }

        // 📌 2️⃣ Validar longitud (excluyendo código de país)
        const minLength = 12
        const maxLength = 15

        if (newPhoneNumber.length < minLength) {
          setErrors((prev) => ({
            ...prev,
            [`phone_${index}`]: `⚠️ El número debe tener al menos ${minLength} dígitos.`
          }))
        } else if (newPhoneNumber.length > maxLength) {
          setErrors((prev) => ({
            ...prev,
            [`phone_${index}`]: `⚠️ El número no debe superar ${maxLength} dígitos.`
          }))
        } else {
          setErrors((prev) => ({
            ...prev,
            [`phone_${index}`]: ''
          }))
        }

        return {
          ...phone,
          [field]: validValue,
          phoneNumber: newPhoneNumber
        }
      }
      return phone
    })

    setFormData((prevState) => ({
      ...prevState,
      phones: updatedPhones
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    let formIsValid = true
    let newErrors = { ...initialErrorState }

    if (!formData.idUser) {
      if (!accept) {
        newErrors.general = '❌ Debes aceptar los términos y condiciones'
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
          sx={{
            margin: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            width: '80%',
            boxShadow: 24
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: { xs: 'white', md: 'var(--texto-primario)' },
              fontWeight: 'light'
            }}
          >
            {title}
          </Typography>
          <Grid
            sx={{
              width: '90%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Grid
              sx={{
                width: '90%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: { xs: 'center', md: 'flex-end' },
                flexDirection: { md: 'row', xs: 'column' },
                gap: '10px',

                margin: 2
              }}
            >
              <Grid
                sx={{
                  width: '90%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',

                  margin: 2
                }}
              >
                <FormControl
                  fullWidth
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    minHeight: '60px',
                    border: '1px solid blue',
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
                          border: '2px solid var(--color-primario)', // Agrega un borde opcional
                          '&:hover': { opacity: 0.8 } // Efecto al pasar el cursor
                        }}
                      >
                        {!preview && 'A'} {/* Letra inicial si no hay imagen */}
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
                  {errors.picture && (
                    <Typography color="var(--color-error)" variant="body1">
                      {errors.picture}
                    </Typography>
                  )}
                </FormControl>
                <FormControl
                  fullWidth
                  margin="normal"
                  sx={{
                    minHeight: '60px',
                    border: '1px solid blue'
                  }}
                >
                  <InputCustom
                    placeholder="Nombre"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    type="text"
                    sx={inputStyles}
                    error={Boolean(allErrors.name)}
                    helperText={errors.name}
                  />
                </FormControl>

                <FormControl
                  fullWidth
                  margin="normal"
                  sx={{
                    minHeight: '60px',
                    border: '1px solid blue'
                  }}
                >
                  <InputCustom
                    placeholder="Apellido"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    type="text"
                    sx={inputStyles}
                    error={Boolean(allErrors.lastName)}
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
                      <FormControl
                        key={index}
                        fullWidth
                        margin="normal"
                        sx={{
                          minHeight: '60px',
                          border: '1px solid blue'
                        }}
                      >
                        <InputCustom
                          placeholder="Calle"
                          name="street"
                          value={address.street}
                          onChange={(e) => handleAddressChange(index, e)}
                          error={Boolean(allErrors[`street_${index}`])}
                          helperText={errors[`street_${index}`] || ' '}
                          type="text"
                          sx={inputStyles}
                          fullWidth
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl
                        key={index}
                        fullWidth
                        margin="normal"
                        sx={{
                          minHeight: '60px',
                          border: '1px solid blue'
                        }}
                      >
                        <InputCustom
                          placeholder="Número"
                          name="number"
                          value={address.number}
                          onChange={(e) => handleAddressChange(index, e)}
                          error={Boolean(allErrors[`number_${index}`])}
                          helperText={errors[`number_${index}`] || ' '}
                          type="text"
                          sx={inputStyles}
                          fullWidth
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <FormControl
                        key={index}
                        fullWidth
                        margin="normal"
                        sx={{
                          minHeight: '60px',
                          border: '1px solid blue'
                        }}
                      >
                        <InputCustom
                          placeholder="Ciudad"
                          name="city"
                          value={address.city}
                          onChange={(e) => handleAddressChange(index, e)}
                          error={Boolean(allErrors[`city_${index}`])}
                          helperText={errors[`city_${index}`] || ' '}
                          type="text"
                          sx={inputStyles}
                          fullWidth
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <FormControl
                        key={index}
                        fullWidth
                        margin="normal"
                        sx={{
                          minHeight: '60px',
                          border: '1px solid blue'
                        }}
                      >
                        <InputCustom
                          placeholder="Estado"
                          name="state"
                          value={address.state}
                          onChange={(e) => handleAddressChange(index, e)}
                          error={Boolean(allErrors[`state_${index}`])}
                          helperText={errors[`state_${index}`] || ' '}
                          type="text"
                          sx={inputStyles}
                          fullWidth
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <FormControl
                        key={index}
                        fullWidth
                        margin="normal"
                        sx={{
                          minHeight: '60px',
                          border: '1px solid blue'
                        }}
                      >
                        <InputCustom
                          placeholder="País"
                          name="country"
                          value={address.country}
                          onChange={(e) => handleAddressChange(index, e)}
                          error={Boolean(allErrors[`country_${index}`])}
                          helperText={errors[`country_${index}`] || ' '}
                          type="text"
                          sx={inputStyles}
                          fullWidth
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                ))}

                {formData.phones.map((phone, index) => (
                  <FormControl
                    key={index}
                    fullWidth
                    margin="normal"
                    sx={{
                      minHeight: '60px',
                      border: '1px solid blue'
                    }}
                  >
                    {/* 📌 Select para elegir el código de país */}
                    <FormControl fullWidth margin="normal">
                      {/* 📌 Select para elegir el código de país */}
                      <Select
                        value={phone.countryCode}
                        onChange={(e) =>
                          handlePhoneChange(
                            index,
                            'countryCode',
                            e.target.value
                          )
                        }
                      >
                        {countryCodes.map((country) => (
                          <MenuItem key={country.code} value={country.code}>
                            {country.country} ({country.code})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* 📌 Input para el número de teléfono */}
                    <InputCustom
                      placeholder="Teléfono"
                      value={phone.phoneNumber}
                      onChange={(e) =>
                        handlePhoneChange(index, 'phoneNumber', e.target.value)
                      }
                      error={Boolean(allErrors[`phone_${index}`])}
                      helperText={errors[`phone_${index}`] || ' '}
                      type="text"
                      sx={inputStyles}
                    />
                  </FormControl>
                ))}
              </Grid>

              <Grid
                sx={{
                  width: '50%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <FormControl
                  fullWidth
                  margin="normal"
                  sx={{
                    minHeight: '60px',
                    border: '1px solid blue'
                  }}
                >
                  <InputCustom
                    placeholder="Email"
                    name="email"
                    onChange={handleChange}
                    value={formData.email}
                    type="email"
                    sx={inputStyles}
                    error={Boolean(allErrors.email)}
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
                    <FormControl
                      fullWidth
                      margin="normal"
                      sx={{ minHeight: '60px', border: '1px solid blue' }}
                    >
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
                    {/* Campo de contraseña */}
                    <FormControl
                      fullWidth
                      margin="normal"
                      error={Boolean(allErrors.password || '')}
                      sx={{ minHeight: '60px', border: '1px solid blue' }}
                    >
                      <OutlinedInput
                        placeholder="Contraseña"
                        name="password"
                        onChange={handleChange}
                        value={formData.password}
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                      {allErrors.password && (
                        <FormHelperText>{allErrors.password}</FormHelperText>
                      )}
                    </FormControl>

                    {/* Campo de repetir contraseña */}
                    <FormControl
                      fullWidth
                      margin="normal"
                      error={Boolean(allErrors.repeatPassword)}
                      sx={{
                        minHeight: '60px',
                        border: '1px solid blue'
                      }}
                    >
                      <OutlinedInput
                        placeholder="Repetir Contraseña"
                        name="repeatPassword"
                        onChange={handleChange}
                        value={formData.repeatPassword}
                        type={showPasswordRepeat ? 'text' : 'password'}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowPasswordRepeat(!showPasswordRepeat)
                              }
                              edge="end"
                            >
                              {showPasswordRepeat ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                      {allErrors.repeatPassword ? (
                        <FormHelperText>
                          {allErrors.repeatPassword}
                        </FormHelperText>
                      ) : success.repeatPassword ? (
                        <FormHelperText sx={{ color: 'var(--color-exit)' }}>
                          {success.repeatPassword}
                        </FormHelperText>
                      ) : null}
                    </FormControl>

                    <FormControl
                      fullWidth
                      margin="normal"
                      sx={{
                        minHeight: '60px',
                        border: '1px solid blue'
                      }}
                    >
                      <InputCustom
                        placeholder="Codigo de Telegram "
                        name="telegramChatId"
                        onChange={handleChange}
                        value={formData.telegramChatId}
                        error={Boolean(allErrors.telegramChatId)}
                        helperText={errors.telegramChatId}
                        type="text" // Cambiar a "text" para permitir validación
                        sx={inputStyles}
                      />
                    </FormControl>

                    <Typography sx={{ fontSize: '14px', marginTop: '5px' }}>
                      ¿No sabes tu código?{' '}
                      <Link
                        href="https://t.me/MyBotJva_bot"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ fontWeight: 'bold', color: 'var(--color-azul)' }}
                      >
                        Haz clic aquí para obtenerlo en Telegram
                      </Link>
                    </Typography>
                  </>
                )}
              </Grid>
            </Grid>
            {!formData.idUser && !isUserAdmin && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  border: '1px solid blue'
                }}
              >
                {/* 📌 Checkbox de términos y condiciones */}
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
                  sx={{
                    color: 'var(--texto-primario)',
                    marginTop: '30px',
                    marginRight: '0'
                  }}
                />

                {/* 📌 Mensaje de error con espacio reservado */}
                <Typography
                  sx={{
                    marginTop: '5px',
                    color: 'var(--color-error)',
                    minHeight: '40px',
                    textAlign: 'center'
                  }}
                >
                  {errors.general || ' '}{' '}
                </Typography>
              </Box>
            )}
          </Grid>

          <ContainerBottom>
            <CustomButton
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{
                minWidth: '150px',
                minHeight: '50px',
                color: 'var(--color-secundario)',
                background: 'var(--color-primario)'
              }}
            >
              {loading ? (
                <CircularProgress
                  size={40}
                  sx={{ color: 'var(--color-azul)' }}
                />
              ) : (
                buttonText
              )}
            </CustomButton>

            {!formData.idUser && !isUserAdmin && (
              <Link
                href=""
                underline="always"
                sx={{
                  color: 'var(--texto-primario)',
                  marginTop: { xs: '40px', md: '20px' }
                }}
                onClick={onSwitch}
              >
                <Typography
                  sx={{ fontWeight: '600', color: 'var(--color-azul)' }}
                >
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
  onSwitch: PropTypes.func, 
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
    })
  }),
  setUser: PropTypes.func
}
