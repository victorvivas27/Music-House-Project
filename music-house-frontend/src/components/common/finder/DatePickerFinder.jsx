import { styled, alpha } from '@mui/material/styles'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

export const DatePickerFinder = styled(DatePicker)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.primary.main,
  height: '2.5rem',
  width: '100%',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.7)
  },

  input: {
    height: '2.5rem',
    border: 'none'
  },

  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: '60%'
  },

  [theme.breakpoints.up('md')]: {
    margin: 0,
    width: '20%',
    maxWidth: '10.5rem'
  }
}))
