import { styled, alpha } from '@mui/material/styles'
import { Button } from '@mui/material'

export const ButtonFinder = styled(Button)(({ theme }) => ({
  color: 'white',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.secondary.main,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.7)
  },
  '&:disabled': {
    backgroundColor: alpha(theme.palette.primary.main, 0.7)
  },
  height: '2.5rem',
  width: '50%',

  [theme.breakpoints.up('sm')]: {
    width: '30%',
    marginLeft: theme.spacing(3)
  },

  [theme.breakpoints.up('md')]: {
    margin: 0,
    width: 'auto'
  }
}))
