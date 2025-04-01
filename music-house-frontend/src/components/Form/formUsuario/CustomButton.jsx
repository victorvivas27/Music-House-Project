import { styled } from '@mui/system'
import { Box, Button, Grid, Typography } from '@mui/material'
import { flexColumnContainer } from '../../styles/styleglobal'

export const CustomButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'sx'
})(({ theme, sx = {} }) => ({
  display: 'flex',
  justifyContent: 'space-evenly',
  width: '40%',
  height: '40px',
  color: 'var(--color-secundario)',
  backgroundColor: 'var(--color-primario)',
  fontFamily: 'Roboto',
  textTransform: 'none',
  borderRadius: '8px',
  transition: '0.3s',
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

  [theme.breakpoints.up('sm')]: {
    width: '42%'
  },
  [theme.breakpoints.up('md')]: {
    width: '45%'
  },
  [theme.breakpoints.up('lg')]: {
    width: '40%'
  },
  [theme.breakpoints.up('xl')]: {
    width: '60%'
  },

  ...sx
}))

export const ContainerBottom = styled(Grid, {
  shouldForwardProp: (prop) => prop !== 'sx'
})(({ theme, sx = {} }) => ({
  ...flexColumnContainer,
  [theme.breakpoints.up('sm')]: {
    width: '100%'
  },
  [theme.breakpoints.up('md')]: {
    width: '100%'
  },
  [theme.breakpoints.up('lg')]: {
    width: '100%'
  },
  [theme.breakpoints.up('xl')]: {
    width: '100%'
  },
  ...sx
}))

export const ContainerForm = styled(Grid, {
  shouldForwardProp: (prop) => prop !== 'sx'
})(({ theme, sx = {} }) => ({
  ...flexColumnContainer,
  width: '100vw',

  [theme.breakpoints.up('sm')]: {
    width: '75vw'
  },
  [theme.breakpoints.up('md')]: {
    width: '65vw'
  },
  [theme.breakpoints.up('lg')]: {
    width: '55vw'
  },
  [theme.breakpoints.up('xl')]: {
    width: '70vw'
  },

  ...sx
}))

export const TitleResponsive = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'sx'
})(({ theme, sx = {} }) => ({
  color: 'var(--texto-inverso-white)',
  fontWeight: 300,
  fontSize: '1rem',
  textShadow: '0 1px 2px var(--color-primario)',

  [theme.breakpoints.up('sm')]: {
    fontWeight: 350,
    fontSize: '1.1rem'
  },
  [theme.breakpoints.up('md')]: {
    fontWeight: 400,
    fontSize: '1.2rem'
  },
  [theme.breakpoints.up('lg')]: {
    fontWeight: 450,
    fontSize: '1.4rem'
  },
  [theme.breakpoints.up('xl')]: {
    fontWeight: 500,
    fontSize: '2rem',
    
  },

  ...sx
}))

export const ContainerLogo = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'sx'
})(({ theme, sx = {} }) => ({
  height: 'auto',
  width: 50,
  margin: 12,

  [theme.breakpoints.up('sm')]: {
    width: 60
  },
  [theme.breakpoints.up('md')]: {
    width: 70
  },
  [theme.breakpoints.up('lg')]: {
    width: 80
  },
  [theme.breakpoints.up('xl')]: {
    width: 90
  },

  ...sx
}))

export const ParagraphResponsive = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'sx'
})(({ theme, sx = {} }) => ({

  fontWeight: 300,
  fontSize: '0.7rem',
  fontStyle: 'italic',
  textShadow: '0 1px 2px var(--color-primario)',

  [theme.breakpoints.up('sm')]: {
    fontSize: '0.7rem',
   
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '0.8rem',
   
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: '0.9rem',
    
  },
  [theme.breakpoints.up('xl')]: {
    fontSize: '1.2rem',
   
   
  },

  ...sx
}))
