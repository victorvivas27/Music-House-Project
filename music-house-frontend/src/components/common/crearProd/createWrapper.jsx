import { styled } from '@mui/material/styles'
import { Container } from '@mui/material'

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

export default CreateWrapper
