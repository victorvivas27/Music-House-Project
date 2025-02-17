import { styled } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'

export const HeaderWrapper = styled(AppBar)(
  ({ theme, backgroundImageUrl, isHome, height }) => ({
    display: 'flex',
    height: isHome ? '19rem' : '10rem',
    position: 'fixed',
    backgroundImage: `url(${backgroundImageUrl})`,
    backgroundSize: 'cover',

    '& svg': {
      height: '4rem'
    },

    [theme.breakpoints.up('md')]: {
      height: height ? height : 300,

      '& svg': {
        height: '7rem'
      }
    }
  })
)
