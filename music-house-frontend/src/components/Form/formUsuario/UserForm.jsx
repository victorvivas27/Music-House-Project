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
  Box,
  Avatar,
  Select,
  MenuItem,
  TextField
} from '@mui/material'
import Link from '@mui/material/Link'
import { styled } from '@mui/material/styles'
import { CustomButton } from './CustomComponents'
import { RoleSelect } from './RoleSelect'
import PropTypes from 'prop-types'
import { UsersApi } from '../../../api/users'
import Swal from 'sweetalert2'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import usePasswordValidation from '../../../hook/usePasswordValidation'
import { inputStyles } from '../../styles/styleglobal'
import { countryCodes } from '../../utils/codepaises/CountryCodes'
import { useAuthContext } from '../../utils/context/AuthGlobal'
import useAlert from '../../../hook/useAlert'

const ContainerForm = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',

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
  backgroundColor: 'var(--color-error)',
  color: 'var(--texto-inverso)',
  padding: '10px 15px',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '12px',
  margin: '2px'
}

export const UserForm = ({
  onSwitch,
  initialFormData,
  onSubmit,
  loading,
  isSubmitting,
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
  const { isUserAdmin } = useAuthContext()
  const { showConfirm, showSuccess, showError } = useAlert()

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.size <= 5 * 1024 * 1024) {
      setPreview(URL.createObjectURL(file))
      setFormData((prev) => ({ ...prev, picture: file }))
    } else {
      alert('El archivo supera el límite de 5MB.')
    }
  }

  const idUser = user?.data?.idUser || null
  const userRoles = user?.data?.roles?.map((role) => role.rol) || []


  const isLoggedUser = idUser && idUser === Number(formData?.idUser)

  useEffect(() => {
    if (isUserAdmin) setAccept(true)
  }, [isUserAdmin])

  const title = isLoggedUser
    ? 'Mi perfil'
    : formData.idUser
      ? 'Editar cuenta usuario'
      : 'Crear una cuenta'
  const combinedLoading = loading || isSubmitting
  const buttonText = formData.idUser || isUserAdmin ? 'Guardar' : 'Registrar'
  const buttonTextLoading =
    formData.idUser || isUserAdmin ? 'Guardardando...' : 'Registrando...'


  const handleChange = (event) => {
    const { name, value } = event.target
    
  
  
    setFormData((prev) => ({
      ...prev,
      [name]:value
    }))

    setErrors((prev) => ({
      ...prev,
      general: ''
    }))

   
    setErrors((prev) => ({
      ...prev,
      [name]:
        name === 'name' && value.length < 3
          ? '⚠️Mínimo 3 caracteres'
          : name === 'lastName' && value.length < 3
            ? '⚠️Mínimo 3 caracteres'
            : ''
    }))

   
    if (name === 'email') {
      setErrors((prev) => ({
        ...prev,
        email:
          !value || value.trim() === ''
            ? ''
            : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
              ? '⚠️ El email no es válido'
              : ''
      }))
    }

    if (name === 'password') {
      validatePassword(value)
    }

    if (name === 'password' || name === 'repeatPassword') {
      validateRepeatPassword(
        name === 'password' ? value : formData.password,
        name === 'repeatPassword' ? value : formData.repeatPassword
      )
    }

    if (name === 'telegramChatId') {
      const numericValue = value.replace(/\D/g, '') 

      setFormData((prev) => ({
        ...prev,
        telegramChatId: numericValue
      }))
    }
  }


  const allErrors = { ...errors, ...passwordErrors }

  const handleCheckBoxChange = (e) => {
    setAccept(e.target.checked)
    if (e.target.checked) {
      setErrors({ ...errors, general: '' })
    }
  }

 
  const handleAddressChange = (index, event) => {
    const { name, value } = event.target
   

    const updatedAddresses = formData.addresses.map((address, i) =>
      i === index ? { ...address, [name]:value } : address
    )

    setFormData((prevState) => ({
      ...prevState,
      addresses: updatedAddresses
    }))

   
    setErrors((prev) => ({
      ...prev,
      [`${name}_${index}`]:
        name === 'number' && /\D/.test(value)
          ? '⚠️Solo números'
          : name === 'street' && value.length < 3
            ? '⚠️Mínimo 3 caracteres'
            : name === 'city' && value.length < 3
              ? '⚠️Mínimo 3 caracteres'
              : name === 'state' && value.length < 3
                ? '⚠️Mínimo 3 caracteres'
                : name === 'country' && value.length < 3
                  ? '⚠️Mínimo 3 caracteres'
                  : ''
    }))
  }
 

  const handlePhoneChange = (index, field, value) => {
    const updatedPhones = formData.phones.map((phone, i) => {
      if (i === index) {
        let newPhoneNumber = phone.phoneNumber
        const validValue = value.replace(/[^0-9+]/g, '') 

        if (field === 'countryCode') {
          newPhoneNumber = `${validValue}${phone.phoneNumber.replace(phone.countryCode, '')}`
        } else if (field === 'phoneNumber') {
          newPhoneNumber = `${phone.countryCode}${validValue.replace(phone.countryCode, '')}`
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

   
    const minLength = 7
    const maxLength = 15

    setErrors((prev) => ({
      ...prev,
      [`phone_${index}`]:
        value.length < minLength
          ? `⚠️Mínimo ${minLength} dígitos`
          : value.length > maxLength
            ? `⚠️Máximo ${maxLength} dígitos`
            : ''
    }))
  }

 
  const handleSubmit = async (event) => {
    event.preventDefault()

    let formIsValid = true
    let newErrors = { ...initialErrorState }
  
    if (!formData.picture || formData.name.trim() === '') {
      newErrors.picture = '❌El avatar es obligatorio'
      formIsValid = false
    }

   
    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = '❌El nombre es obligatorio'
      formIsValid = false
    }

    if (!formData.lastName || formData.lastName.trim() === '') {
      newErrors.lastName = '❌El apellido es obligatorio'
      formIsValid = false
    }

    if (!formData.email || formData.email.trim() === '') {
      newErrors.email = '❌El email es obligatorio'
      formIsValid = false
    }

  
    if (!isUserAdmin && (!formData.idUser || formData.idUser === '')) {
      if (!formData.password) {
        newErrors.password = '❌La contraseña es obligatoria'
        formIsValid = false
      }

      if (!formData.repeatPassword) {
        newErrors.repeatPassword = '❌Debes repetir la contraseña'
        formIsValid = false
      }

      if (formData.password !== formData.repeatPassword) {
        newErrors.repeatPassword = '❌Las contraseñas no coinciden'
        formIsValid = false
      }

      if (!formData.telegramChatId) {
        newErrors.telegramChatId = '❌ El código de Telegram es obligatorio'
        formIsValid = false
      } else if (formData.telegramChatId.length <= 4) {
        newErrors.telegramChatId =
          '❌ El código de Telegram debe tener 5 dígitos'
        formIsValid = false
      }
    }

   
    formData.addresses.forEach((address, index) => {
      if (!address.street)
        newErrors[`street_${index}`] = '❌La calle es obligatoria'
      if (!address.number)
        newErrors[`number_${index}`] = '❌El número es obligatorio'
      if (!address.city)
        newErrors[`city_${index}`] = '❌La ciudad es obligatoria'
      if (!address.state)
        newErrors[`state_${index}`] = '❌El estado es obligatorio'
      if (!address.country)
        newErrors[`country_${index}`] = '❌El país es obligatorio'
    })

    
    formData.phones.forEach((phone, index) => {
      if (!phone.phoneNumber)
        newErrors[`phone_${index}`] = '❌El teléfono es obligatorio'
    })

    
    if (!isUserAdmin && !formData.idUser && !accept) {
      newErrors.general = '❌Debes aceptar los términos y condiciones'
      formIsValid = false
    }

    if (!formIsValid) {
      setErrors(newErrors)
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
    
      if (error.response && error.response.data) {
        const backendErrors = error.response.data
        setErrors((prev) => ({
          ...prev,
          name: backendErrors.name || prev.name,
          lastName: backendErrors.lastName || prev.lastName,
          email: backendErrors.email || prev.email,
          password: backendErrors.password || prev.password,
          repeatPassword: backendErrors.repeatPassword || prev.repeatPassword,
          telegramChatId: backendErrors.telegramChatId || prev.telegramChatId
        }))
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Ocurrió un problema al enviar el formulario.',
          icon: 'error'
        })
      }
    }
  }

  const handleRemoveRole = async (roleToRemove) => {
    if (!isUserAdmin) return
    if (user.data.roles.length <= 1) return

    const role = user.data.roles.find((r) => r.rol === roleToRemove)
    if (!role) return

   
    const isConfirmed = await showConfirm({
      title: '¿Estás seguro?',
      text: `Estás a punto de eliminar el rol ${roleToRemove}. ¿Deseas continuar?`,
      confirmText: 'Sí, eliminar',
      cancelText: 'Cancelar'
    })

    if (!isConfirmed) return 

    try {
      await UsersApi.deleteUserRole(idUser, roleToRemove)

     
      const updatedRoles = user.data.roles.filter((r) => r.rol !== roleToRemove)
      setUser((prevUser) => ({
        ...prevUser,
        data: {
          ...prevUser.data,
          roles: updatedRoles
        }
      }))

     
      showSuccess(`El rol ${roleToRemove} ha sido eliminado exitosamente.`)
    } catch (error) {
      
      showError(
        `Hubo un problema al eliminar el rol ${roleToRemove}. Por favor, intenta nuevamente.`
      )
    }
  }

  useEffect(() => {
    if (formData.picture && typeof formData.picture === 'string') {
      setPreview(formData.picture)
    }
  }, [formData.picture])

  return (
    <form onSubmit={handleSubmit} style={{ margin: 'auto', width: '100%' }}>
      <ContainerForm>
        <Grid
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            width: '90%',
            boxShadow: 'var(--box-shadow)',
            borderRadius: '8px',
            padding: '20px'
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: { xs: 'white', md: 'var(--texto-primario)' },
              fontWeight: 'light'
            }}
          >
            {title}
          </Typography>

          <Grid
            sx={{
              width: '99%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Grid
              sx={{
                width: '99%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: { xs: 'center', md: 'flex-end' },
                flexDirection: { md: 'row', xs: 'column' },
                gap: '10px'
              }}
            >
              {/*Comienzo contenedor formulario lado izquierdo*/}
              <Grid
                sx={{
                  width: '90%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {/* Contenedor del avatar y la subida de imagen */}
                <FormControl
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '160px'
                  }}
                >
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
                      sx={{
                        textAlign: 'center',
                        color: 'var(--texto-primario)',
                        fontWeight: 'bold'
                      }}
                    >
                      Máximo 5MB - Formatos permitidos: JPG, PNG
                    </Typography>
                  </Box>

                  {/* Mensaje de error si existe */}
                  {errors.picture && (
                    <Typography
                      color="var(--color-error)"
                      variant="body1"
                      sx={{ minHeight: '30px' }}
                    >
                      {errors.picture}
                    </Typography>
                  )}
                </FormControl>
                {/*Fin input avatar*/}

                {/*Input Name*/}

                <FormControl
                  fullWidth
                  margin="normal"
                  sx={{
                    ...inputStyles
                    //minHeight: '60px'
                  }}
                >
                  <TextField
                    label="🏷️Nombre"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    type="text"
                    error={Boolean(allErrors.name)}
                    helperText={errors.name || ' '}
                  />
                </FormControl>
                {/*Fin input name*/}

                {/*Input last name*/}
                <FormControl
                  margin="normal"
                  sx={{
                    ...inputStyles
                    //minHeight: '60px'
                  }}
                >
                  <TextField
                    label="👤Apellido"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    type="text"
                    error={Boolean(allErrors.lastName)}
                    helperText={errors.lastName || ' '}
                  />
                </FormControl>
                {/*Fin input last name*/}

                {/*Contenedor  direccion */}
                {formData.addresses.map((address, index) => (
                  <Grid
                    key={index}
                    container
                    spacing={2}
                    sx={{ marginTop: '1px' }}
                  >
                    {/*Input calle */}
                    <Grid item xs={12} sm={6}>
                      <FormControl
                        key={index}
                        margin="normal"
                        sx={{
                          ...inputStyles
                          // minHeight: '60px'
                        }}
                      >
                        <TextField
                          label="🏠Calle"
                          name="street"
                          value={address.street}
                          onChange={(e) => handleAddressChange(index, e)}
                          error={Boolean(allErrors[`street_${index}`])}
                          helperText={errors[`street_${index}`] || ' '}
                          type="text"
                        />
                      </FormControl>
                    </Grid>
                    {/*Fin input calle */}

                    {/*Input numero */}
                    <Grid item xs={12} sm={6}>
                      <FormControl
                        key={index}
                        margin="normal"
                        sx={{
                          ...inputStyles
                          // minHeight: '60px'
                        }}
                      >
                        <TextField
                          label="🔢Número"
                          name="number"
                          value={address.number}
                          onChange={(e) => handleAddressChange(index, e)}
                          error={Boolean(allErrors[`number_${index}`])}
                          helperText={errors[`number_${index}`] || ' '}
                          type="text"
                        />
                      </FormControl>
                    </Grid>

                    {/*Fin input numero */}
                    {/*Input ciudad */}
                    <Grid item xs={12} sm={4}>
                      <FormControl
                        key={index}
                        margin="normal"
                        sx={{
                          ...inputStyles
                          //minHeight: '60px'
                        }}
                      >
                        <TextField
                          label="🌆Ciudad"
                          name="city"
                          value={address.city}
                          onChange={(e) => handleAddressChange(index, e)}
                          error={Boolean(allErrors[`city_${index}`])}
                          helperText={errors[`city_${index}`] || ' '}
                          type="text"
                        />
                      </FormControl>
                    </Grid>
                    {/*Fin input ciudad */}
                    {/*Input estado*/}
                    <Grid item xs={12} sm={4}>
                      <FormControl
                        key={index}
                        margin="normal"
                        sx={{
                          ...inputStyles,
                          minHeight: '60px'
                        }}
                      >
                        <TextField
                          label="🏛️Estado"
                          name="state"
                          value={address.state}
                          onChange={(e) => handleAddressChange(index, e)}
                          error={Boolean(allErrors[`state_${index}`])}
                          helperText={errors[`state_${index}`] || ' '}
                          type="text"
                        />
                      </FormControl>
                    </Grid>
                    {/*Fin input estado*/}

                    {/*Input país*/}
                    <Grid item xs={12} sm={4}>
                      <FormControl
                        key={index}
                        margin="normal"
                        sx={{
                          ...inputStyles
                          // minHeight: '60px'
                        }}
                      >
                        <TextField
                          label="🌍País"
                          name="country"
                          value={address.country}
                          onChange={(e) => handleAddressChange(index, e)}
                          error={Boolean(allErrors[`country_${index}`])}
                          helperText={errors[`country_${index}`] || ' '}
                          type="text"
                        />
                      </FormControl>
                    </Grid>
                    {/*Fin input país*/}
                  </Grid>
                ))}
                {/*Contenedor  direccion */}

                {/*Contenedor  telefono */}
                {formData.phones.map((phone, index) => (
                  <FormControl key={index} sx={{ ...inputStyles }}>
                    {/* 📌 Select para elegir el código de país */}
                    <FormControl
                      margin="normal"
                      sx={{
                        '& .MuiInputBase-input': {
                          color: phone.countryCode
                            ? 'var(--color-azul)'
                            : 'var(--texto-inverso)'
                        }
                      }}
                    >
                      <Select
                        displayEmpty
                        value={phone.countryCode}
                        onChange={(e) =>
                          handlePhoneChange(
                            index,
                            'countryCode',
                            e.target.value
                          )
                        }
                      >
                        {/* 📌 Opción Placeholder */}
                        <MenuItem value="" disabled>
                          <Typography variant="h6">🔢Código País</Typography>
                        </MenuItem>

                        {/* 📌 Lista de opciones */}
                        {countryCodes.map((country) => (
                          <MenuItem
                            key={country.code}
                            value={country.code}
                            sx={{
                              '&:hover': {
                                backgroundColor: 'var(--color-primario)',
                                color: 'var(--texto-inverso)'
                              }
                            }}
                          >
                            {country.country} ({country.code})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* 📌 Input para el número de teléfono */}
                    <TextField
                      placeholder="Teléfono"
                      value={phone.phoneNumber.replace(phone.countryCode, '')}
                      onChange={(e) =>
                        handlePhoneChange(index, 'phoneNumber', e.target.value)
                      }
                      error={Boolean(allErrors[`phone_${index}`])}
                      helperText={errors[`phone_${index}`] || ' '}
                      type="text"
                      sx={{ ...inputStyles }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            {phone.countryCode ? phone.countryCode : '📞'}
                          </InputAdornment>
                        )
                      }}
                    />
                  </FormControl>
                ))}
                {/*Fin contenedor  telefono */}
              </Grid>
              {/*Fin  contenedor formulario lado izquierdo*/}

              {/*Comienzo contenedor formulario lado derecho*/}
              <Grid
                sx={{
                  width: '99%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                {/*Input email*/}
                <FormControl
                  margin="normal"
                  sx={{
                    ...inputStyles
                    // minHeight: '60px'
                  }}
                >
                  <TextField
                    label="📧 Email"
                    name="email"
                    onChange={handleChange}
                    value={formData.email}
                    type="email"
                    error={Boolean(allErrors.email)}
                    helperText={errors.email || ' '}
                  />
                </FormControl>
                {/*Fin input email*/}

                {/* 📌 Verificamos si `formData.idUser` es válido antes de renderizar */}

                {/* ✅ Solo mostrar si hay usuario seleccionado */}
                {formData?.idUser && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-evenly'
                    }}
                  >
                    {/* ✅ Si soy admin, mostrar los botones de gestión de roles */}
                    {isUserAdmin && (
                      <>
                        {userRoles.length > 0 ? (
                          ['USER', 'ADMIN'].map(
                            (role) =>
                              userRoles.includes(role) && (
                                <Button
                                  key={role}
                                  style={buttonStyle}
                                  onClick={() => {
                                    if (userRoles.length === 1) {
                                      showError(
                                        'No puedes eliminar el único rol del usuario.'
                                      )
                                    } else {
                                      handleRemoveRole(role)
                                    }
                                  }}
                                >
                                  Eliminar rol {role}
                                </Button>
                              )
                          )
                        ) : (
                          <Typography color="error">
                            No hay roles asignados.
                          </Typography>
                        )}

                        {/* 📌 Select para asignar roles */}
                        <FormControl
                          margin="normal"
                          sx={{
                            ...inputStyles
                          }}
                        >
                          <RoleSelect
                            selectedRoleId={formData?.idRol}
                            onChange={handleChange}
                          />
                        </FormControl>
                      </>
                    )}
                  </Box>
                )}

                {!isUserAdmin &&
                  (!formData.idUser || formData.idUser === '') && (
                    <>
                      {/* Campo de contraseña */}
                      <FormControl
                        margin="normal"
                        sx={{
                          ...inputStyles
                        }}
                      >
                        <TextField
                          label="🔒 Contraseña"
                          name="password"
                          onChange={handleChange}
                          value={formData.password}
                          type={showPassword ? 'text' : 'password'}
                          error={Boolean(allErrors.password)}
                          helperText={allErrors.password || ' '}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                >
                                  {showPassword ? (
                                    <VisibilityOff
                                      sx={{
                                        color: 'var(--color-exito)',
                                        fontSize: 40
                                      }}
                                    />
                                  ) : (
                                    <Visibility
                                      sx={{
                                        color: 'var(--color-secundario)',
                                        fontSize: 40
                                      }}
                                    />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />
                      </FormControl>

                      {/* Campo de repetir contraseña */}
                      <FormControl margin="normal" sx={{ ...inputStyles }}>
                        <TextField
                          label="🔓 Repetir Contraseña"
                          name="repeatPassword"
                          onChange={handleChange}
                          value={formData.repeatPassword}
                          type={showPasswordRepeat ? 'text' : 'password'}
                          error={Boolean(allErrors.repeatPassword)} // ✅ Muestra error solo aquí
                          helperText={
                            allErrors.repeatPassword ||
                            success.repeatPassword ||
                            ' '
                          } // ✅ Muestra mensaje de éxito si no hay error
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() =>
                                    setShowPasswordRepeat(!showPasswordRepeat)
                                  }
                                  edge="end"
                                >
                                  {showPasswordRepeat ? (
                                    <VisibilityOff
                                      sx={{
                                        color: 'var(--color-exito)',
                                        fontSize: 40
                                      }}
                                    />
                                  ) : (
                                    <Visibility
                                      sx={{
                                        color: 'var(--color-secundario)',
                                        fontSize: 40
                                      }}
                                    />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />
                      </FormControl>

                      <FormControl
                        margin="normal"
                        sx={{
                          ...inputStyles
                          //minHeight: '60px'
                        }}
                      >
                        <TextField
                          label="🔢Código de Telegram"
                          name="telegramChatId"
                          onChange={handleChange}
                          value={formData.telegramChatId}
                          error={Boolean(errors.telegramChatId)}
                          helperText={errors.telegramChatId || ' '}
                          type="tel"
                          inputProps={{ maxLength: 15, pattern: '[0-9]*' }}
                        />
                      </FormControl>

                      <Typography sx={{ fontSize: '14px', marginTop: '5px' }}>
                        ¿No sabes tu código?{' '}
                        <Link
                          href="https://t.me/MyBotJva_bot"
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            fontWeight: 'bold',
                            color: 'var(--color-azul)'
                          }}
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
                  alignItems: 'center'
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
              sx={{
                minWidth: '150px',
                minHeight: '50px',
                gap: '10px'
              }}
            >
              {combinedLoading ? (
                <>
                  {buttonTextLoading}
                  <CircularProgress
                    size={30}
                    sx={{ color: 'var(--color-azul)' }}
                  />
                </>
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
  isSubmitting: PropTypes.bool,

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
