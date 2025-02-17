import { styled } from '@mui/material/styles'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'

export const CustomDateCalendar = styled(DateCalendar)(({ theme }) => ({
  '& .MuiPickersArrowSwitcher-root': {
    display: 'none'
  },
  '& .MuiPickersCalendarHeader-switchViewButton': {
    display: 'none'
  }
}))
