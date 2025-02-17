import { Header } from './Header'
import { Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import WhatsAppContact from './WhatsAppContact'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Box } from '@mui/material'
const theme = createTheme({
  palette: {
    primary: {
      main: '#F7E434'
    },
    secondary: {
      main: '#347bf7'
    }
  }
})

export const UserLayout = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        <Header />
        <Box sx={{ flex: 1 }}>
          <Outlet />
        </Box>
        <Footer />
        <WhatsAppContact />
      </Box>
    </ThemeProvider>
  )
}

export const UserLayoutWithoutHeaderFooter = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        <Box sx={{ flex: 1 }}>
          <Outlet />
        </Box>
        <WhatsAppContact />
      </Box>
    </ThemeProvider>
  )
}

export const AdminLayout = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        <Header />
        <Box sx={{ flex: 1 }}>
          <Outlet />
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  )
}

export const AdminLayoutWithoutHeaderFooter = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        <Box sx={{ flex: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  )
}
