import { styled } from '@mui/material/styles'
import { Grid } from '@mui/material'

const FormWrapper = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  alignItems: 'center',
  gap: '1rem',
  paddingTop: 1,
  width: '100%',
  height: '100%',
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'column'
  },

  [theme.breakpoints.up('md')]: {
    paddingTop: 3
  }
}))

export default FormWrapper
