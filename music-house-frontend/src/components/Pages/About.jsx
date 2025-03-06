import { styled } from '@mui/material/styles'
import {
  CssBaseline,
  Typography,
  Box,
  Container,
  useTheme,
  useMediaQuery
} from '@mui/material'
import MainWrapper from '../common/MainWrapper'
import { AboutUs } from '../Images/AboutUs'

const CustomTypography = styled(Typography)(({ theme, bgColor }) => ({
  padding: '1.3rem',
  fontWeight: 'bold',
  width: 'fit-content',
  color: 'white',
  backgroundColor: bgColor || theme.palette.secondary.main // Usa el color secundario por defecto
}))

export const About = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md')) // < 900px
  const isTablet = useMediaQuery('(max-width: 1240px) and (min-width: 900px)') // 900px - 1240px
  

  return (
    <main>
      <CssBaseline />
      <MainWrapper>
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: isMobile ? '1rem' : '2rem'
          }}
        >
          <Box>
            <Typography
              variant={isMobile ? 'h4' : 'h3'}
              component="h2"
              textAlign="center"
              sx={{ paddingBottom: '2rem', fontWeight: 'bold' }}
            >
              Sobre nosotros
            </Typography>
          </Box>

          <Box>
            <CustomTypography
              variant={isMobile ? 'body2' : 'h6'}
              textAlign="left"
              sx={{ color: 'black', background: 'yellow' }}
            >
              Oferta de servicios
            </CustomTypography>
          </Box>

          <Box>
            <Typography
              variant={isMobile ? 'body2' : 'h5'}
              sx={{ fontWeight: '300', padding: isMobile ? '1rem' : '2rem' }}
            >
              Transformamos en emociones satisfactorias, las experiencias que
              podrían impedir la realización de nuestros sueños.
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column-reverse' : 'row',
              justifyContent: 'space-between',
              alignItems: isTablet
                ? 'center'
                : isMobile
                  ? 'flex-start'
                  : 'flex-end'
            }}
          >
            <Box>
              <CustomTypography
                variant={isMobile ? 'body2' : 'h6'}
                textAlign="left"
              >
                ¿Quiénes somos?
              </CustomTypography>
            </Box>
            <Box
              sx={{
                marginBottom: isMobile ? '4rem' : '1em',
                display: 'flex',
                justifyContent: 'center',
                maxWidth: isMobile ? '90%' : isTablet ? '85%' : '80%',
                marginX: 'auto'
              }}
            >
              <AboutUs style={{ width: '100%' }} />
            </Box>
          </Box>

          <Box>
            <Typography
              variant={isMobile ? 'body1' : 'h5'}
              sx={{ fontWeight: '300', padding: isMobile ? '1rem' : '2rem' }}
            >
              MUSIC HOUSE es el lugar donde encontrará en alquiler instrumentos
              de calidad que aportan al crecimiento del artista por medio de la
              práctica y suministra los equipos que permite realizar
              presentaciones profesionales.
            </Typography>
          </Box>
        </Container>
      </MainWrapper>
    </main>
  )
}
