import { useState, useEffect } from 'react'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { AvailabiltyPickersDay } from './AvailabiltyPickersDay'
import { isAvailableDate } from './availabilityHelper'
import { Code } from '../../../api/constants'
import { findInstrumentAvailability } from '../../../api/availability'
import { Box } from '@mui/material'
import { CustomLocalizationProvider } from './CustomLocalizationProvider'
import { CustomDateCalendar } from './CustomDateCalendar'

export const InstrumentAvailability = ({ id }) => {
  const [startDate, setStartDate] = useState(dayjs().add(1, 'day'))
  const [endDate, setEndDate] = useState(dayjs().add(1, 'month').endOf('M'))
  const [availableDates, setAvailableDates] = useState()
  const [data, code] = findInstrumentAvailability(
    id,
    dayjs(startDate).format('YYYY-MM-DD'),
    dayjs(endDate).format('YYYY-MM-DD')
  )

  useEffect(() => {
    if (code === Code.SUCCESS) {
      const availableDates = data.data.map((date) => date.dateAvailable)
      setAvailableDates(availableDates)
    } else if (code === Code.NOT_FOUND) {
      setAvailableDates([])
    }
  }, [data, code])

  const handleAvailableDate = (day) => {
    return isAvailableDate(day, availableDates)
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
              shouldDisableDate={handleAvailableDate}
              slots={{
                day: AvailabiltyPickersDay
              }}
              readOnly
            />
            <CustomDateCalendar
              value={endDate}
              shouldDisableDate={handleAvailableDate}
              slots={{
                day: AvailabiltyPickersDay
              }}
              readOnly
            />
          </Box>
        </CustomLocalizationProvider>
      )}
    </>
  )
}
