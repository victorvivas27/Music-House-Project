import { styled } from '@mui/material/styles'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

export const DatePickerBooking = styled(DatePicker)(
  ({ theme, left = true }) => ({
    backgroundColor: 'transparent',
    width: '100%',
    height: '3.5rem',
    borderRadius: left ? '10px 0 0 10px' : '0 10px 10px 0px',
    borderColor: 'transparent',
    '& .MuiOutlinedInput-notchedOutline': {
      borderRadius: left ? '10px 0 0 10px' : '0 10px 10px 0px',
      borderColor: 'black'
    },
    '& .MuiInputBase-root': {
      height: '3.5rem',
      '& .MuiInputBase-input': {
        alignSelf: 'flex-end'
      }
    },

    input: {
      height: '2.5rem',
      border: 'none'
    },

    [theme.breakpoints.up('md')]: {
      maxWidth: '9rem'
    },

    [theme.breakpoints.up('md')]: {
      width: 'auto',
      maxWidth: '11rem',
      margin: 0
    }
  })
)
