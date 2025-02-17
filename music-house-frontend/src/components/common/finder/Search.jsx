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
  height: '2.5rem',

  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: '60%'
  },

  [theme.breakpoints.up('md')]: {
    margin: 0,
    width: '33%',
    maxWidth: '18.375rem'
  },

  '& .MuiInputBase-root': {
    width: '100%',
    height: '100%'
  }
}))
