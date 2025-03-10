import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import {
  Box,
  Checkbox,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
  
  Typography
} from '@mui/material'
import dayjs from 'dayjs'
import PropTypes from 'prop-types'
import { useState } from 'react'


export const ReservationRow = ({
  row,
  isItemSelected,

  handleClick,
  
  isOpen = false
}) => {
  const [open, setOpen] = useState(isOpen)

  return (
    <>
     <TableRow
        hover
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={row.idReservation}
        selected={isItemSelected}
      
        onClick={(event) => handleClick(event, row.idReservation)}
      >
        {/* ✅ Checkbox de selección */}
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            checked={isItemSelected}
            onClick={(event) => event} // 🔹 Evita seleccionar la fila al hacer clic en el checkbox
          />
        </TableCell>

        {/* ✅ Botón de expansión - Se evita que seleccione la fila */}
        <TableCell sx={{ display: { xs: "table-cell", md: "none" } }}>
          <IconButton
            aria-label="Expandir detalle"
            size="small"
            onClick={(event) => {
              event.stopPropagation(); // 🔹 Evita que seleccione la fila
              setOpen(!open);
            }}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>

        <TableCell>
          <img src={row.imageUrl} alt="" width="100px" />
        </TableCell>
        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
          {row.instrumentName}
        </TableCell>
        <TableCell sx={{ display: 'none' }}>{row.idInstrument}</TableCell>
        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
          {dayjs(row.startDate).format('DD-MM-YYYY')}
        </TableCell>
        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
          {dayjs(row.endDate).format('DD-MM-YYYY')}
        </TableCell>
        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
          $ {row.totalPrice}
        </TableCell>
        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
          {row.email}
        </TableCell>
      </TableRow>
      <TableRow
        sx={{
          display: { xs: 'table-row', md: 'none' }
        }}
      >
        <TableCell
          sx={{ padding: 0, width: '100%' }}
          colSpan={3}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  display: 'inline-block',
                  
                  fontWeight: '300',
                  fontSize: '1rem',
                  width: '30%'
                }}
              >
                Instrumento:
              </Typography>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  display: 'inline-block',
                  textAlign: 'left',
                  fontWeight: '300',
                  fontSize: '0.9rem',
                  width: '70%',
                 
                }}
              >
                {row.instrumentName}
              </Typography>
            </Box>
            <Box sx={{ margin: 1 }}>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  display: 'inline-block',
                  textAlign: 'left',
                  fontWeight: '300',
                  fontSize: '1rem',
                  width: '35%'
                }}
              >
                Inicio:
              </Typography>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  display: 'inline-block',
                  textAlign: 'left',
                  fontWeight: '300',
                  fontSize: '1rem',
                  width: '35%',
                  padding: '.2rem 1rem .2rem 0'
                }}
              >
                {dayjs(row.startDate).format('DD-MM-YYYY')}
              </Typography>
            </Box>
            <Box sx={{ margin: 1 }}>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  display: 'inline-block',
                  textAlign: 'left',
                  fontWeight: '300',
                  fontSize: '1rem',
                  width: '35%',
                  padding: '.2rem 1rem .2rem 0'
                }}
              >
                Entrega:
              </Typography>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  display: 'inline-block',
                  textAlign: 'left',
                  fontWeight: '300',
                  fontSize: '1rem',
                  width: '35%',
                  padding: '.2rem 1rem .2rem 0'
                }}
              >
                {dayjs(row.endDate).format('DD-MM-YYYY')}
              </Typography>
            </Box>
            <Box sx={{ margin: 1 }}>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  display: 'inline-block',
                  textAlign: 'left',
                  fontWeight: '300',
                  fontSize: '1rem',
                  width: '35%',
                  padding: '.2rem 1rem .2rem 0'
                }}
              >
                Precio total:
              </Typography>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  display: 'inline-block',
                  textAlign: 'left',
                  fontWeight: '300',
                  fontSize: '1rem',
                  width: '35%',
                  padding: '.2rem 1rem .2rem 0'
                }}
              >
                {row.totalPrice}
              </Typography>
            </Box>
            <Box sx={{ margin: 1 }}>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  display: 'inline-block',
                  textAlign: 'left',
                  fontWeight: '300',
                  fontSize: '1rem',
                  width: '35%',
                  padding: '.2rem 1rem .2rem 0'
                }}
              >
                Mail:
              </Typography>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  display: 'inline-block',
                  textAlign: 'left',
                  fontWeight: '300',
                  fontSize: '1rem',
                  width: '35%',
                  padding: '.2rem 1rem .2rem 0'
                }}
              >
                {row.email}
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
  labelId: PropTypes.string.isRequired,
  isRowEven: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleConfirmDelete: PropTypes.func.isRequired,
  isOpen: PropTypes.bool
}
