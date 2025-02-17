import { styled } from '@mui/material/styles'
import { CssBaseline, Typography, Box, Container } from '@mui/material'
import MainWrapper from '../common/MainWrapper'
import { AboutUs } from '../Images/AboutUs'
import { isMobile } from 'react-device-detect'

const CustomTypography = styled(Typography)(({ theme, primary = false }) => ({
  padding: '1.3rem',
  fontWeight: 'bold',
  width: 'fit-content',
  color: primary ? 'black' : 'white',
  backgroundColor: primary
    ? theme.palette.primary.main
    : theme.palette.secondary.main
}))

export const About = () => {
  return (
    <main>
      <>
        <CssBaseline />
        <MainWrapper>
          <Container
            sx={{ display: 'flex', flexDirection: 'column', padding: '2rem' }}
          >
            <Box>
              <Typography
                gutterBottom
                variant="h5"
                component="h2"
                textAlign="center"
                sx={{ paddingBottom: '2rem', fontWeight: 'bold' }}
              >
                Sobre nosotros
              </Typography>
            </Box>
            <Box>
              <CustomTypography
                gutterBottom
                variant="h6"
                textAlign="left"
                primary
              >
                Oferta de servicios
              </CustomTypography>
            </Box>
            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: '300', padding: '2rem' }}
              >
                Transformamos en emociones satisfactorias, las experiencias que
                podrían impedir la realización de nuestros sueños.
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column-reverse', md: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', md: 'flex-end' }
              }}
            >
              <Box>
                <CustomTypography gutterBottom variant="h6" textAlign="left">
                  ¿Quiénes somos?
                </CustomTypography>
              </Box>
              <Box sx={{ marginBottom: isMobile ? '2rem' : '.35em' }}>
                <AboutUs
                  width={isMobile ? '100%' : undefined}
                  height={isMobile ? '100%' : undefined}
                />
              </Box>
            </Box>
            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: '300', padding: '2rem' }}
              >
                MUSIC HOUSE es el lugar donde encontrará en alquiler
                instrumentos de calidad que aportan al crecimiento del artista
                por medio de la práctica y suministra los equipos que permite
                realizar presentaciones profesionales.
              </Typography>
            </Box>
          </Container>
        </MainWrapper>
      </>
    </main>
  )
}
