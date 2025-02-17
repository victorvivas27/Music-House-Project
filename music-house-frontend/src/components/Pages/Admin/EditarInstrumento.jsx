import { useState } from 'react'
import { useParams } from 'react-router-dom'
import CreateWrapper from '../../common/crearProd/createWrapper'
import { Box, Typography } from '@mui/material'
import { useHeaderVisibility } from '../../utils/context/HeaderVisibilityGlobal'
import EditInstrumentForm from '../../Form/EditInstrumentForm'

import '../../styles/crearInstrumento.styles.css'

export const EditarInstrumento = () => {
  const [key, setKey] = useState(0)
  const { isHeaderVisible } = useHeaderVisibility()
  const { id } = useParams()

  const onClose = () => {
    setKey(Math.random())
  }

  return (
    <main>
      <CreateWrapper isHeaderVisible={isHeaderVisible}>
        <Typography sx={{ fontSize: '35px' }}>Editar Instrumento</Typography>
        <EditInstrumentForm key={key} id={id} onSaved={onClose} />
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
