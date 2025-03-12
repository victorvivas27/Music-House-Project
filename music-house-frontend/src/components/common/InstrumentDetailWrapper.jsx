import { styled } from '@mui/material/styles'

import { Box } from '@mui/material'

export const InstrumentDetailWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column', // 📌 Por defecto en móviles es en columna
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: '1.5rem',
  width: '100%',
  padding: '1rem', // Ajustado para mejor espaciamiento en móviles

  [theme.breakpoints.up('md')]: {
    flexDirection: 'row', // 📌 En pantallas medianas/grandes, cambia a fila
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '2rem',
    padding: '2rem'
  },

  [theme.breakpoints.up('lg')]: {
    //maxWidth: '1200px',
    margin: '0 auto',
    padding: '3rem'
  }
}))
