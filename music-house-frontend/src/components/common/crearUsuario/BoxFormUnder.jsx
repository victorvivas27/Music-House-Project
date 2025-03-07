import { styled } from '@mui/material/styles'
import { Grid } from '@mui/material'

export const BoxFormUnder = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  paddingTop: '10px',
  width: '100%',
  height: '100%',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-end',
    justifyContent: 'center'
  }
}))

export default BoxFormUnder
