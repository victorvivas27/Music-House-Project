import {
  FormControl,
  Typography,
  Grid,
  InputAdornment,
  IconButton,
  
 
  CircularProgress,
  TextField
} from '@mui/material'
import Link from '@mui/material/Link'
import { styled } from '@mui/material/styles'
import { CustomButton } from './CustomComponents'
import { useFormik } from 'formik'
import { UsersApi } from '../../../api/users'

import loginValidationSchema from './LoginValidation'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../utils/context/AuthGlobal'
import PropTypes from 'prop-types'

import { useState } from 'react'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { inputStyles } from '../../styles/styleglobal'
import useAlert from '../../../hook/useAlert'

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
   const { showSuccess, showError } = useAlert()

   const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setLoading(true);
    
      try {
        const response = await UsersApi.loginUser(values);
    
        if (response && response.data && response.data.token) {
          
          setAuthData(response.data);
          showSuccess('¡Inicio de sesión exitoso!');
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          showError('❌Credenciales incorrectas');
        }
      } catch (error) {
       
    
        if (error.data && error.data.message) {
          // ✅ Ahora sí capturamos el mensaje que envía el backend
          showError(`❌ ${error.data.message}`);
         
          
        } else if (error.request) {
          showError('⚠️No se pudo conectar con el servidor.');
        } else {
          showError('❌Error inesperado. Intenta nuevamente.');
        }
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    }
  });

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
                  //minHeight: '60px',
                  ...inputStyles,
                 
                }}
              >
                <TextField
                  id="outlined-multiline-flexible"
                  //placeholder="Email"
                  label="📧 Email"
                  name="email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  type="email"
                 
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email||' '}
                  sx={{ color:'red'}}
                />
              </FormControl>

              <FormControl
                fullWidth
                margin="normal"
                
                sx={{
                 // minHeight: '60px',
                  ...inputStyles
                }}
              >
                <TextField
                  sx={{
                    borderRadius: '5px',
                    padding: '5px'
                  }}
                  label="🔒 Password"
                  name="password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  type={showPassword ? 'text' : 'password'}
                  error={ formik.touched.password && Boolean(formik.errors.password) }
                  helperText={ formik.touched.password && formik.errors.password||' ' }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showPassword ? 'Hide password' : 'Show password'
                          }
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOff
                              sx={{
                                color: 'var(--color-exito)',
                                fontSize: 30,
                                marginRight: 1
                              }}
                            />
                          ) : (
                            <Visibility
                              sx={{
                                color: 'var(--color-secundario)',
                                fontSize: 30,
                                marginRight: 1
                              }}
                            />
                          )}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              
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
                <Typography
                  sx={{
                    fontWeight: '600',
                    color: 'var(--color-azul)'
                  }}
                >
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
