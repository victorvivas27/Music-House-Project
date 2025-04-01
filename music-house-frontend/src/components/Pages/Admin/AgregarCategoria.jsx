import { Box, Typography } from '@mui/material'
import CreateWrapper from '../../common/crearProd/createWrapper'
import { useHeaderVisibility } from '../../utils/context/HeaderVisibilityGlobal'
import { NewCategoryForm } from '../../Form/NewCategoryForm'
import { TitleResponsive } from '../../styles/ResponsiveComponents'


export const AgregarCategoria = () => {
  const { isHeaderVisible } = useHeaderVisibility()

  return (
    <main>
      <CreateWrapper isHeaderVisible={isHeaderVisible}>
        <TitleResponsive>Crear Categoría</TitleResponsive>
        <NewCategoryForm />
      </CreateWrapper>
      <Box
        sx={{
          display: { xs: 'flex', lg: 'none' },
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100vh'
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
    </main>
  )
}
