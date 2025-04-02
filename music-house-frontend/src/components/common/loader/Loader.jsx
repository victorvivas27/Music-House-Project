import { keyframes, styled } from '@mui/material/styles'
import { Container, CircularProgress, Typography, Box } from '@mui/material'
import PropTypes from 'prop-types'

const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
`

const CustomLoader = styled(CircularProgress)(({ theme }) => ({
  color: theme.palette.primary.main,
}))

export const Loader = ({ title, fullSize = true }) => {
  return (
    <Container
      sx={{
        width: fullSize ? '100%' : 'auto',
        height: fullSize ? '100vh' : 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: title ? '1.5rem' : 0,
        backgroundColor: fullSize ? 'transparent' : 'var(--color-primario)',
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CustomLoader
          disableShrink
          size={fullSize ? '4rem' : '2rem'}
          thickness={4}
        />
      </Box>

      {title && (
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 500,
            fontSize: { xs: '1.2rem', sm: '1.5rem' },
            color: 'var(--color-exito)',
            animation: `${fadeIn} 0.6s ease-in-out`,
            textAlign: 'center',
          }}
        >
          {title}
        </Typography>
      )}
    </Container>
  )
}

Loader.propTypes = {
  title: PropTypes.string,
  fullSize: PropTypes.bool,
}