import { styled, alpha } from '@mui/material/styles'

export const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.7)
  },
  marginRight: 0,
  marginLeft: 0,
  width: '100%',
  height: '3.5rem',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: '80%'
  },
  [theme.breakpoints.up('md')]: {
    margin: 0,
    width: '500px',
    maxWidth: '90%'
  },

  '& .MuiInputBase-root': {
    width: '100%',
    height: '100%'
  }
}))
