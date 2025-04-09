import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import { useHeaderVisibility } from '@/components/utils/context/HeaderVisibilityGlobal'
import { CreateWrapper, TitleResponsive } from '@/components/styles/ResponsiveComponents'
import { EditThemeForm } from '@/components/Form/theme/EditThemeForm'






export const EditarTheme = () => {
  const [key, setKey] = useState(0)
  const { isHeaderVisible } = useHeaderVisibility()
  const { id } = useParams()

  const onClose = () => {
    setKey(Math.random())
  }

  return (
    <main>
      <CreateWrapper isHeaderVisible={isHeaderVisible}>
        <TitleResponsive>Editar Tematica</TitleResponsive>
        <EditThemeForm key={key} id={id} onSaved={onClose} />
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
