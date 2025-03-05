import { useState, useEffect } from 'react'
import {
  Box,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import MainWrapper from '../common/MainWrapper'
import {
  EnhancedTableHead,
  getLabelDisplayedRows,
  isSelected,
  handleSort,
  handleSelected,
  getEmptyRows,
  useVisibleRows
} from '../Pages/Admin/common/tableHelper'
import { MessageDialog } from '../common/MessageDialog'
import { Loader } from '../common/loader/Loader'
import { useAuthContext } from '../utils/context/AuthGlobal'
import dayjs from 'dayjs'
import { deleteReservation, getReservationById } from '../../api/reservations'

const headCells = [
  
  {
    id: 'imageUrl',
    numeric: true,
    disablePadding: false,
    label: 'Imagen'
  },
  {
    id: 'instrumentName',
    numeric: true,
    disablePadding: false,
    label: 'Instrumento',
    sx: { display: { xs: 'none', md: 'table-cell' } }
  },

  {
    id: 'idInstrument',
    numeric: true,
    disablePadding: false,
    label: 'Instrumento',
    hidden: true
  },
  {
    id: 'startDate',
    numeric: false,
    Date: true,
    disablePadding: false,
    label: 'Inicio',
    sx: { display: { xs: 'none', md: 'table-cell' } }
  },
  {
    id: 'endDate',
    numeric: false,
    Date: true,
    disablePadding: false,
    label: 'Entrega',
    sx: { display: { xs: 'none', md: 'table-cell' } }
  },
  {
    id: 'totalPrice',
    numeric: true,
    disablePadding: false,
    label: 'Precio Total',
    sx: { display: { xs: 'none', md: 'table-cell' } }
  },
  {
    id: 'email',
    numeric: false,
    disablePadding: false,
    label: 'email',
    sx: { display: { xs: 'none', md: 'table-cell' } }
  },
  {
    id: 'actions',
    numeric: false,
    disablePadding: false,
    label: 'Acciones',
    sx: { display: { xs: 'none', md: 'table-cell' } }
  }
]

const ReservationRow = ({
  row,
  isItemSelected,
  labelId,
  isRowEven,
  handleClick,
  handleConfirmDelete,
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
        sx={{
          cursor: 'pointer',
          backgroundColor: isRowEven ? '#fbf194' : 'inherit'
        }}
        onClick={(event) => handleClick(event, row.idReservation)}
      >
        <TableCell
          padding="checkbox"
          sx={{ display: { xs: 'none', md: 'table-cell' } }}
        >
          <Checkbox
            color="primary"
            checked={isItemSelected}
            inputProps={{
              'aria-labelledby': labelId
            }}
          />
        </TableCell>
        <TableCell sx={{ display: { xs: 'table-cell', md: 'none' } }}>
          <IconButton
            aria-label="Expandir detalle"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
       
        <TableCell align="left">
          <img src={row.imageUrl} alt="" width="100px" />
        </TableCell>
        <TableCell
          align="left"
          sx={{ display: { xs: 'none', md: 'table-cell' } }}
        >
          {row.instrumentName}
        </TableCell>
        <TableCell sx={{ display: 'none' }} align="left">
          {row.idInstrument}
        </TableCell>
        <TableCell
          align="left"
          sx={{ display: { xs: 'none', md: 'table-cell' } }}
        >
          {dayjs(row.startDate).format('DD-MM-YYYY')}
        </TableCell>
        <TableCell
          align="left"
          sx={{ display: { xs: 'none', md: 'table-cell' } }}
        >
          {dayjs(row.endDate).format('DD-MM-YYYY')}
        </TableCell>
        <TableCell
          align="left"
          sx={{ display: { xs: 'none', md: 'table-cell' } }}
        >
          $ {row.totalPrice}
        </TableCell>
        <TableCell
          align="left"
          sx={{ display: { xs: 'none', md: 'table-cell' } }}
        >
          {row.email}
        </TableCell>
        <TableCell
          align="left"
          sx={{ display: { xs: 'none', md: 'table-cell' } }}
        >
          <Tooltip title="Eliminar">
            <IconButton onClick={handleConfirmDelete}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow
        sx={{
          paddingBottom: 0,
          paddingTop: 0,
          display: { xs: 'table-row', md: 'none' }
        }}
      >
        <TableCell
          sx={{ paddingBottom: 0, paddingTop: 0, backgroundColor: '#E4E4E4' }}
          colSpan={3}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
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
                Instrumento:
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
                  width: '35%',
                  padding: '.2rem 1rem .2rem 0'
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
            <Box sx={{ margin: 1 }}>
              <IconButton
                size="large"
                onClick={handleConfirmDelete}
                sx={{ width: '100%' }}
              >
                <DeleteIcon fontSize="large" color="black" />
              </IconButton>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

const MisReservas = () => {
  const [reservations, setReservations] = useState()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState('desc')
  const [orderBy, setOrderBy] = useState('idReservation')
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [showMessage, setShowMessage] = useState(false)
  const [message, setMessage] = useState()
  const [showCancelButton, setShowCancelButton] = useState(false)
  const [onButtonPressed, setOnButtonPressed] = useState()
  const { idUser } = useAuthContext()

  useEffect(() => {
    if (!idUser) return

    getReservations()
  }, [idUser])

  useEffect(() => {
    if (!reservations || reservations.length === 0) {
      setRows([]); // Asegura que rows se vacíe si no hay reservas
      setLoading(false);
      return;
    }
  
    setRows(reservations.data);
    setLoading(false);
  
    if (window) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [reservations]);

  const getReservations = () => {
    setLoading(true)
    getReservationById(idUser)
      .then((data) => {
        setReservations(data)
      })
      .catch(() => {
        
        setReservations([]) // Devolver array vacío si hay error
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleRequestSort = (event, property) => {
    handleSort(event, property, orderBy, order, setOrderBy, setOrder)
  }

  const handleClick = (event, id) => {
    handleSelected(event, id, selected, setSelected)
  }

  const handleConfirmDelete = () => {
    setMessage('¿Desea eliminar esta reserva?')
    setShowCancelButton(true)
    setOnButtonPressed(true)
    setShowMessage(true)
  }

  const handleClose = () => {
    setShowMessage(false)
    setSelected([])
  }

  const handleDelete = () => {
    setShowMessage(false); // Cerrar modal de confirmación
    const idReservation = selected[0];
    const reservation = rows.find((row) => row.idReservation === idReservation);
    if (!reservation) return;
  
    deleteReservation(reservation.idInstrument, idUser, idReservation)
      .then(() => {
        setMessage('Reserva eliminada exitosamente');
        setShowCancelButton(false);
        setOnButtonPressed(false);
  
        // Mostrar el mensaje de éxito SIN BOTÓN
        setShowMessage(true);
  
        // Cerrar el modal automáticamente después de 2 segundos
        setTimeout(() => {
          setShowMessage(false);
        }, 2000);
      })
      .catch(() => {
        setMessage('No fue posible eliminar la reserva.');
        setShowCancelButton(false);
        setOnButtonPressed(false);
  
        // Mostrar el mensaje de error CON botón para cerrarlo manualmente
        setShowMessage(true);
      })
      .finally(() => {
        setSelected([]);
        getReservations(); // Refrescar lista de reservas
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const emptyRows = getEmptyRows(page, rowsPerPage, rows)

  const visibleRows = useVisibleRows(rows, order, orderBy, page, rowsPerPage)

  if (loading) return <Loader title="Cargando reservas" />

  return (
    <MainWrapper sx={{ width: '100%', minHeight: '90vh' }}>
      <Paper
        sx={{
          width: '100%',
          mb: 2
        }}
      >
        <TableContainer>
          <Table
            sx={{ minWidth: { xs: '100%', md: 750 } }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              headCells={headCells}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows?.length}
              disableSelectAll
            />
            <TableBody>
              {visibleRows &&
                visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row.idUser, selected)
                  const labelId = `enhanced-table-checkbox-${index}`
                  const isRowEven = index % 2 === 0

                  return (
                    <ReservationRow
                      key={row.idReservation}
                      row={row}
                      isItemSelected={isItemSelected}
                      labelId={labelId}
                      isRowEven={isRowEven}
                      handleClick={handleClick}
                      handleConfirmDelete={handleConfirmDelete}
                      isOpen={index === 0}
                    />
                  )
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows
                  }}
                >
                  <TableCell colSpan={9} />
                </TableRow>
              )}
              {page === 0 && rows.length === 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows
                  }}
                >
                  <TableCell colSpan={9}>
                    <Typography align="center">
                      No se encontraron reservas
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelDisplayedRows={getLabelDisplayedRows}
          labelRowsPerPage="Filas por página"
        />
      </Paper>
      <MessageDialog
        title="Eliminar reserva"
        message={message}
        isOpen={showMessage}
        buttonText={showCancelButton ? "Ok" : null}
        onClose={handleClose}
        onButtonPressed={() =>
          onButtonPressed ? handleDelete() : handleClose()
        }
        showCancelButton={showCancelButton}
      />
    </MainWrapper>
  )
}

export default MisReservas
