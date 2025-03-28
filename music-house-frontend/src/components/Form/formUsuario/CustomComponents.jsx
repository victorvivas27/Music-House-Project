import { styled } from '@mui/system'
import { Button } from '@mui/material'

export const CustomButton = styled(Button)(({ theme }) => ({
  minWidth: '190px',
  minHeight: '50px',
  color: 'var(--color-secundario)',
  backgroundColor: 'var(--color-primario)',
  fontWeight: 'bold',
  textTransform: 'none',
  borderRadius: '8px',
  transition: '0.3s',

  '&:hover': {
    backgroundColor: 'var(--color-primario)'
  },
  '&:active': {
    backgroundColor: 'var(--color-primario-active)'
  },

  '&:disabled': {
    backgroundColor: 'var(--color-primario)',
    color: 'var(--color-secundario)',
    opacity: 0.7,
    cursor: 'not-allowed'
  },

  [theme.breakpoints.up('md')]: {
    marginTop: 0
  }
}))
