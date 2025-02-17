import { styled } from '@mui/system'
import TextField from '@mui/material/TextField'
import { Button } from '@mui/material'

export const InputCustom = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    color: 'black',
    backgroundColor: '#D7D7D7D7'
  },

  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: '#F7E434'
    }
  },

  [theme.breakpoints.up('md')]: {
    backgroundColor: '#D7D7D73C'
  }
}))

export const CustomButton = styled(Button)(({ theme }) => ({
  marginTop: '2rem',
  color: 'black',
  backgroundColor: '#F7E434',
  '&:hover': {
    backgroundColor: '#D6C327' // Color cuando el botón está en hover
  },
  '&:active': {
    backgroundColor: '#B8A421' // Color cuando el botón está activo
  },

  [theme.breakpoints.up('md')]: {
    marginTop: 0
  }
}))
