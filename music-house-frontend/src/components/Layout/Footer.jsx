
import { FooterWrapper } from './FooterWrapper'
import Copyright from './Copyright'
import { Typography } from '@mui/material'

import footer from '../../assets/footer.svg'

export const Footer = () => {
  return (
    <FooterWrapper backgroundImageUrl={footer}>
      <Copyright>
        <Typography
          sx={{ fontSize: { md: '40px', xs: '50px' }, color: 'white' }}
        >
          ©
        </Typography>
        <Typography
          sx={{ fontSize: { md: '40px', xs: '20px' }, color: 'white' }}
        >
          2024 MusicHouse
        </Typography>
      </Copyright>
    </FooterWrapper>
  )
}

export default Footer
