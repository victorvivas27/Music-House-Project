import { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Stack,
  Grid,
  CircularProgress
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

import { deleteReservation, getReservationById } from '../../api/reservations'
import useAlert from '../../hook/useAlert'
import { useAuth } from '../../hook/useAuth'
import { getErrorMessage } from '../../api/getErrorMessage'
import TooltipMy from '../common/toolTip/ToolTipMy'


const MisReservas = () => {
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)
  const { idUser } = useAuth()
 
  const { showConfirm, showLoading, showSuccess, showError } = useAlert()

  const getAllReservations = useCallback(async () => {
    setLoading(true)
    try {
      const response = await getReservationById(idUser)
      setReservas(response.result || [])
    } catch {
      setReservas([])
    } finally {
      setTimeout(() => setLoading(false), 500)
    }
  }, [idUser])

  useEffect(() => {
    getAllReservations()
  }, [getAllReservations])

  const handleDelete = async (idReservation) => {
    const reserva = reservas.find((r) => r.idReservation === idReservation)
    if (!reserva) return

    const isConfirmed = await showConfirm({
      title: '¿Eliminar reserva?',
      text: 'Esta acción no se puede deshacer.'
    })
    if (!isConfirmed) return

    showLoading('Eliminando...', 'Por favor espera.')
    try {
      await deleteReservation(
        reserva.idInstrument,
        reserva.idUser,
        reserva.idReservation
      )
      showSuccess('✅ Reserva eliminada correctamente.')
      getAllReservations()
    } catch (error) {
      showError(`❌ ${getErrorMessage(error)}`)
    }
  }

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        mt: { xs: 20, sm: 12, md: 40 },
        p: 2,
        backgroundColor: '#f5f5f5',
        borderRadius: 4,
        margin: 2,
        boxShadow: 'var(--box-shadow)'
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          fontFamily: 'Roboto',
          fontWeight: 'bold',
          color: 'var(--color-primario)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#fff',
          borderRadius: 2,
          px: 3,
          py: 1,
          display: 'inline-block',
          mx: 'auto',
          width: 'fit-content',
          fontSize: {
            xs: '1.5rem',
            sm: '2rem',
            md: '2.5rem'
          }
        }}
      >
        🎸Reservas
      </Typography>

      <Grid container spacing={1} justifyContent="center">
        {reservas.map((reserva) => (
          <Grid item key={reserva.idReservation} xs={6} sm={4} md={3} lg={2}>
            <Card
              sx={{
                maxWidth: '100%',
                mx: 'auto',
                boxShadow: 'var(--box-shadow)',
                borderRadius: 4,
                transition: 'transform 0.3s',
                height: '95%',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            >
              <CardMedia
                component="img"
                image={reserva.imageUrl || '/images/default-placeholder.png'}
                alt={reserva.instrumentName}
                sx={{
                  padding: 1,

                  objectFit: 'contain',
                  borderRadius: '4px 4px 0 0'
                }}
              />
              <CardContent>
                <Stack spacing={1}>
                  <Typography
                    variant="h6"
                    sx={{ fontFamily: 'Roboto', fontWeight: 'bold' }}
                  >
                    {reserva.instrumentName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Inicio:</strong> {reserva.startDate}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Fin:</strong> {reserva.endDate}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ color: '#d32f2f' }}
                  >
                    Total: ${reserva.totalPrice}
                  </Typography>
                </Stack>
               
                <TooltipMy
                  message="¿Seguro que deseas quitar esto de tus reservas? "
                  backgroundColor="var(--color-primario)"
                  textColor="var(--color-error)"
                  fontSize="0.9rem"
                  width="300px"
                >
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(reserva.idReservation)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TooltipMy>
               
              </CardContent>
            </Card>
          </Grid>
        ))}
        <div style={{ display: 'flex', gap: '1rem', padding: '2rem' }}></div>
      </Grid>

      {reservas.length === 0 && (
        <Typography mt={6} textAlign="center" sx={{ color: '#757575' }}>
          No tienes reservas activas.
        </Typography>
      )}
    </Box>
  )
}

export default MisReservas
