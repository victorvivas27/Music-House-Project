import {
  FormControl,
  Typography,
  Grid,
  InputAdornment,
  IconButton,
  OutlinedInput,
  FormHelperText,
  CircularProgress
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

import { useState } from 'react'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { inputStyles } from '../../styles/styleglobal'

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
  const { setAuthData } = useAuthContext()
  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = () => setShowPassword((show) => !show)
  const [loading, setLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setLoading(true)

      setTimeout(async () => {
        try {
          const response = await UsersApi.loginUser(values)

          if (response && response.token) {
            setAuthData(response)
            swal({
              title: '¡Inicio de sesión exitoso!',
              text: 'Redirigiendo en 2 segundos...',
              icon: 'success',
              buttons: false,
              timer: 2000
            })

            setTimeout(() => {
              navigate('/', { replace: true })
            }, 2000)
          } else {
            throw new Error(response.message || 'Credenciales incorrectas')
          }
        } catch (error) {
          swal(
            'Error al iniciar sesión',
            error.message || 'Ocurrió un error',
            'error'
          )
        } finally {
          setSubmitting(false)
          setLoading(false)
        }
      }, 2000)
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
              <FormControl
                fullWidth
                margin="normal"
                sx={{
                  minHeight: '60px'
                }}
              >
                <InputCustom
                  placeholder="Email"
                  name="email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  type="email"
                  color="primary"
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  sx={inputStyles}
                />
              </FormControl>

              <FormControl
                fullWidth
                margin="normal"
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                sx={{
                  minHeight: '60px'
                }}
              >
                <OutlinedInput
                  sx={{
                    borderRadius: '5px', 
                    padding: '5px' 
                  }}
                  placeholder="Password"
                  name="password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showPassword
                            ? 'hide the password'
                            : 'display the password'
                        }
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOff
                            sx={{ color: 'var(--color-exito)', fontSize: 40 }}
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
                sx={{
                  minWidth: '150px',
                  minHeight: '50px',
                  color: 'var(--color-secundario)',
                  background: 'var(--color-primario)',
                  gap: '10px'
                }}
              >
                {loading ? (
                  <>
                    Cargando...
                    <CircularProgress
                      size={30}
                      sx={{ color: 'var(--color-azul)' }}
                    />
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
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
