import { FormControl, Typography, Grid } from '@mui/material'
import Link from '@mui/material/Link'
import { styled } from '@mui/material/styles'
import { CustomButton, InputCustom } from './CustomComponents'
import { useFormik } from 'formik'
import { UsersApi } from '../../../api/users'
import swal from 'sweetalert'
import loginValidationSchema from './LoginValidation'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../utils/context/AuthGlobal'

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

const Login = ({ theme, onSwitch }) => {
  const navigate = useNavigate()
  const { setAuthGlobal, setUser } = useAuthContext()
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await UsersApi.loginUser(values)
        console.log('Server response:', response)

        if (response && response.token && response.roles) {
          const user = {
            idUser: response.idUser,
            roles: response.roles,
            email: values.email,
            name: response.name,
            avatar:
              `${response.name.charAt(0)}${response.lastName.charAt(0)}`.toUpperCase()
          }
          localStorage.setItem('user', JSON.stringify(user))
          localStorage.setItem('token', response.token)
          setAuthGlobal(true)
          setUser(user)
          swal(
            '¡Inicio de sesión exitoso!',
            'Has iniciado sesión correctamente'
          )
          setTimeout(() => {
            navigate('/')
          }, 1000)
        } else {
          console.error('Inicio de sesión fallido:', response)
          swal(
            'Error al iniciar sesión',
            response.message || 'Credenciales incorrectas',
            'error'
          )
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
            <FormControl fullWidth margin="normal">
              <InputCustom
                placeholder="Password"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                type="password"
                color="primary"
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />
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
  )
}

export default Login
