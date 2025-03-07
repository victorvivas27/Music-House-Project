import { styled } from '@mui/material/styles'
import { Grid } from '@mui/material'

export const BoxFormUnder = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  margin: 'auto',
  padding: '10px',
  //border: '5px solid yellow',

  // Estilos para pantallas pequeñas
  [theme.breakpoints.down('sm')]: {
    width: '99%',
    height: 'auto'
  },

  // Estilos para tablets (pantallas medianas)
  [theme.breakpoints.between('sm', 'md')]: {
    width: '95%',
    height: '95%'
  },

  // Estilos para pantallas grandes
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: '97%',
    height: '98%'
  }
}))

export default BoxFormUnder
