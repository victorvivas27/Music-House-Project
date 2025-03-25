import {
  Alert,
  Box,
  CircularProgress,
  Snackbar,
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
import {
  createReservation,
  getReservationById
} from '../../../api/reservations'
import { useNavigate } from 'react-router-dom'
import { CustomButton } from '../../Form/formUsuario/CustomComponents'
import { flexColumnContainer } from '../../styles/styleglobal'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import useAlert from '../../../hook/useAlert'
import { useAuth } from '../../../hook/useAuth'
import { getErrorMessage } from '../../../api/getErrorMessage'

const formatDate = (date) => dayjs(date).format('YYYY-MM-DD')

const CalendarReserva = ({ instrument }) => {
  const [availableDates, setAvailableDates] = useState([])
  const [selectedDates, setSelectedDates] = useState([])
  const [reservedDates, setReservedDates] = useState([])
  const [error, setError] = useState('')
  const [infoMessage, setInfoMessage] = useState('')
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [openSnackbarInfo, setOpenSnackbarInfo] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isInstrumentReserved, setIsInstrumentReserved] = useState(false)
  const idInstrument = instrument?.result?.idInstrument
  const { idUser } = useAuth()
  const navigate = useNavigate()
  const { showSuccess } = useAlert()

  useEffect(() => {
    const fetchAvailableDates = async () => {
      if (!idInstrument) return
      try {
        const dates = await getAllAvailableDatesByInstrument(idInstrument)

        const filteredDates = dates.result
          .filter((item) => item.available)
          .map((item) => formatDate(item.dateAvailable))

        setAvailableDates(filteredDates)
      } catch (error) {
        setError(`❌ ${getErrorMessage(error)}`)
        setOpenSnackbar(true)
      }
    }

    fetchAvailableDates()
  }, [idInstrument])

  const handleDateSelect = (date) => {
    const formattedDate = formatDate(date)

    if (!availableDates.includes(formattedDate)) {
      const isPast = dayjs(formattedDate).isBefore(dayjs(), 'day')

      setError(
        isPast
          ? '❌ No se puede seleccionar una fecha pasada.'
          : '❌ El instrumento no está habilitado para esa fecha.'
      )
      setOpenSnackbar(true)
      return
    }

    setSelectedDates((prevDates) => {
      const newDates = prevDates.includes(formattedDate)
        ? prevDates.filter((d) => d !== formattedDate)
        : [...prevDates, formattedDate]

      return newDates.sort((a, b) => dayjs(a).unix() - dayjs(b).unix())
    })
  }

  const handleConfirmReservation = async () => {
    if (selectedDates.length === 0) {
      setError(`❌ Selecciona al menos una fecha para reservar`)
      setOpenSnackbar(true)
      return
    }

    setLoading(true)

    const startDate = selectedDates[0]
    const endDate = selectedDates[selectedDates.length - 1]

    try {
      await createReservation(idUser, idInstrument, startDate, endDate)

      showSuccess(
        '¡Reserva realizada!',
        `Tu reserva ha sido confirmada del ${startDate} al ${endDate}.`
      )
      setSelectedDates([])
      setTimeout(() => {
        navigate('/')
      }, 2500)
    } catch (error) {
      setError(`❌ ${getErrorMessage(error)}`)
      setOpenSnackbar(true)
    } finally {
      setLoading(false)
    }
  }

  const fetchReservedDates = useCallback(async () => {
    try {
      const reservations = await getReservationById(idUser)

      if (
        !reservations.result ||
        !Array.isArray(reservations.result) ||
        reservations.result.length === 0
      ) {
        setReservedDates([])
        return
      }

      const instrumentReservations = reservations.result.filter(
        (res) => res.idInstrument === idInstrument
      )

      if (instrumentReservations.length > 0) {
        setIsInstrumentReserved(true)
      }

      const bookedDates = instrumentReservations.flatMap((res) => {
        const start = dayjs(res.startDate)
        const end = dayjs(res.endDate)
        const range = []

        for (
          let d = start;
          d.isSame(end) || d.isBefore(end);
          d = d.add(1, 'day')
        ) {
          range.push(formatDate(d))
        }

        return range
      })

      setReservedDates(bookedDates)
    } catch (error) {
      const statusCode = error?.statusCode
      if (statusCode === 404) {
        setReservedDates([])
        setInfoMessage(
          '📅 ¡Aún no tienes reservas! No dudes en reservar este hermoso instrumento. 🎶'
        )
        setOpenSnackbarInfo(true)
      }
    }
  }, [idInstrument, idUser])

  useEffect(() => {
    if (idUser) fetchReservedDates()
  }, [fetchReservedDates, idUser])

  useEffect(() => {
    if (isInstrumentReserved) {
      setInfoMessage('Este instrumento ya tiene una reserva activa.')
      setOpenSnackbarInfo(true)
    }
  }, [isInstrumentReserved])

  const CustomDayComponent = (props) => {
    const { day, ...other } = props
    const formattedDay = formatDate(day)
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
            ? 'var(--color-primario) !important'
            : isSelected
              ? 'var(--color-azul) !important'
              : isAvailable
                ? 'var(--color-exito) !important'
                : 'var(--calendario-color-no-disponible) !important',
          color: 'var(--texto-inverso) !important',
          borderRadius: '50%',
          pointerEvents: isReserved ? 'none' : 'auto',
          cursor: isReserved ? 'not-allowed' : 'pointer'
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
          minHeight: '90%',
          minWidth: '300px'
        }}
      >
        <DateCalendar
          slots={{
            day: CustomDayComponent
          }}
          sx={{
            boxShadow: 'var(--box-shadow)',
            borderRadius: 5
          }}
        />

        <Box
          sx={{
            visibility:
              selectedDates.length > 0 && !isInstrumentReserved
                ? 'visible'
                : 'hidden',
            mt: 3,
            p: 2,
            backgroundColor: 'var(--color-exito)',
            borderRadius: 2,
            boxShadow: 'var(--box-shadow)',
            color: 'var(--texto-inverso)',
            textAlign: 'center',
            border: '1px solid red',
            width: '30%',
            height: '100%'
          }}
          className={selectedDates.length > 0 ? 'fade-in-up' : 'fade-out-soft'}
        >
          <Typography
            variant="body1"
            sx={{
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1
            }}
          >
            📅 Fechas seleccionadas:
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              fontSize: { xs: '0.85rem', sm: '0.9rem' },
              wordWrap: 'break-word'
            }}
          >
            {selectedDates.join(' • ')}
          </Typography>
        </Box>

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
          <CustomButton
            variant="contained"
            onClick={handleConfirmReservation}
            disabled={loading}
            sx={{
              visibility:
                selectedDates.length > 0 && !isInstrumentReserved
                  ? 'visible'
                  : 'hidden',
              boxShadow: 'var(--box-shadow)'
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
                  sx={{ color: 'var(--color-azul)', ml: 1 }}
                />
              </>
            ) : (
              'Reservar'
            )}
          </CustomButton>
        </Box>

        {/* Snackbar para errores reales */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={2500}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity="error"
            sx={{
              backgroundColor: 'var(--color-error)',
              color: 'var(--texto-inverso)',
              fontWeight: 'bold',
              fontSize: '1rem',
              borderRadius: '8px'
            }}
            icon={<ErrorOutlineIcon sx={{ color: 'var(--texto-inverso)' }} />}
          >
            {error}
          </Alert>
        </Snackbar>

        {/* Snackbar para mensajes informativos */}
        <Snackbar
          open={openSnackbarInfo}
          autoHideDuration={3500}
          onClose={() => setOpenSnackbarInfo(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setOpenSnackbarInfo(false)}
            severity="info"
            sx={{
              backgroundColor: 'var(--color-azul)',
              color: 'var(--texto-inverso)',
              fontWeight: 'bold',
              fontSize: '1rem',
              borderRadius: '8px'
            }}
            icon={<ErrorOutlineIcon sx={{ color: 'var(--texto-inverso)' }} />}
          >
            {infoMessage}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  )
}

CalendarReserva.propTypes = {
  instrument: PropTypes.shape({
    result: PropTypes.shape({
      idInstrument: PropTypes.string.isRequired
    })
  })
}

export default CalendarReserva
