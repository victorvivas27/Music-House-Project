import { styled } from '@mui/material/styles'
import { Grid } from '@mui/material'
import background from '../../../assets/CrearUsuarioBackGround.png'

export const MainCrearUsuario = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '.5rem',
  backgroundImage: `url(${background})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'left bottom',
  height: '100%',
  minHeight: '100vh',
  transition: 'background-image 0.5s ease-in-out',

  [theme.breakpoints.up('md')]: {
    backgroundPosition: 'center bottom',
    height: '100vh'
  }
}))
