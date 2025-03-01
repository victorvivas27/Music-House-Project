import { styled } from '@mui/material/styles'
import { PickersDay } from '@mui/x-date-pickers/PickersDay'
import { Tooltip } from '@mui/material'
import dayjs from 'dayjs'
import PropTypes from 'prop-types'

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== 'isAvailable' // Evita que isAvailable se pase al DOM
})(({ isAvailable }) => ({
  backgroundColor: isAvailable ? 'yellow' : 'red', // Amarillo si disponible, rojo si no
  color: isAvailable ? 'black' : 'white', // Texto negro en amarillo, blanco en rojo
  borderRadius: '50%', // Mantener estilo circular
  transition: 'none', // Evita cualquier animación

  '&:hover, &:focus, &:active': {
    backgroundColor: isAvailable ? 'yellow' : 'red',
    opacity: 1 // Evita transparencias
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
    onDaySelect,
    availableDates
  } = props

  const handleSelectedDay = (day) => {
    if (typeof onDaySelect === 'function') onDaySelect(day)
  }
  const formattedDate = dayjs(day).format('YYYY-MM-DD')
  const isAvailable = availableDates.includes(formattedDate)
  const tooltipText = isAvailable ? 'Disponible' : 'No disponible' // 🔹 Texto según disponibilidad
  return (
    <Tooltip title={tooltipText}>
      <span>
        <CustomPickersDay
          day={day}
          disabled={disabled}
          outsideCurrentMonth={outsideCurrentMonth}
          isFirstVisibleCell={isFirstVisibleCell}
          isLastVisibleCell={isLastVisibleCell}
          today={today}
          onDaySelect={handleSelectedDay}
          isAvailable={isAvailable}
        />
      </span>
    </Tooltip>
  )
}
AvailabiltyPickersDay.propTypes = {
  day: PropTypes.object.isRequired, // Debe ser un objeto (instancia de dayjs)
  disabled: PropTypes.bool, // Puede ser true o false
  outsideCurrentMonth: PropTypes.bool, // Indica si está fuera del mes actual
  isFirstVisibleCell: PropTypes.bool, // Indica si es la primera celda visible
  isLastVisibleCell: PropTypes.bool, // Indica si es la última celda visible
  today: PropTypes.bool, // Indica si es el día actual
  onDaySelect: PropTypes.func, // Función para seleccionar un día
  availableDates: PropTypes.arrayOf(PropTypes.string).isRequired // Lista de fechas disponibles en formato 'YYYY-MM-DD'
}
