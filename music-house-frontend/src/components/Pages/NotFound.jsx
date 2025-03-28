import { NotFound } from '../Images/NotFound'
import { Logo } from '../Images/Logo'
import { Box, Typography } from '@mui/material'
import { PageWrapper } from '../common/PageWrapper'

export const NotFoundPage = () => {
  return (
    <PageWrapper>
      <NotFound sx={{ with: { sx: '100%' } }} />
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'flex-end'
        }}
      >
        <Typography
          variant="h2"
          align="left"
          sx={{
            fontWeight: '300',
            width: '50rem',
            fontSize: { xs: '2rem', md: '3.75rem' }
          }}
        >
          Lo sentimos, pero esta página no está disponible.
        </Typography>
        <Logo />
      </Box>
    </PageWrapper>
  )
}
