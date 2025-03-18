import { Box, Typography } from '@mui/material'
import CreateWrapper from '../../common/crearProd/createWrapper'
import { useHeaderVisibility } from '../../utils/context/HeaderVisibilityGlobal'
import NewInstrumentForm from '../../Form/NewInstrumentForm'

import '../../styles/crearInstrumento.styles.css'

export const AgregarInstrumento = () => {
  const { isHeaderVisible } = useHeaderVisibility()

  return (
    <>
      <CreateWrapper 
      isHeaderVisible={isHeaderVisible}>
        <Typography sx={{ fontSize: '35px' }}>Crear Instrumento</Typography>
        <NewInstrumentForm />
      </CreateWrapper>
      <Box
        sx={{
          display: { xs: 'flex', lg: 'none' },
          justifyContent: 'center',
          alignItems: 'center',
         
         
        }}
      >
        <Typography
          gutterBottom
          variant="h6"
          component="h6"
          textAlign="center"
          sx={{
            paddingTop: 30,
            fontWeight: 'bold'
          }}
        >
          Funcionalidad no disponible en esta resolución
        </Typography>
      </Box>
    </>
  )
}
