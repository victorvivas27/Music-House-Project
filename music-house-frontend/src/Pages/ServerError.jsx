import { Logo } from "@/components/Images/Logo"
import { NotFound } from "@/components/Images/NotFound"
import { PageWrapper } from "@/components/styles/ResponsiveComponents"
import { Box, Typography } from "@mui/material"





export const ServerError = () => {
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
          Lo sentimos, servicio no disponible. Inténtalo más tarde
        </Typography>
        <Logo />
      </Box>
    </PageWrapper>
  )
}
