import { FooterWrapper } from './FooterWrapper'

import footer from '../../assets/footer.svg'
import { TitleResponsive } from '../styles/ResponsiveComponents'
import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { Link } from 'react-router-dom'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import TwitterIcon from '@mui/icons-material/Twitter'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import YouTubeIcon from '@mui/icons-material/YouTube'
import { Copyright } from '@mui/icons-material'
import { flexRowContainer } from '../styles/styleglobal'

export const Footer = () => {
  return (
    <FooterWrapper backgroundImageUrl={footer}>
      <Box
        component="footer"
        sx={{
          ...flexRowContainer,
          backgroundColor: 'var(--background-transparente-dark)',
          color: '#fff',
          width: '100%',
          height: '100%'
        }}
      >
        <Box
          sx={{
            ...flexRowContainer,
            justifyContent: 'space-evenly',
           gap: 4,
            flexWrap: 'wrap',
            width: '80%',
            height: '50%'
          }}
        >
          {/* Información de contacto */}
          <Box>
            <TitleResponsive gutterBottom>Contacto</TitleResponsive>
            <Typography variant="body2">
              📍 Av. Principal 1234, Ciudad
            </Typography>
            <Typography variant="body2">📞 +56 9 1234 5678</Typography>
            <Link
              href="/preguntas-frecuentes"
              color="inherit"
              underline="hover"
            >
              ❓ Preguntas Frecuentes
            </Link>
          </Box>

          {/* Redes sociales */}
          <Box>
            <TitleResponsive gutterBottom>Redes Sociales</TitleResponsive>
            <Box>
              <IconButton
                color="inherit"
                href="https://facebook.com"
                target="_blank"
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                color="inherit"
                href="https://instagram.com"
                target="_blank"
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                color="inherit"
                href="https://twitter.com"
                target="_blank"
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                color="inherit"
                href="https://linkedin.com"
                target="_blank"
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton
                color="inherit"
                href="https://youtube.com"
                target="_blank"
              >
                <YouTubeIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Formulario de dudas */}
          <Box sx={{ width: 300 }}>
            <TitleResponsive gutterBottom>¿Tienes dudas?</TitleResponsive>
            <Typography variant="body2" gutterBottom>
              Escríbenos y te responderemos lo antes posible.
            </Typography>
            <Stack direction="column" spacing={1}>
              <TextField
                fullWidth
                placeholder="Escribe tu duda..."
                size="small"
                sx={{
                  input: { color: '#fff' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#fff' },
                    '&:hover fieldset': { borderColor: '#ccc' }
                  }
                }}
                InputLabelProps={{
                  style: { color: '#fff' }
                }}
              />
              <Button variant="contained" color="primary">
                Enviar
              </Button>
            </Stack>
          </Box>
        </Box>

        {/* Copyright */}
        <Box
          component="footer"
          sx={{
            bottom: 0,
            left: 0,
            width: '100%',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="body2"
            color="white"
            display="flex"
            alignItems="center"
            gap={1}
          >
            <Copyright /> 2024 MusicHouse. Todos los derechos reservados.
          </Typography>
        </Box>
      </Box>
    </FooterWrapper>
  )
}

export default Footer
