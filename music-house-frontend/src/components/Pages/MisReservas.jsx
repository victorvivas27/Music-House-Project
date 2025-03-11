import { useState, useEffect, useCallback } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Paper,
  Typography
} from '@mui/material'

import MainWrapper from '../common/MainWrapper'

import {
  EnhancedTableHead,
 // getLabelDisplayedRows,
  isSelected,
  handleSort,
  handleSelected,
  getEmptyRows,
  useVisibleRows,
  handleSelectAll
} from '../Pages/Admin/common/tableHelper'

import { Loader } from '../common/loader/Loader'
import { useAuthContext } from '../utils/context/AuthGlobal'

import { deleteReservation, getReservationById } from '../../api/reservations'
import PropTypes from 'prop-types'
import { headCells } from '../utils/types/HeadCells'
import { ReservationRow } from './Admin/common/ReservationRow '
import Swal from 'sweetalert2'

const MisReservas = () => {
  const [reservations, setReservations] = useState([])
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState('desc')
  const [orderBy, setOrderBy] = useState('idReservation')
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const { idUser } = useAuthContext()

  const getReservations = useCallback(() => {
    setLoading(true)
    getReservationById(idUser)
      .then((data) => setReservations(data))
      .catch(() => setReservations([]))
      .finally(() => setLoading(false))
  }, [idUser])

  useEffect(() => {
    if (!idUser) return
    getReservations()
  }, [getReservations, idUser])

  useEffect(() => {
    if (!reservations || reservations.length === 0) {
      setRows([])
      setLoading(false)
      return
    }
    setRows(reservations.data)
    setLoading(false)
  }, [reservations])

  useEffect(() => {
    if (!idUser) return
    getReservations()
  }, [idUser, getReservations])

  const handleRequestSort = (event, property) => {
    handleSort(event, property, orderBy, order, setOrderBy, setOrder)
  }

  const handleClick = (event, id) => {
    handleSelected(event, id, selected, setSelected)
  }

  const handleSelectAllClick = (event) => {
    handleSelectAll(event, rows, 'idReservation', setSelected)
  }

  const handleConfirmDelete = () => {
    if (selected.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'No has seleccionado ninguna reserva para eliminar.'
      })
      return
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete()
      }
    })
  }

  const handleDelete = () => {
    const validReservations = selected
      .map((id) => rows.find((row) => row.idReservation === id))
      .filter((reservation) => reservation) // 🔹 Elimina `undefined`

    Promise.all(
      validReservations.map((reservation) =>
        deleteReservation(
          reservation.idInstrument,
          idUser,
          reservation.idReservation
        )
      )
    )
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Reservas eliminadas',
          text: 'Las reservas seleccionadas fueron eliminadas con éxito.',
          timer: 2000,
          showConfirmButton: false
        })
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No fue posible eliminar algunas reservas.'
        })
      })
      .finally(() => {
        setSelected([])
        getReservations()
      })
  }

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
    <MainWrapper sx={{ padding: 2 }}>
      <Paper
        sx={{
          width: '100%',
          mb: 2,
          padding: 2,
          borderRadius: '10px',
          boxShadow:
            'rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px'
        }}
      >
        <TableContainer>
          <Table sx={{ boxShadow: 'none', minWidth: { xs: '100%', md: 750 } }}>
            <EnhancedTableHead
              headCells={headCells}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows?.length}
              onSelectAllClick={handleSelectAllClick}
            />
            <TableBody>
              {visibleRows &&
                visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row.idReservation, selected)
                  const labelId = `enhanced-table-checkbox-${index}`
                  return (
                    <ReservationRow
                      key={row.idReservation}
                      row={row}
                      isItemSelected={isItemSelected}
                      labelId={labelId}
                      handleClick={handleClick}
                      handleConfirmDelete={handleConfirmDelete}
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
         //labelDisplayedRows={getLabelDisplayedRows}
          labelRowsPerPage="Filas por página"
        />
      </Paper>
    </MainWrapper>
  )
}

// ✅ Definición de PropTypes para MisReservas
MisReservas.propTypes = {
  idUser: PropTypes.string
}

export default MisReservas
