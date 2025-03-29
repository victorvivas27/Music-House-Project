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
import { ContainerBottom, ContainerForm, CustomButton } from './CustomButton'
import { useFormik } from 'formik'
import { UsersApi } from '../../../api/users'
import loginValidationSchema from './LoginValidation'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { inputStyles } from '../../styles/styleglobal'
import useAlert from '../../../hook/useAlert'
import { useAuth } from '../../../hook/useAuth'
import { getErrorMessage } from '../../../api/getErrorMessage'
import LoadingText from '../../common/loadingText/LoadingText'

const Login = ({ onSwitch }) => {
  const navigate = useNavigate()
  const { setAuthData } = useAuth()
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
      setLoading(true)

      try {
        const response = await UsersApi.loginUser(values)

        if (response?.result?.token) {
          setAuthData({ token: response.result.token })

          setTimeout(() => {
            setLoading(false)
            navigate('/')
            showSuccess(`✅ ${response.message}`, null, () => {
              setSubmitting(false)
              setLoading(false)
            })
          }, 5000)
        } else {
          showError(`❌ ${response.message}`)
          setSubmitting(false)
          setLoading(false)
        }
      } catch (error) {
        showError(`❌ ${getErrorMessage(error)}`)
        setSubmitting(false)
        setLoading(false)
      }
    }
  })

  return (
    <form onSubmit={formik.handleSubmit} style={{ border: '2px solid blue' }}>
      <ContainerForm>
        <Grid
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            width: '90%',
            borderRadius: '8px',
            padding: '20px'
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
                ...inputStyles
              }}
            >
              <TextField
                id="outlined-multiline-flexible"
                label="📧 Email"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                type="email"
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={
                  (formik.touched.email && formik.errors.email) || ' '
                }
              />
            </FormControl>

            <FormControl
              fullWidth
              margin="normal"
              sx={{
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
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={
                  (formik.touched.password && formik.errors.password) || ' '
                }
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

          <ContainerBottom
            sx={{
              width: '38%'
            }}
          >
            <CustomButton
             type="submit" 
             disabled={loading}
             >
              {loading ? (
                <>
                  <LoadingText text="Iniciando sesión" />
                  <CircularProgress
                    size={30}
                    sx={{ color: 'var(--color-azul)' }}
                  />
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </CustomButton>
            <Link href="" underline="always" onClick={onSwitch}>
              <Typography
                sx={{
                  fontWeight: '600',
                  color: 'var(--color-azul)',
                  marginTop: { xs: '40px', md: '20px' }
                }}
              >
                No tienes una cuenta? Regístrate
              </Typography>
            </Link>
          </ContainerBottom>
        </Grid>
      </ContainerForm>
    </form>
  )
}
Login.propTypes = {
  onSwitch: PropTypes.func.isRequired
}
export default Login
