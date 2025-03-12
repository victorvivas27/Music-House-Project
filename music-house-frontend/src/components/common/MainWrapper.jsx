import { styled } from '@mui/material/styles'

import { Box } from '@mui/material'

export const MainWrapper = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'flex-start', // 🔹 Empieza desde arriba, no en el centro
  alignItems: 'center',
  minHeight: '100vh', // 🔹 Permite que el contenedor crezca si el contenido es mayor a la pantalla
  width: '99vw',
  border: '7px solid rgb(247, 0, 0)',
  marginTop: 300, // 🔹 Reduce margen superior si es necesario
  marginBottom: 50
}))

export default MainWrapper
