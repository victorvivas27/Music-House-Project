import { styled } from '@mui/system'
import { Button } from '@mui/material'


export const CustomButton = styled(Button)(({ theme }) => ({
  display:"flex",
  justifyContent:"space-evenly",
 width:"300px",
 height:"50%",
  color: 'var(--color-secundario)',
  backgroundColor: 'var(--color-primario)',
  fontFamily:"Roboto",
  textTransform: 'none',
  borderRadius: '8px',
  transition: '0.3s',
  

  '&:hover': {
    backgroundColor: 'var(--color-secundario)',
    color:'var(--color-primario)'
  },
  '&:active': {
    backgroundColor: 'var(--color-primario-active)'
  },

  '&:disabled': {
    backgroundColor: 'var(--background-disabled)',
    
    opacity: 0.7,
    cursor: 'not-allowed'
  },

  [theme.breakpoints.up('md')]: {
    marginTop: 0
  }
}))
