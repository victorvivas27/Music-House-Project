import { useState, useEffect } from 'react'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { AvailabiltyPickersDay } from './AvailabiltyPickersDay'
import { isAvailableDate } from './availabilityHelper'
import { Code } from '../../../api/constants'
import {
  findInstrumentAvailability,
  addAvailableDates
} from '../../../api/availability'
import { Box } from '@mui/material'
import { CustomLocalizationProvider } from './CustomLocalizationProvider'
import { CustomDateCalendar } from './CustomDateCalendar'
import PropTypes from 'prop-types'

export const InstrumentAvailability = ({ id }) => {
  const startDate = dayjs()
  const endDate = dayjs().add(1, 'month').endOf('M')
  const [availableDates, setAvailableDates] = useState([])
  const [data, code] = findInstrumentAvailability(
    id,
    dayjs(startDate).format('YYYY-MM-DD'),
    dayjs(endDate).format('YYYY-MM-DD')
  )

  useEffect(() => {
    if (code === Code.SUCCESS) {
      const dates = data.data.map((date) => date.dateAvailable)
      setAvailableDates(dates)
    } else if (code === Code.NOT_FOUND) {
      setAvailableDates([])
    }
  }, [data, code])
  const handleDateClick = async (day) => {
    const formattedDate = day.format('YYYY-MM-DD')
    const isAvailable = availableDates.includes(formattedDate)

    try {
      await addAvailableDates([
        {
          // Enviamos un array con un solo objeto
          idInstrument: id,
          dateAvailable: formattedDate,
          available: !isAvailable
        }
      ])

      // Actualizamos el estado local
      if (isAvailable) {
        setAvailableDates(
          availableDates.filter((date) => date !== formattedDate)
        )
      } else {
        setAvailableDates([...availableDates, formattedDate])
      }
    } catch (error) {
      console.error('Error actualizando la fecha:', error)
    }
  }

  return (
    <>
      {availableDates && (
        <CustomLocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}
          >
            <CustomDateCalendar
              value={startDate}
              onChange={handleDateClick}
              slots={{
                day: (props) => (
                  <AvailabiltyPickersDay
                    {...props}
                    availableDates={availableDates}
                    onDayClick={handleDateClick}
                  />
                )
              }}
            />

            <CustomDateCalendar
              value={endDate}
              shouldDisableDate={(day) => isAvailableDate(day, availableDates)}
              onChange={handleDateClick}
              slots={{
                day: (props) => (
                  <AvailabiltyPickersDay
                    {...props}
                    availableDates={availableDates}
                    onDayClick={handleDateClick}
                  />
                )
              }}
            />
          </Box>
        </CustomLocalizationProvider>
      )}
    </>
  )
}
InstrumentAvailability.propTypes = {
  id: PropTypes.string.isRequired // El ID del instrumento es obligatorio y debe ser una cadena
}
