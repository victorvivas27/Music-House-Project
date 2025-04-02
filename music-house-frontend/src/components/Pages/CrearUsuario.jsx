import { Box, Typography } from '@mui/material'
import { Logo } from '../Images/Logo'
import NewUser from '../Form/formUsuario/NewUser'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hook/useAuth'
import { BoxFormUnder, BoxLogoSuperior, MainCrearUsuario } from '../styles/ResponsiveComponents'


export const CrearUsuario = () => {
  const { isUserAdmin } = useAuth()

  return (
    <MainCrearUsuario >
      <>
        <BoxLogoSuperior>
          <Link to="/">
            <Logo />
          </Link>
        </BoxLogoSuperior>
        <BoxFormUnder
          sx={{
            display: { xs: isUserAdmin ? 'none' : 'flex', lg: 'flex' }
          }}
        >
          <NewUser />
        </BoxFormUnder>
      </>
      <Box
        sx={{
          display: { xs: 'flex', lg: 'none' },
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100vh'
        }}
      >
        <Typography
          variant="h6"
          component="h6"
          textAlign="center"
          sx={{
            fontWeight: 'bold'
          }}
        >
          Funcionalidad no disponible en esta resolución
        </Typography>
      </Box>
    </MainCrearUsuario>
  )
}
export default CrearUsuario
