import { styled } from '@mui/material/styles'
import { Grid } from '@mui/material'

export const FooterWrapper = styled(Grid, {
  shouldForwardProp: (prop) => prop !== 'backgroundImageUrl'
})(({ backgroundImageUrl }) => ({
  display: 'flex',
  height:"500px",
  backgroundImage: `url(${backgroundImageUrl})`,
  justifyContent: 'flex-start',
  alignItems: 'flex-end',
  backgroundSize: 'cover',
  backgroundPosition: 'center bottom',
  backgroundRepeat: 'no-repeat',
  
}));
