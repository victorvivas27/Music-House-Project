import { Box, Typography, List, ListItem } from '@mui/material'

export const InstrumentTerms = () => {
  return (
    <Box sx={{ width: '100%', padding: '1rem' }}>
      {/* 📌 Título principal */}
      <Typography
        variant="h5"
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
          marginBottom: '1.5rem',
        }}
      >
        📜 Políticas del Producto
      </Typography>

      {/* 📌 Contenedor de las dos listas */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' }, // Columnas en móviles, filas en pantallas grandes
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: { xs: '1rem', md: '2rem' },
        }}
      >
        {/* 📌 Primera lista */}
        <Box sx={{ flex: 1, minWidth: '300px' }}> {/* Se asegura que las columnas tengan tamaño flexible */}
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Reglas de Entrega y Uso
          </Typography>
          <List>
            {[
              'Debe ser entregado en buen estado.',
              'Los daños ocasionados deben ser asumidos por el usuario.',
              'El instrumento debe ser devuelto a la misma hora que se retiró.',
              'El instrumento debe ser entregado junto con sus accesorios en buen estado.',
            ].map((item, index) => (
              <ListItem key={index} sx={{ paddingY: '4px' }}>
                <Typography variant="body1" sx={{ fontWeight: '300' }}>
                  {index + 1}) {item}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* 📌 Segunda lista */}
        <Box sx={{ flex: 1, minWidth: '300px' }}> {/* Se asegura que las columnas tengan tamaño flexible */}
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Seguridad y Pruebas
          </Typography>
          <List>
            {[
              'Los instrumentos deben ser probados antes de su retiro.',
              'Puede adquirir una póliza de seguro que lo cubre ante accidentes.',
            ].map((item, index) => (
              <ListItem key={index + 5} sx={{ paddingY: '4px' }}>
                <Typography variant="body1" sx={{ fontWeight: '300' }}>
                  {index + 5}) {item}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Box>
  );
};