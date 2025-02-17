import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePickerFinder } from './DatePickerFinder'
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import { useState } from 'react'
import { CustomPickersActionBar } from '../availability/CustomPickersActionBar'

dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

export const DateRangeFinder = ({
  dateFrom,
  setFromDate,
  minFromDateDefault,
  dateTo,
  setToDate,
  minToDateDefault
}) => {
  const [minFromDate, setMinFromDate] = useState(minFromDateDefault)
  const [minToDate, setMinToDate] = useState(minToDateDefault)

  const handleFromDate = (value, context) => {
    if (context.validationError) return

    if (!dateTo || minToDate.isSameOrBefore(value)) {
      setMinToDate(value.add(1, 'day'))
    }
    if (dateTo && dateTo.isSameOrBefore(value)) {
      setToDate(value.add(1, 'day'))
    }
    if (typeof setFromDate === 'function') setFromDate(value)
  }

  const handleToDate = (value, context) => {
    if (context.validationError) return

    if (!minFromDate && minFromDate.isSameOrAfter(value))
      setMinFromDate(value.subtract(1, 'day'))
    if (typeof setToDate === 'function') setToDate(value)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePickerFinder
        defaultValue={dateFrom}
        minDate={minFromDate}
        onChange={handleFromDate}
        format="DD-MM-YYYY"
        value={dateFrom}
        slots={{
          toolbar: null,
          actionBar: CustomPickersActionBar
        }}
      />
      <DatePickerFinder
        defaultValue={dateTo}
        minDate={minToDate}
        onChange={handleToDate}
        format="DD-MM-YYYY"
        value={dateTo}
        slots={{
          toolbar: null,
          actionBar: CustomPickersActionBar
        }}
      />
    </LocalizationProvider>
  )
}
