import { styled } from '@mui/material/styles'
import { Container } from '@mui/material'

// 📌 Filtrar `isHeaderVisible` para que no llegue al DOM
export const CreateWrapper = styled(Container, {
  shouldForwardProp: (prop) => prop !== 'isHeaderVisible'
})(({ theme, isHeaderVisible }) => ({
  display: 'none',

  [theme.breakpoints.up('lg')]: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: '1rem',
    paddingBottom: '2rem',
    width: '100%',
    height: '110vh',
    overflowY: 'scroll',
    paddingTop: isHeaderVisible ? 320 : 50,

    transition: 'padding-top 1s ease-in-out'
  }
}));

export default CreateWrapper;
