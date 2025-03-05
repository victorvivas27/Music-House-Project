import {
  FormControl,
  Typography,
  Grid,
  InputAdornment,
  IconButton,
  OutlinedInput,
  FormHelperText
} from '@mui/material'
import Link from '@mui/material/Link'
import { styled } from '@mui/material/styles'
import { CustomButton, InputCustom } from './CustomComponents'
import { useFormik } from 'formik'
import { UsersApi } from '../../../api/users'
import swal from 'sweetalert'
import loginValidationSchema from './LoginValidation'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../utils/context/AuthGlobal'
import PropTypes from 'prop-types'
import { jwtDecode } from 'jwt-decode'

import { useState } from 'react'
import { Visibility, VisibilityOff } from '@mui/icons-material'

const ContainerForm = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100vw',
  height: '80vh',
  marginTop: '30px',
  justifyContent: 'center',
  alignItems: 'flex-end',
  padding: '0px',

  [theme.breakpoints.down('md')]: {
    flexDirection: 'row'
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

const Login = ({ onSwitch }) => {
  const navigate = useNavigate()
  const { setAuthGlobal, setIsUserAdmin, setIsUser } = useAuthContext()
  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await UsersApi.loginUser(values)

        if (response && response.token) {
          localStorage.setItem('token', response.token)

          // Decodificar el token para obtener los roles
          const decoded = jwtDecode(response.token)
          const roles = decoded.roles || []

          // Actualizar el contexto de autenticación
          setAuthGlobal(true)
          setIsUserAdmin(roles.includes('ADMIN'))
          setIsUser(roles.includes('USER'))

          swal({
            title: '¡Inicio de sesión exitoso!',
            text: 'Has iniciado sesión correctamente',
            icon: 'success',
            buttons: false,
            timer: 1000
          })

          setTimeout(() => {
            navigate('/', { replace: true })
            window.location.reload()
          }, 1000)
        } else {
          throw new Error(response.message || 'Credenciales incorrectas')
        }
      } catch (error) {
        console.error('Error durante el inicio de sesión:', error)
        swal(
          'Error al iniciar sesión',
          error.message || 'Ocurrió un error',
          'error'
        )
      } finally {
        setSubmitting(false)
      }
    }
  })

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <ContainerForm>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              padding: 3,
              width: { md: '40%', xs: '90%' },
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '20px',
              marginRight: { md: '5rem' }
            }}
          >
            <Typography
              variant="h3"
              sx={{ color: { xs: 'white', md: 'black' }, fontWeight: 'light' }}
            >
              Iniciar Sesión
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
              <FormControl fullWidth margin="normal">
                <InputCustom
                  placeholder="Email"
                  name="email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  type="email"
                  color="primary"
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </FormControl>

              <FormControl fullWidth margin="normal" error={formik.touched.password && Boolean(formik.errors.password)}>
  <OutlinedInput
    placeholder="Password"
    name="password"
    onChange={formik.handleChange}
    value={formik.values.password}
    type={showPassword ? 'text' : 'password'}
    endAdornment={
      <InputAdornment position="end">
        <IconButton
          aria-label={showPassword ? 'hide the password' : 'display the password'}
          onClick={handleClickShowPassword}
          edge="end"
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    }
  />
  {formik.touched.password && formik.errors.password && (
    <FormHelperText>{formik.errors.password}</FormHelperText>
  )}
</FormControl>
            </Grid>
            <ContainerBottom>
              <CustomButton
                variant="contained"
                color="primary"
                type="submit"
                disabled={formik.isSubmitting}
              >
                Iniciar Sesión
              </CustomButton>
              <Link
                href=""
                underline="always"
                sx={{
                  color: { xs: 'white', md: 'black' },
                  marginTop: { xs: '40px', md: '20px' }
                }}
                onClick={onSwitch}
              >
                <Typography sx={{ fontWeight: '600' }}>
                  No tienes una cuenta? Regístrate
                </Typography>
              </Link>
            </ContainerBottom>
          </Grid>
        </ContainerForm>
      </form>
      
    </>
  )
}
// Definición de los tipos de props esperados
Login.propTypes = {
  onSwitch: PropTypes.func.isRequired
}
export default Login
