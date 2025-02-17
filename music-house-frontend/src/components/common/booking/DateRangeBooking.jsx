import { useEffect, useState } from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePickerBooking } from './DatePickerBooking'
import { Box, Typography } from '@mui/material'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import dayjs from 'dayjs'
import { Code } from '../../../api/constants'
import { AvailabiltyPickersDay } from '../availability/AvailabiltyPickersDay'
import { isAvailableDate } from '../availability/availabilityHelper'
import { findInstrumentAvailability } from '../../../api/availability'
import { CustomPickersActionBar } from '../availability/CustomPickersActionBar'

dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

export const DateRangeBooking = ({
  id,
  setBookingDateFrom,
  setBookingDateTo,
  setIsValidBookingRange
}) => {
  const [startDate, setStartDate] = useState(dayjs().add(1, 'day'))
  const [endDate, setEndDate] = useState(dayjs().add(1, 'month').endOf('M'))
  const [dateFrom, setDateFrom] = useState()
  const [dateTo, setDateTo] = useState()
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

  useEffect(() => {
    if (typeof setIsValidBookingRange === 'function')
      setIsValidBookingRange(isValidDateRange())
  }, [dateFrom, dateTo])

  const handleAvailableDate = (day) => {
    return isAvailableDate(day, availableDates)
  }

  const handleDateFromChange = (day, context) => {
    if (context.validationError) return

    setDateFrom(day)

    if (day && typeof setBookingDateFrom === 'function') setBookingDateFrom(day)
    if (day && day.isSameOrAfter(dateTo)) {
      const dayTo = day.add(1, 'day')
      setDateTo(dayTo)
      if (typeof setBookingDateTo === 'function') setBookingDateTo(dayTo)
    }
  }

  const handleDateToChange = (day, context) => {
    if (context.validationError) return

    setDateTo(day)

    if (day && typeof setBookingDateTo === 'function') setBookingDateTo(day)
    if (day && day.isSameOrBefore(dateFrom)) {
      const dayFrom = day.subtract(1, 'day')
      setDateFrom(dayFrom)
      if (typeof setBookingDateFrom === 'function') setBookingDateFrom(dayFrom)
    }
  }

  const isValidDateRange = () => {
    if (!dateFrom || !dateTo) return false

    const range = []
    let go = true
    let day = dayjs(dateFrom)

    while (go) {
      if (day.isSameOrBefore(dateTo)) {
        range.push(dayjs(day).format('YYYY-MM-DD'))
        day = dayjs(day).add(1, 'day')
      } else {
        go = false
      }
    }

    const notValids = range.filter((day) => availableDates.indexOf(day) === -1)

    return notValids.length === 0
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Box
          sx={{ width: '100%', display: 'flex', flexDirection: 'row-reverse' }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
          >
            <Typography
              variant="caption"
              sx={{ position: 'absolute', top: 3, left: 15 }}
            >
              Inicio
            </Typography>
            <DatePickerBooking
              format="DD-MM-YYYY"
              shouldDisableDate={handleAvailableDate}
              slots={{
                day: AvailabiltyPickersDay,
                toolbar: null,
                actionBar: CustomPickersActionBar
              }}
              value={dateFrom}
              onChange={handleDateFromChange}
            />
          </Box>
        </Box>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
          >
            <Typography
              variant="caption"
              sx={{ position: 'absolute', top: 3, left: 15 }}
            >
              Entrega
            </Typography>
            <DatePickerBooking
              format="DD-MM-YYYY"
              shouldDisableDate={handleAvailableDate}
              slots={{
                day: AvailabiltyPickersDay,
                toolbar: null,
                actionBar: CustomPickersActionBar
              }}
              value={dateTo}
              onChange={handleDateToChange}
              left={false}
            />
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  )
}
