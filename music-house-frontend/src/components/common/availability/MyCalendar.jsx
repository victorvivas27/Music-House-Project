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
import { Alert, Snackbar } from '@mui/material'

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
        "Error inesperado. Intenta nuevamente."; // Fallback
    
      setError(errorMessage);
      setOpenSnackbar(true);
    }
  }

  // Componente personalizado de días
  const CustomDayComponent = (props) => {
    const { day, selected, ...other } = props
    const formattedDay = day.format('YYYY-MM-DD')
    const isAvailable = availableDates.includes(formattedDay)

    return (
      <PickersDay
        {...other}
        day={day}
        selected={selected}
        onClick={() => handleDayClick(day)} // ⬅️ Manejamos el clic
        sx={{
          bgcolor: isAvailable
            ? 'var(--calendario-fondo-disponible) !important'
            : 'var(--calendario-fondo-no-disponible) !important',
          color: isAvailable
            ? 'var(--calendario-color-disponible) !important'
            : 'var(--calendario-color-no-disponible) !important',
          borderRadius: '50%'
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
      
      {/* Snackbar para mostrar errores */}
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
  <Alert
    onClose={handleCloseSnackbar}
    severity="warning" // Tipos: success | warning | info | error
    sx={{
      backgroundColor: '#FFC107', // Amarillo
      color: '#333', // Texto oscuro
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
