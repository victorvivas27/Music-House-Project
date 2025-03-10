import { styled } from '@mui/material/styles'
import { Grid } from '@mui/material'
import background from '../../../assets/CrearUsuarioBackGround.png'

export const MainCrearUsuario = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundImage: `url(${background})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'left bottom',
  height: '100%',
  minHeight: '100vh',
  transition: 'background-image 1s ease-in-out',
 /*   // Ajuste para dispositivos móviles
   '@media (max-width: 415px)': {
    backgroundSize: 'contain', // Ajusta la imagen sin recortarla
    backgroundPosition: 'center', // Centra la imagen
    
  } */
}))
