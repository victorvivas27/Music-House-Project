import {
  DateCalendar,
  LocalizationProvider,
  PickersDay
} from '@mui/x-date-pickers'

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
  const id = instrument?.result.idInstrument

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
        setOpenSnackbar(true) 
      }
    }

    fetchAvailableDates()
  }, [id])

 
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  const handleDayClick = async (day) => {
    const formattedDay = day.format('YYYY-MM-DD')

    if (!id) return

    const isAlreadyAvailable = availableDates.includes(formattedDay)

    const newDate = {
      idInstrument: id,
      dateAvailable: formattedDay,
      available: !isAlreadyAvailable 
    }

    try {
      await addAvailableDates([newDate]) 

      setAvailableDates(
        (prevDates) =>
          isAlreadyAvailable
            ? prevDates.filter((date) => date !== formattedDay) 
            : [...prevDates, formattedDay] 
      )
    } catch (error) {
      const errorMessage =
        error?.message || 
        'Error inesperado. Intenta nuevamente.' 

      setError(errorMessage)
      setOpenSnackbar(true)
    }
  }

  
  const CustomDayComponent = (props) => {
    const { day, selected, ...other } = props
    const formattedDay = day.format('YYYY-MM-DD')
    const isAvailable = availableDates.includes(formattedDay)
    const today = dayjs() 
    const isPastDate = day.isBefore(today, 'day') 

    return (
      <PickersDay
        {...other}
        day={day}
        selected={selected}
        onClick={() => handleDayClick(day)}
        sx={{
          bgcolor: isPastDate
            ? 'var(--calendario-color-no-disponible) !important' 
            : isAvailable
              ? 'var( --color-exito) !important' 
              : 'var( --calendario-fondo-no-disponible)!important', 

          color: isPastDate
            ? '#7a7a7a !important' 
            : '#ffffff !important',

          borderRadius: '50%',
          opacity: isPastDate ? 0.6 : 1, 
          border: selected ? '3px solid var( --color-primario)' : 'none', 
          transition: 'all 0.3s ease' 
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
          backgroundColor: 'var(--background-color)',
          borderRadius: '8px',
          boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.1)'
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
            backgroundColor: 'var(--color-advertencia)', 
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
    result: PropTypes.shape({
      idInstrument: PropTypes.string.isRequired
    })
  })
}

export default MyCalendar
