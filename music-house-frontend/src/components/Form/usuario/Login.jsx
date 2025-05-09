import {
  FormControl,
  Grid,
  InputAdornment,
  IconButton,
  CircularProgress,
  TextField
} from '@mui/material'
import Link from '@mui/material/Link'
import { useFormik } from 'formik'

import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import ContactSupportRoundedIcon from '@mui/icons-material/ContactSupportRounded';
import { useAuth } from '@/hook/useAuth'
import useAlert from '@/hook/useAlert'
import { UsersApi } from '@/api/users'
import { getErrorMessage } from '@/api/getErrorMessage'
import { ContainerBottom, ContainerForm, CustomButton, ParagraphResponsive, TitleResponsive } from '@/components/styles/ResponsiveComponents'
import { fontSizeResponsi, inputStyles } from '@/components/styles/styleglobal'
import LoadingText from '@/components/common/loadingText/LoadingText'
import { loginValidationSchema } from '@/validations/login'


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
    <form onSubmit={formik.handleSubmit}>
     <fieldset disabled={loading} style={{ border: 'none', padding: 0, margin: 0 }}>
      <ContainerForm>
        <Grid >
          <TitleResponsive>Iniciar Sesión</TitleResponsive>
          <Grid 
          
          >
            <FormControl
              fullWidth
              margin="normal"
              sx={{
                ...inputStyles
              }}
            >
              <TextField
                sx={{
                  width: {
                    xs: '90%',
                   
                  },
                  marginLeft:2,
                }}
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
                width: {
                  xs: '90%',
                 
                },
                marginLeft:2,
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
                              ...fontSizeResponsi 
                            }}
                          />
                        ) : (
                          <Visibility
                            sx={{
                              color: 'var(--color-secundario)',
                            ...fontSizeResponsi                           
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
            type="submit"
             disabled={loading}
             >
              {loading ? (
                <>
                  <LoadingText text="Iniciando sesión" />
                  <CircularProgress
                    size={20}
                    sx={{ color: 'var(--color-azul)' }}
                  />
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </CustomButton>
            <Link href="" underline="always" onClick={onSwitch}>
              <ParagraphResponsive
                sx={{
                  fontWeight: '600',
                  color: 'var(--color-azul)',
                  
                }}
              >
                No tienes una cuenta? Regístrate 
                <ContactSupportRoundedIcon/>
              </ParagraphResponsive>
            </Link>
          </ContainerBottom>
        </Grid>
      </ContainerForm>
      </fieldset>
    </form>
  )
}
Login.propTypes = {
  onSwitch: PropTypes.func.isRequired
}
export default Login
