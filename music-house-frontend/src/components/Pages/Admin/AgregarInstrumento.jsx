import { Box, Typography } from '@mui/material'
import CreateWrapper from '../../common/crearProd/createWrapper'
import { useHeaderVisibility } from '../../utils/context/HeaderVisibilityGlobal'
import NewInstrumentForm from '../../Form/NewInstrumentForm'
import { TitleResponsive } from '../../styles/ResponsiveComponents'


export const AgregarInstrumento = () => {
  const { isHeaderVisible } = useHeaderVisibility()
  ;('Crear Instrumento')

  return (
    <>
      <CreateWrapper isHeaderVisible={isHeaderVisible}>
        <TitleResponsive> Crear Instrumento</TitleResponsive>

        <NewInstrumentForm />
      </CreateWrapper>
      <Box
        sx={{
          display: { xs: 'flex', lg: 'none' },
          justifyContent: 'center',
          alignItems: 'center'
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
