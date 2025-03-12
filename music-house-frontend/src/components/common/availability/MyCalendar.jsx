import {
  DateCalendar,
  LocalizationProvider,
  PickersDay
} from '@mui/x-date-pickers'
import './Calendar.css'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useEffect, useState } from 'react'
import {
  addAvailableDates,
  getAllAvailableDatesByInstrument
} from '../../../api/availability'
import dayjs from 'dayjs'
import PropTypes from 'prop-types'
import { Alert, Box, Snackbar, Typography } from '@mui/material'

const MyCalendar = ({ instrument }) => {
  const [availableDates, setAvailableDates] = useState([])
  const [error, setError] = useState('')
  const [openSnackbar, setOpenSnackbar] = useState(false) // Estado para Snackbar
  const id = instrument?.data.idInstrument

  useEffect(() => {
    const fetchAvailableDates = async () => {
      if (!id) return
      try {
        const dates = await getAllAvailableDatesByInstrument(id)

        const filteredDates = dates
          .filter((item) => item.available)
          .map((item) => dayjs(item.dateAvailable).format('YYYY-MM-DD'))

        setAvailableDates(filteredDates)
      } catch (error) {
        setError('Error al obtener las fechas. Intenta nuevamente.')
        setOpenSnackbar(true) // Mostramos Snackbar al ocurrir un error
      }
    }

    fetchAvailableDates()
  }, [id])

  // Cerrar Snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  // Manejar el clic en un día
  const handleDayClick = async (day) => {
    const formattedDay = day.format('YYYY-MM-DD')

    if (!id) return

    // Verificamos si la fecha ya está en el estado
    const isAlreadyAvailable = availableDates.includes(formattedDay)

    // 📌 Creamos la estructura del objeto a enviar
    const newDate = {
      idInstrument: id,
      dateAvailable: formattedDay,
      available: !isAlreadyAvailable // 🔄 Cambia entre true/false
    }

    try {
      await addAvailableDates([newDate]) // Enviar al backend

      // Actualizar el estado local
      setAvailableDates(
        (prevDates) =>
          isAlreadyAvailable
            ? prevDates.filter((date) => date !== formattedDay) // Si estaba, lo quitamos
            : [...prevDates, formattedDay] // Si no estaba, lo agregamos
      )
    } catch (error) {
      const errorMessage =
        error?.message || // Intenta obtener el mensaje del backend
        'Error inesperado. Intenta nuevamente.' // Fallback

      setError(errorMessage)
      setOpenSnackbar(true)
    }
  }

  // Componente personalizado de días
  const CustomDayComponent = (props) => {
    const { day, selected, ...other } = props
    const formattedDay = day.format('YYYY-MM-DD')
    const isAvailable = availableDates.includes(formattedDay)
    const today = dayjs() // 🔥 Obtiene la fecha actual dinámica
    const isPastDate = day.isBefore(today, 'day') // 🔹 Verifica si la fecha ya pasó

    return (
      <PickersDay
        {...other}
        day={day}
        selected={selected}
        onClick={() => handleDayClick(day)}
        sx={{
          bgcolor: isPastDate
            ? 'var(--calendario-color-no-disponible) !important' // 🔹 Fechas pasadas (gris claro)
            : isAvailable
              ? 'var( --color-exito) !important' // 🔹 Fechas disponibles (verde llamativo)
              : 'var( --calendario-fondo-no-disponible)!important', // 🔹 Fechas futuras no disponibles (naranja)

          color: isPastDate
            ? '#7a7a7a !important' // 🔹 Texto gris oscuro en fechas pasadas
            : '#ffffff !important', // 🔹 Texto blanco en fechas disponibles/no disponibles

          borderRadius: '50%',
          opacity: isPastDate ? 0.6 : 1, // 🔹 Reduce opacidad en fechas pasadas
          border: selected ? '3px solid var( --color-primario)' : 'none', // 🔥 Borde amarillo si está seleccionada
          transition: 'all 0.3s ease' // 🔥 Agrega transición suave al cambio de color
        }}
      />
    )
  }

  CustomDayComponent.propTypes = {
    day: PropTypes.object.isRequired,
    selected: PropTypes.bool
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar slots={{ day: CustomDayComponent }} />

      {/* 🔥 Leyenda de colores */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.8rem',
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: '#f5f5f5', // Fondo sutil
          borderRadius: '8px',
          boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.1)' // Sombra ligera
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Leyenda del Calendario
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1rem'
          }}
        >
          {/* 🔹 Fechas Pasadas */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Box
              sx={{
                width: '20px',
                height: '20px',
                backgroundColor: 'var(--calendario-color-no-disponible)',
                borderRadius: '50%',
                border: '1px solid var(--calendario-color-no-disponible)'
              }}
            />
            <Typography variant="body2">Fechas pasadas</Typography>
          </Box>

          {/* 🟢 Fechas Disponibles */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Box
              sx={{
                width: '20px',
                height: '20px',
                backgroundColor:
                  'var( --calendario-fondo-no-disponible)!important',
                borderRadius: '50%',
                border:
                  '1px solid var( --calendario-fondo-no-disponible)!important'
              }}
            />
            <Typography variant="body2">
              Lista para ingresar a disponible
            </Typography>
          </Box>

          {/* 🔸 Fechas Seleccionadas como Disponibles */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Box
              sx={{
                width: '20px',
                height: '20px',
                backgroundColor: 'var( --color-exito) !important',
                borderRadius: '50%',
                border: '1px solid var( --color-exito) !important'
              }}
            />
            <Typography variant="body2">
              Instrumento marcado como disponible
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Snackbar para errores */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="warning"
          sx={{
            backgroundColor: 'var(--color-advertencia)', // Amarillo
            color: 'rgb(0, 0, 0)',
            fontWeight: 'bold',
            fontSize: '1rem',
            borderRadius: '8px'
          }}
        >
          {error}
        </Alert>
      </Snackbar>
    </LocalizationProvider>
  )
}

// Definimos los PropTypes
MyCalendar.propTypes = {
  instrument: PropTypes.shape({
    data: PropTypes.shape({
      idInstrument: PropTypes.string.isRequired
    })
  })
}

export default MyCalendar
