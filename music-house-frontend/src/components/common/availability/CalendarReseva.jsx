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
import { useCallback, useEffect, useState } from 'react'
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
import { flexColumnContainer } from '../../styles/styleglobal'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

const CalendarReserva = ({ instrument }) => {
  const [availableDates, setAvailableDates] = useState([])
  const [selectedDates, setSelectedDates] = useState([])
  const [error, setError] = useState('')
  const [infoMessage, setInfoMessage] = useState('')

  const [openSnackbar, setOpenSnackbar] = useState(false)

  const [openSnackbarInfo, setOpenSnackbarInfo] = useState(false)
  const idInstrument = instrument?.data?.idInstrument
  const { idUser } = useAuthContext()
  const [reservedDates, setReservedDates] = useState([])
  const [loading, setLoading] = useState(false)
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
        ? prevDates.filter((d) => d !== formattedDate)
        : [...prevDates, formattedDate]

      return newDates.sort()
    })
  }

  const handleConfirmReservation = async () => {
    if (selectedDates.length === 0) {
      setError('Debes seleccionar al menos una fecha disponible.')
      setOpenSnackbar(true)
      return
    }
    setLoading(true)

    const startDate = selectedDates[0]
    const endDate = selectedDates[selectedDates.length - 1]

    try {
      await createReservation(idUser, idInstrument, startDate, endDate)

      // ✅ Mostrar SweetAlert2
      Swal.fire({
        title: '¡Reserva realizada!',
        text: `Tu reserva ha sido confirmada del ${startDate} al ${endDate}.`,
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 2000,
        timerProgressBar: true
      })

      setSelectedDates([])
      setTimeout(() => {
        navigate('/reservations')
      }, 2500)
    } catch (error) {
      setError(error.message)
      setOpenSnackbar(true)
    } finally {
      setLoading(false)
    }
  }

  // 👇 Modificación en `fetchReservedDates`
  const fetchReservedDates = useCallback(async () => {
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
  }, [idInstrument, idUser])

  // Llamar al cargar el componente y después de una reserva exitosa
  useEffect(() => {
    if (idUser) fetchReservedDates()
  }, [fetchReservedDates, idUser])

  const CustomDayComponent = (props) => {
    const { day, ...other } = props
    const formattedDay = day.format('YYYY-MM-DD')
    const isAvailable = availableDates.includes(formattedDay)
    const isSelected = selectedDates.includes(formattedDay)
    const isReserved = reservedDates.includes(formattedDay)

    return (
      <PickersDay
        {...other}
        day={day}
        onClick={() => !isReserved && handleDateSelect(day)}
        sx={{
          bgcolor: isReserved
            ? 'var(--color-primario) !important' //  Si la fecha está reservada
            : isSelected
              ? 'var(--color-azul) !important' // 🔵 Azul si está seleccionada
              : isAvailable
                ? 'var(--color-exito) !important' // ✅ Verde si está disponible
                : 'var(--calendario-color-no-disponible) !important', // Si no está disponible
          color: 'var( --texto-inverso) !important',
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
          ...flexColumnContainer,

          minHeight: {
            xs: '90%',
            sm: '80%',
            md: '80%',
            lg: '85%',
            xl: '90%'
          },
          minWidth: {
            xs: '300px',
            sm: '400px',
            md: '500px',
            lg: '600px',
            xl: '800px'
          }
        }}
      >
        <DateCalendar slots={{ day: CustomDayComponent }} />

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
              backgroundColor: 'var(--color-error)',
              color: 'var(--texto-inverso)',
              fontWeight: 'bold',
              fontSize: '1rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center'
            }}
            icon={<ErrorOutlineIcon sx={{ color: 'var(--texto-inverso)' }} />}
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
              backgroundColor: 'var(--color-azul)',
              color: 'var( --texto-inverso) !important',
              fontWeight: 'bold',
              fontSize: '1rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center'
            }}
            icon={<ErrorOutlineIcon sx={{ color: 'var(--texto-inverso)' }} />}
          >
            {infoMessage}
          </Alert>
        </Snackbar>

        {/* Leyenda de colores mejor organizada */}
        <Box
          sx={{
            width: '100%',
            maxWidth: {
              xs: '100%',
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
            borderRadius: '12px',
            backgroundColor: 'var(--background-color)',
            boxShadow: '2px 4px 8px rgba(0,0,0,0.1)'
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
              {
                color: 'var(--calendario-color-no-disponible)',
                label: 'No Disponible'
              },
              {
                color: 'var(--color-primario)',
                label: 'Reservado Usuario Actual'
              },
              {
                color: 'var(--color-exito)',
                label: 'Disponible Para Alquilar'
              },
              {
                color: 'var(--color-azul)',
                label: 'Seleccionado'
              }
            ].map(({ color, label }) => (
              <Box
                key={label}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  width: '100%',
                  padding: '8px',
                  backgroundColor: 'var(--background-color)',
                  borderRadius: '8px',
                  boxShadow: '1px 2px 4px rgba(0,0,0,0.1)'
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
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: {
                      xs: '0.6rem',
                      sm: '0.7rem',
                      md: '0.8rem',
                      lg: '0.9rem',
                      xl: '1rem'
                    }
                  }}
                >
                  {label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
        {/*Button para reservar*/}
        <Box
          sx={{
            height: '50px',
            width: '270px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60px'
          }}
        >
          <Tooltip title="Reservar">
            <CustomButton
              variant="contained"
              onClick={handleConfirmReservation}
              disabled={loading}
              sx={{
                padding: '10px 100px',
                visibility: selectedDates.length > 0 ? 'visible' : 'hidden'
              }}
              className={
                selectedDates.length > 1 ? 'fade-in-up' : 'fade-out-soft'
              }
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
        </Box>
        {/*Fin button para reservar */}
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
