import { styled, alpha } from '@mui/material/styles'
import { PickersDay } from '@mui/x-date-pickers/PickersDay'
import { Tooltip } from '@mui/material'

const CustomPickersDay = styled(PickersDay)(({ theme }) => ({
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.7)
  }
}))

export const AvailabiltyPickersDay = (props) => {
  const {
    day,
    disabled,
    outsideCurrentMonth,
    isFirstVisibleCell,
    isLastVisibleCell,
    today,
    onDaySelect
  } = props

  const handleSelectedDay = (day) => {
    if (typeof onDaySelect === 'function') onDaySelect(day)
  }

  return (
    <Tooltip title={!disabled && 'Disponible'}>
      <CustomPickersDay
        day={day}
        disabled={disabled}
        outsideCurrentMonth={outsideCurrentMonth}
        isFirstVisibleCell={isFirstVisibleCell}
        isLastVisibleCell={isLastVisibleCell}
        today={today}
        onDaySelect={handleSelectedDay}
      />
    </Tooltip>
  )
}
