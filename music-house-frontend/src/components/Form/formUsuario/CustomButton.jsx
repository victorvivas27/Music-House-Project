import { styled } from '@mui/system'
import { Box, Button, Grid, Typography } from '@mui/material'

export const CustomButton = styled(Button)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-evenly',
  width: '100%',
  height: '40px',
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
  display: 'flex',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  flexDirection: 'column',
  border: '1px solid blue',
  width: '65%', 
  [theme.breakpoints.up('sm')]: {
    width: '70%',
  },
  [theme.breakpoints.up('md')]: {
    width: '70%',
  },
  [theme.breakpoints.up('lg')]: {
    width: '65%',
  },
  [theme.breakpoints.up('xl')]: {
    width: '60%',
  }
}))

export const ContainerForm = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent:"center",
  margin: 'auto',
  border: '4px solid red',

  width: '95vw', 

  [theme.breakpoints.up('sm')]: {
    width: '85vw',
  },
  [theme.breakpoints.up('md')]: {
    width: '75vw',
  },
  [theme.breakpoints.up('lg')]: {
    width: '65vw',
  },
  [theme.breakpoints.up('xl')]: {
    width: '50vw',
  }
}))

export const TitleResponsive = styled(Typography)(({ theme }) => ({
  color: 'var(--texto-inverso)',
  fontWeight: 300, 
  fontSize: '1.5rem', 

  [theme.breakpoints.up('sm')]: {
    fontWeight: 350,
    fontSize: '2.2rem'
  },
  [theme.breakpoints.up('md')]: {
    fontWeight: 400,
    fontSize: '2.5rem'
  },
  [theme.breakpoints.up('lg')]: {
    fontWeight: 450,
    fontSize: '2.8rem'
  },
  [theme.breakpoints.up('xl')]: {
    fontWeight: 500,
    fontSize: '2.5rem'
  }
}))
 export const ContainerLogo=styled(Box)(({theme})=>({
height: 'auto',
border:"1px solid yellow",
width:50,
margin:12,
  [theme.breakpoints.up('sm')]: {
    width:60
   
  },
  [theme.breakpoints.up('md')]: {
    width:70
  },
  [theme.breakpoints.up('lg')]: {
    width:80
  },
  [theme.breakpoints.up('xl')]: {
    width:90
  }

 }))


