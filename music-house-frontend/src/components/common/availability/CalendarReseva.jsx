import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  Tooltip,
  Typography
} from '@mui/material'
import {
  DateCalendar,
  LocalizationProvider,
  PickersDay
} from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { getAllAvailableDatesByInstrument } from '../../../api/availability'
import dayjs from 'dayjs'
import { useAuthContext } from '../../utils/context/AuthGlobal'
import {
  createReservation,
  getReservationById
} from '../../../api/reservations'
import { useNavigate } from 'react-router-dom'

const CalendarReserva = ({ instrument }) => {
  const [availableDates, setAvailableDates] = useState([])
  const [selectedDates, setSelectedDates] = useState([]) // Lista de fechas seleccionadas
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const idInstrument = instrument?.data?.idInstrument
  const { idUser } = useAuthContext()
  const [reservedDates, setReservedDates] = useState([])
  const [loading, setLoading] = useState(false) // Estado para el loader
  const navigate=useNavigate()

  useEffect(() => {
    const fetchAvailableDates = async () => {
      if (!idInstrument) return
      try {
        const dates = await getAllAvailableDatesByInstrument(idInstrument)
        const filteredDates = dates
          .filter((item) => item.available)
          .map((item) => dayjs(item.dateAvailable).format('YYYY-MM-DD'))

        setAvailableDates(filteredDates)
      } catch (error) {
        setError('Error al obtener las fechas. Intenta nuevamente.')
        setOpenSnackbar(true)
      }
    }

    fetchAvailableDates()
  }, [idInstrument])

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  const handleDateSelect = (date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD')

    if (!availableDates.includes(formattedDate)) {
      setError('Selecciona una fecha válida.')
      setOpenSnackbar(true)
      return
    }

    setSelectedDates((prevDates) => {
      const newDates = prevDates.includes(formattedDate)
        ? prevDates.filter((d) => d !== formattedDate) // Si ya está seleccionada, quitarla
        : [...prevDates, formattedDate] // Si no está, agregarla

      return newDates.sort() // Ordenar fechas seleccionadas
    })
  }

  const handleConfirmReservation = async () => {
    if (selectedDates.length === 0) {
      setError('Debes seleccionar al menos una fecha disponible.')
      setOpenSnackbar(true)
      return
    }
    setLoading(true) // Activar el loader
    const startDate = selectedDates[0] // Primera fecha seleccionada
    const endDate = selectedDates[selectedDates.length - 1] // Última fecha seleccionada

    try {
      await createReservation(idUser, idInstrument, startDate, endDate)
      setSuccess('Reserva realizada con éxito.')
      setSelectedDates([]) 
      navigate("/reservations")
    } catch (error) {
      setError(error.message)
    } finally {
      setOpenSnackbar(true)
      setLoading(false) // Desactivar el loader al terminar
    }
  }

  const fetchReservedDates = async () => {
    try {
      const reservations = await getReservationById(idUser)
      

      if (!reservations.data || !Array.isArray(reservations.data)) {
        
        return
      }

      // Filtramos solo las reservas del instrumento actual
      const instrumentReservations = reservations.data.filter(
        (res) => res.idInstrument === idInstrument
      )

      const bookedDates = instrumentReservations.flatMap((res) => {
        const start = dayjs(res.startDate)
        const end = dayjs(res.endDate)
        const range = []

        for (
          let d = start;
          d.isBefore(end) || d.isSame(end);
          d = d.add(1, 'day')
        ) {
          range.push(d.format('YYYY-MM-DD'))
        }

        return range
      })

      setReservedDates(bookedDates)
    } catch (error) {
      console.error('Error al obtener las reservas:', error)
    }
  }

  // Llamar al cargar el componente y después de una reserva exitosa
  useEffect(() => {
    if (idUser) fetchReservedDates()
  }, [idUser, success]) // Se ejecuta nuevamente si hay una reserva exitosa

  const CustomDayComponent = (props) => {
    const { day, ...other } = props
    const formattedDay = day.format('YYYY-MM-DD')
    const isAvailable = availableDates.includes(formattedDay)
    const isSelected = selectedDates.includes(formattedDay)
    const isReserved = reservedDates.includes(formattedDay) // Nueva validación

    return (
      <PickersDay
        {...other}
        day={day}
        onClick={() => !isReserved && handleDateSelect(day)}
        sx={{
          bgcolor: isReserved
            ? '#9E9E9E !important' // 🟠 Gris si la fecha está reservada
            : isSelected
              ? '#2196F3 !important' // 🔵 Azul si está seleccionada
              : isAvailable
                ? '#4CAF50 !important' // ✅ Verde si está disponible
                : '#E57373 !important', // ❌ Rojo si no está disponible
          color: '#fff !important',
          borderRadius: '50%',
          pointerEvents: isReserved ? 'none' : 'auto' // Deshabilitar clic en fechas reservadas
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 3,
          width: '100%',
          maxWidth: '600px',
          mx: 'auto'
        }}
      >
        {/* Calendario con ancho completo */}
        <Box sx={{ width: '100%', mb: 3 }}>
          <DateCalendar slots={{ day: CustomDayComponent }} />
        </Box>

        {selectedDates.length > 0 && (
  <Tooltip title="Reservar">
    <Button
      variant="contained"
      sx={{
        borderRadius: '1rem',
        padding: '1.3rem',
        maxHeight: '4.5rem',
        minWidth: '120px'
      }}
      onClick={handleConfirmReservation}
      disabled={loading} // Deshabilita el botón mientras carga
    >
      {loading ? (
        <CircularProgress size={24} sx={{ color: 'white' }} />
      ) : (
        <Typography textAlign="center" sx={{ fontWeight: 'bold' }} variant="h6">
          Reservar
        </Typography>
      )}
    </Button>
  </Tooltip>
)}

        {/* Snackbar de éxito/error */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={success ? 'success' : 'warning'}
            sx={{
              backgroundColor: success ? '#4CAF50' : '#FFC107',
              color: '#333',
              fontWeight: 'bold',
              fontSize: '1rem',
              borderRadius: '8px'
            }}
          >
            {success || error}
          </Alert>
        </Snackbar>

        {/* Leyenda de colores más organizada */}
        <Box sx={{ mt: 3, textAlign: 'center', width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 3,
              width: '100%'
            }}
          >
            {[
              { color: '#9E9E9E', label: 'Reservado' },
              { color: '#4CAF50', label: 'Disponible' },
              { color: '#E57373', label: 'No disponible' },
              { color: '#2196F3', label: 'Seleccionado' }
            ].map(({ color, label }) => (
              <Box
                key={label}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  minWidth: '50%'
                }}
              >
                <Box
                  sx={{
                    width: 25,
                    height: 25,
                    bgcolor: color,
                    borderRadius: '50%'
                  }}
                />
                <Typography variant="body1">{label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  )
}

CalendarReserva.propTypes = {
  instrument: PropTypes.shape({
    data: PropTypes.shape({
      idInstrument: PropTypes.string.isRequired
    })
  })
}

export default CalendarReserva
