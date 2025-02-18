
import { Box, Typography } from '@mui/material'
import { MainCrearUsuario } from '../common/crearUsuario/MainCrearUsuario'
import BoxLogoSuperior from '../common/crearUsuario/BoxLogoSuperior'
import { Logo } from '../Images/Logo'
import NewUser from '../Form/formUsuario/NewUser'
import BoxFormUnder from '../common/crearUsuario/BoxFormUnder'
import { useAuthContext } from '../utils/context/AuthGlobal'
import { Link } from 'react-router-dom'

export const CrearUsuario = () => {
  const { isUserAdmin } = useAuthContext()

  return (
    <MainCrearUsuario>
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
          gutterBottom
          variant="h6"
          component="h6"
          textAlign="center"
          sx={{
            paddingTop: 30,
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
