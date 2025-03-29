import { styled } from '@mui/system'
import { Button, Grid } from '@mui/material'

export const CustomButton = styled(Button)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-evenly',
  width: '100%',
  height: '50px',
  color: 'var(--color-secundario)',
  backgroundColor: 'var(--color-primario)',
  fontFamily: 'Roboto',
  textTransform: 'none',
  borderRadius: '8px',
  transition: '0.3s',
  border: '1px solid red',

  '&:hover': {
    backgroundColor: 'var(--color-secundario)',
    color: 'var(--color-primario)'
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

export const ContainerBottom = styled(Grid)(({ theme }) => ({
  width: '100%',
  height: '20%',
  display: 'flex',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  flexDirection: 'column',

  border: '1px solid blue',

  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    width: '100%',
    marginLeft: '0px'
  }
}))

export const ContainerForm = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  margin: 'auto',
  width: '96vw',
  border: '4px solid red',

  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-end !important',
    flexDirection: 'column'
  }
}))
