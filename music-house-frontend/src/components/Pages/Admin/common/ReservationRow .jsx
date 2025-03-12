import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import {
  Box,
  Checkbox,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material'
import dayjs from 'dayjs'
import PropTypes from 'prop-types'
import { useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'

export const ReservationRow = ({
  row,
  isItemSelected,
  handleClick,
  handleConfirmDelete,
  isOpen = false
}) => {
  const [open, setOpen] = useState(isOpen)

  return (
    <>
      <TableRow
        role="checkbox"
        aria-checked={isItemSelected}
        key={row.idReservation}
        selected={isItemSelected}
        onClick={(event) => handleClick(event, row.idReservation)}
        sx={{
          boxShadow:
            ' rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px',

          '&.Mui-selected': { backgroundColor: 'inherit' },
          '&.Mui-selected:hover': { backgroundColor: 'inherit' }
        }}
      >
        {/* ✅ Checkbox de selección */}
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            checked={isItemSelected}
            onChange={(event) => {
              event.stopPropagation() 
              handleClick(event, row.idReservation)
            }}
          />
        </TableCell>

        {/* ✅ Botón de expansión - Se evita que seleccione la fila */}
        <TableCell sx={{ display: { xs: 'table-cell', md: 'none' } }}>
          <IconButton
            aria-label="Expandir detalle"
            size="small"
            onClick={(event) => {
              event.stopPropagation() 
              setOpen(!open)
            }}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>

        {/* ✅ Imagen */}
        <TableCell>
          <img
            src={row.imageUrl}
            alt="Instrumento"
            width="100px"
            style={{
              mixBlendMode: 'multiply', 
              borderRadius: '8px',
              objectFit: 'contain',
              display: 'block',
              margin: 'auto'
            }}
          />
        </TableCell>

        {/* ✅ Instrumento (Solo en Desktop) */}
        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
          {row.instrumentName}
        </TableCell>

        <TableCell sx={{ display: 'none' }}>{row.idInstrument}</TableCell>

        {/* ✅ Fechas (Solo en Desktop) */}
        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
          {dayjs(row.startDate).format('DD-MM-YYYY')}
        </TableCell>
        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
          {dayjs(row.endDate).format('DD-MM-YYYY')}
        </TableCell>

        {/* ✅ Precio Total */}
        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
          $ {row.totalPrice}
        </TableCell>

        {/* ✅ Email */}
        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
          {row.email}
        </TableCell>

        {/* ✅ Icono de eliminar SOLO en la fila seleccionada */}
        {isItemSelected && (
          <TableCell align="center">
            <Tooltip title="Eliminar reserva">
              <IconButton
                onClick={(event) => {
                  event.stopPropagation()
                  handleConfirmDelete(row.idReservation)
                }}
                sx={{ color: 'red' }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </TableCell>
        )}
      </TableRow>

      {/* ✅ Fila colapsable (Solo en Móvil) */}
      <TableRow sx={{ display: { xs: 'table-row', md: 'none' } }}>
        <TableCell sx={{ padding: 0, width: '100%' }} colSpan={3}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ padding: 2 }}>
              <Typography variant="h6">
                <strong>Detalles</strong>
              </Typography>
              <Typography variant="body2">
                <strong>Instrumento:</strong> {row.instrumentName}
              </Typography>
              <Typography variant="body2">
                <strong>Inicio:</strong>{' '}
                {dayjs(row.startDate).format('DD-MM-YYYY')}
              </Typography>
              <Typography variant="body2">
                <strong>Entrega:</strong>{' '}
                {dayjs(row.endDate).format('DD-MM-YYYY')}
              </Typography>
              <Typography variant="body2">
                <strong>Precio Total:</strong> ${row.totalPrice}
              </Typography>
              <Typography variant="body2">
                <strong>Email:</strong> {row.email}
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

// ✅ Definición de PropTypes para ReservationRow
ReservationRow.propTypes = {
  row: PropTypes.shape({
    idReservation: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    instrumentName: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    totalPrice: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    idInstrument: PropTypes.string.isRequired
  }).isRequired,
  isItemSelected: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleConfirmDelete: PropTypes.func.isRequired,
  isOpen: PropTypes.bool
}
