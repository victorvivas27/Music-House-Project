import {
  Alert,
  Box,
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
import { CustomButton } from '../../Form/formUsuario/CustomComponents'
import Swal from 'sweetalert2'

const CalendarReserva = ({ instrument }) => {
  const [availableDates, setAvailableDates] = useState([])
  const [selectedDates, setSelectedDates] = useState([]) // Lista de fechas seleccionadas
  const [error, setError] = useState('')
  const [infoMessage, setInfoMessage] = useState('') // Para mensajes amigables

  const [openSnackbar, setOpenSnackbar] = useState(false)

  const [openSnackbarInfo, setOpenSnackbarInfo] = useState(false)
  const idInstrument = instrument?.data?.idInstrument
  const { idUser } = useAuthContext()
  const [reservedDates, setReservedDates] = useState([])
  const [loading, setLoading] = useState(false) // Estado para el loader
  const navigate = useNavigate()

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

      // ✅ Mostrar SweetAlert2 en lugar de setSuccess
      Swal.fire({
        title: '¡Reserva realizada!',
        text: `Tu reserva ha sido confirmada del ${startDate} al ${endDate}.`,
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 3000, // ⏳ Se cierra automáticamente en 3 segundos
        timerProgressBar: true
      })

      setSelectedDates([])
      setTimeout(() => {
        navigate('/reservations')
      }, 3100)
    } catch (error) {
      setError(error.message)
      setOpenSnackbar(true)
    } finally {
      setLoading(false) // Desactivar el loader al terminar
    }
  }

  // 👇 Modificación en `fetchReservedDates`
  const fetchReservedDates = async () => {
    try {
      const reservations = await getReservationById(idUser)

      // 🟢 Si no hay reservas, mostramos un mensaje amigable
      if (
        !reservations.data ||
        !Array.isArray(reservations.data) ||
        reservations.data.length === 0
      ) {
        setReservedDates([])
        setInfoMessage(
          '📅 ¡Aún no tienes reservas! No dudes en reservar este hermoso instrumento y disfruta de la música. 🎶'
        )
        setOpenSnackbarInfo(true)
        return
      }

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
      const { statusCode, message } = error

      if (statusCode === 404) {
        // 🟢 Si el error es 404, significa que simplemente no hay reservas, mostramos un mensaje amigable.
        setReservedDates([])
        setInfoMessage(
          '📅 ¡Aún no tienes reservas! No dudes en reservar este hermoso instrumento y disfruta de la música. 🎶'
        )
        setOpenSnackbarInfo(true)
      } else {
        // 🛑 Si el error es otro (500, 403, etc.), mostrar error real
        setError(`⚠️ Error ${statusCode}: ${message}`)
        setOpenSnackbar(true)
      }
    }
  }

  // Llamar al cargar el componente y después de una reserva exitosa
  useEffect(() => {
    if (idUser) fetchReservedDates()
  }, [idUser]) // Se ejecuta nuevamente si hay una reserva exitosa

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
    <LocalizationProvider dateAdapter={AdapterDayjs} >
      <Box
      sx={{
        width: '100%', // 📌 Asegura que no se desborde
        maxWidth: '100%', // 📌 Evita que se pase del contenedor en móviles
        mb: 3,
        display: 'flex',
        justifyContent: 'center', // 📌 Centra el contenido horizontalmente
        flexDirection:"column",
        alignItems: 'center',
        overflow: 'hidden', // 📌 Previene el desbordamiento en pantallas pequeñas
        border: '3px solid rgba(174, 23, 225, 0.2)', // 🎨 Borde más sutil
    
        minHeight: {
          xs: 'auto',
          sm: '70%',
          md: '75%',
          lg: '85%',
          xl: '95%',
        },
        minWidth: {
          xs: '90%', // 📌 En móviles, usa el 90% para evitar el desbordamiento
          sm: '400px',
          md: '550px',
          lg: '850px',
          xl: '90%',
        },
      }}
      >
 
  <DateCalendar slots={{ day: CustomDayComponent }} />


        {selectedDates.length > 0 && (
          <Tooltip title="Reservar">
            <CustomButton
              variant="contained"
              sx={{
                minWidth: '250px', // Asegura que el ancho no cambie

                minHeight: '50px', // Altura fija
                padding: '10px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
              onClick={handleConfirmReservation}
              disabled={loading}
            >
              {loading ? (
                <>
                  Cargando Reserva...
                  <CircularProgress
                    size={20}
                    sx={{ color: 'var(--color-azul)' }}
                  />
                </>
              ) : (
                'Reservar'
              )}
            </CustomButton>
          </Tooltip>
        )}

        {/* Snackbar para errores reales (API falló) */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={5000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity="error"
            sx={{
              backgroundColor: '#E57373', // 🔴 Rojo para errores reales
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '1rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {error}
          </Alert>
        </Snackbar>

        {/* Snackbar para mensaje amigable cuando no hay reservas */}
        <Snackbar
          open={openSnackbarInfo}
          autoHideDuration={5000}
          onClose={() => setOpenSnackbarInfo(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setOpenSnackbarInfo(false)}
            severity="info"
            sx={{
              backgroundColor: '#4A90E2', // 🔵 Azul para mensajes amigables
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '1rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {infoMessage}
          </Alert>
        </Snackbar>

       {/* Leyenda de colores mejor organizada */}
<Box
  sx={{
    width: '100%',
    maxWidth: {
      xs: '100%', // 📌 Ocupa todo el ancho en móviles
      sm: '70%',
      md: '80%',
      lg: '90%'
    },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    padding: '1rem',
    border: '3px solid rgba(0, 0, 0, 0.2)', // 🔹 Borde más sutil
    borderRadius: '12px', // 🔹 Bordes redondeados
    backgroundColor: '#f7f7f7', // 🔹 Fondo sutil
    boxShadow: '2px 4px 8px rgba(0,0,0,0.1)' // 🔹 Sombra ligera para efecto 3D
  }}
>
  <Typography
    variant="h6"
    sx={{
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#333',
      marginBottom: '0.5rem'
    }}
  >
    🗓️ Estado de Disponibilidad
  </Typography>

  {/* Contenedor de colores */}
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: {
        xs: '1fr 1fr', // 📌 En móviles, 2 columnas
        sm: '1fr 1fr 1fr 1fr' // 📌 En pantallas más grandes, 4 columnas
      },
      gap: 2,
      width: '100%',
      justifyContent: 'center'
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
          justifyContent: 'center',
          gap: 1,
          width: '100%',
          padding: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.7)', // 🔹 Fondo suave
          borderRadius: '8px', // 🔹 Bordes suaves
          boxShadow: '1px 2px 4px rgba(0,0,0,0.1)' // 🔹 Pequeña sombra
        }}
      >
        <Box
          sx={{
            width: 20,
            height: 20,
            bgcolor: color,
            borderRadius: '50%'
          }}
        />
        <Typography variant="body1" sx={{ fontSize: '0.9rem', color: '#333' }}>
          {label}
        </Typography>
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
