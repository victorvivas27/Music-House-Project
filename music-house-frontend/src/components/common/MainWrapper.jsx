import { styled } from '@mui/material/styles'

import { Box } from '@mui/material'

export const MainWrapper = styled(Box)(() => ({
  display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // 🔹 Asegura que la tabla esté centrada verticalmente
        width: "90vw",  // 🔹 Usa todo el ancho disponible
             
        marginTop:170,
        marginBottom:50
 }))

export default MainWrapper
