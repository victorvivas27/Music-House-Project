import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

export const LogoWrapper = styled(Typography)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexGrow: 1,
 letterSpacing: '.3rem',
  color: 'inherit',
  textDecoration: 'none',

  [theme.breakpoints.up('md')]: {
    flexDirection: 'row-reverse',
  },
}))
