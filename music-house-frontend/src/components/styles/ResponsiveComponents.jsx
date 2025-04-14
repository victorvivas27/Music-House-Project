import { styled } from '@mui/system'
import { Box, Button, Container, Grid, Typography } from '@mui/material'
import { flexColumnContainer } from './styleglobal'
import background from '@/assets/CrearUsuarioBackGround.png'

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
    backgroundColor: 'var(--color-primario)',
    color: 'var(--color-azul)'
  },
  '&:active': {
    backgroundColor: 'var(--color-exito)'
  },
  '&:disabled': {
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
  color: 'var(--texto-inverso-darck)',
  textShadow: '0 1px 2px var(--color-primario)',
  fontWeight: 350,
  fontSize: '1rem',

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
    fontSize: '2rem'
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
  wordWrap: 'break-word',
  overflowWrap: 'break-word',

  // 💡 Línea clamp (máximo 3 líneas + "...")
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',

  [theme.breakpoints.up('sm')]: {
    fontSize: '0.7rem'
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '0.8rem'
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: '0.9rem'
  },
  [theme.breakpoints.up('xl')]: {
    fontSize: '0.9rem'
  },

  ...sx
}))

export const CreateWrapper = styled(Container, {
  shouldForwardProp: (prop) => prop !== 'isHeaderVisible'
})(({ theme, isHeaderVisible }) => ({
  display: 'none',

  [theme.breakpoints.up('lg')]: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '14rem',
    width: '100%',
    minHeight: '100vh',
    height: 'auto',
    maxWidth: '90%',
    paddingTop: isHeaderVisible ? 50 : 50,
    marginTop: '310px',
    transition: 'padding-top 1s ease-in-out'
  }
}))

export const BoxFormUnder = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  margin: 'auto',

  [theme.breakpoints.down('sm')]: {
    width: '99%',
    height: 'auto'
  },

  [theme.breakpoints.between('sm', 'md')]: {
    width: '95%',
    height: '95%'
  },

  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: '97%',
    height: '98%'
  }
}))

export const BoxLogoSuperior = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  marginTop: 20
}))

export const MainCrearUsuario = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundImage: `url(${background})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'left bottom',
  height: '100%',
  minHeight: '100vh',
  transition: 'background-image 1s ease-in-out',
  backgroundAttachment: 'fixed'
}))

export const MainWrapper = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  width: '100vw',
  marginTop: 305,
  marginBottom: 50
}))

export const InstrumentDetailWrapper = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  width: '98vw',
  margin: 'auto',
  marginTop: 310,
  marginBottom: 50
}))

export const PageWrapper = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: '.5rem',
  height: '100%',
  minHeight: '100vh',
  padding: '1rem',

  [theme.breakpoints.up('md')]: {
    height: '100vh'
  }
}))

export const ProductsWrapper = styled(Box)(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: 2,
  width: '100%',
  maxWidth: '99%',
  margin: '0 auto'
}))
