import { styled } from '@mui/material/styles'
import { Grid } from '@mui/material'

export const FooterWrapper = styled(Grid, {
  shouldForwardProp: (prop) => prop !== 'backgroundImageUrl' // ⛔ No pasa al DOM
})(({ backgroundImageUrl }) => ({
  display: 'flex',
  height: 100,
  backgroundImage: `url(${backgroundImageUrl})`, // ✅ Se usa en los estilos
  justifyContent: 'flex-start',
  alignItems: 'flex-end',
  backgroundSize: 'cover',
  backgroundPosition: 'center bottom',
  backgroundRepeat: 'no-repeat',
  width: '100vw'
}));
