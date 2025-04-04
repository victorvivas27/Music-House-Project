import { useParams } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import { useHeaderVisibility } from '../../utils/context/HeaderVisibilityGlobal'
import { EditCategoryForm } from '../../Form/EditCategoryForm'
import { CreateWrapper, TitleResponsive } from '../../styles/ResponsiveComponents'

export const EditarCategoria = () => {
 const { isHeaderVisible } = useHeaderVisibility()
const { id } = useParams()

return (
    <main>
      <CreateWrapper isHeaderVisible={isHeaderVisible}>
        <TitleResponsive>Editar Categoría</TitleResponsive>
        <EditCategoryForm  id={id}  />
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
