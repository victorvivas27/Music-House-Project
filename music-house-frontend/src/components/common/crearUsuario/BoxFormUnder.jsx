import { styled } from '@mui/material/styles'
import { Grid } from '@mui/material'

export const BoxFormUnder = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  margin: 'auto',

  

  [theme.breakpoints.down('sm')]: {
    width: '99%',
    height: 'auto'
  },

  [theme.breakpoints.between('sm', 'md')]: {
    width: '95%',
    height: '95%'
  },

  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: '97%',
    height: '98%'
  }
}))

export default BoxFormUnder
