import { useState, useEffect, useCallback } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Paper,
  Typography,
  Checkbox,
  Box,
  Tooltip,
  IconButton
} from '@mui/material'

import MainWrapper from '../common/MainWrapper'
import DeleteIcon from '@mui/icons-material/Delete'

import {
  EnhancedTableHead,
  isSelected,
  handleSort,
  handleSelected,
  getEmptyRows,
  useVisibleRows,
  handleSelectAll,
  EnhancedTableToolbar
} from '../Pages/Admin/common/tableHelper'

import { Loader } from '../common/loader/Loader'

import { deleteReservation, getReservationById } from '../../api/reservations'
import PropTypes from 'prop-types'
import { headCellsReservas } from '../utils/types/HeadCells'

import ArrowBack from '../utils/ArrowBack'
import useAlert from '../../hook/useAlert'
import { paginationStyles } from '../styles/styleglobal'
import { useAuth } from '../../hook/useAuth'
import { getErrorMessage } from '../../api/getErrorMessage'

const MisReservas = () => {
  const [reservations, setReservations] = useState({ result: [] })
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState('desc')
  const [orderBy, setOrderBy] = useState('idReservation')
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const { idUser } = useAuth()
  const { showConfirm, showLoading, showSuccess, showError } = useAlert()

  const getAllReservations = useCallback(async () => {
    setLoading(true)
    try {
      const fetchedReservas = await getReservationById(idUser)

      setReservations(fetchedReservas)
      setRows(fetchedReservas.result || [])
    } catch {
      setReservations({ result: [] })
    } finally {
      setTimeout(() => setLoading(false), 500)
    }
  }, [idUser])

  useEffect(() => {
    setRows(reservations.result)

    setLoading(false)
  }, [reservations])

  useEffect(() => {
    getAllReservations()
  }, [getAllReservations])

  const handleSelectAllClick = (event) => {
    handleSelectAll(event, rows, 'idReservation', setSelected)
  }

  const handleClick = (event, id) => {
    handleSelected(event, id, selected, setSelected)
  }

  const handleRequestSort = (event, property) => {
    handleSort(event, property, orderBy, order, setOrderBy, setOrder)
  }

  const handleConfirmDelete = async (idReservation = null) => {
    const selectedIds = idReservation ? [idReservation] : selected

    if (selectedIds.length === 0) {
      showError('Error', 'No hay reservas seleccionados para eliminar.')
      return
    }

    // Mostrar el modal de confirmación
    const isConfirmed = await showConfirm({
      title: `¿Eliminar ${selectedIds.length} reserva(s)?`,
      text: 'Esta acción no se puede deshacer.'
    })
    if (!isConfirmed) return

    showLoading('Eliminando...', 'Por favor espera.')
    try {
      await Promise.all(
        selectedIds.map((id) => {
          const reserva = rows.find((row) => row.idReservation === id)
          return deleteReservation(
            reserva.idInstrument,
            reserva.idUser,
            reserva.idReservation
          )
        })
      )
      showSuccess(
        '¡Eliminado(s)!',
        `${selectedIds.length} reserva(s) eliminada(s) correctamente.`
      )
      setSelected([])
      getAllReservations()
    } catch (error) {
      showError(`❌ ${getErrorMessage(error)}`)
    }
  }

  const emptyRows = getEmptyRows(page, rowsPerPage, rows)
  const visibleRows = useVisibleRows(rows, order, orderBy, page, rowsPerPage)

  if (loading) return <Loader title="Cargando reservas" />

  return (
    <>
      {!loading && (
        <MainWrapper sx={{ padding: 2 }}>
          <Paper
            sx={{
              display: { xs: 'none', lg: 'initial' },
              width: '90%',
              margin: 'auto',
              boxShadow: 'var(--box-shadow)',
              borderRadius: 4
            }}
          >
            <ArrowBack />

            <EnhancedTableToolbar
              title="Reservas"
              numSelected={selected.length}
              handleConfirmDelete={() => handleConfirmDelete()}
            />

            <TableContainer>
              <Table aria-labelledby="tableTitle" size="medium">
                <EnhancedTableHead
                  headCells={headCellsReservas}
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  rowCount={rows?.length}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {visibleRows.map((row, index) => {
                    const isItemSelected = isSelected(
                      row.idReservation,
                      selected
                    )
                    const labelId = `enhanced-table-checkbox-${index}`
                    const isRowEven = index % 2 === 0

                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.idReservation}
                        selected={isItemSelected}
                        className={
                          isRowEven ? 'table-row-even' : 'table-row-odd'
                        }
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            onChange={(event) =>
                              handleClick(event, row.idReservation)
                            }
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                        </TableCell>

                        <TableCell align="left">
                          <img
                            src={row.imageUrl}
                            alt="Instrumento"
                            width="80"
                          />
                        </TableCell>
                        <TableCell align="left">{row.instrumentName}</TableCell>
                        <TableCell align="left">{row.startDate} </TableCell>
                        <TableCell align="left">{row.endDate}</TableCell>
                        <TableCell align="left">${row.totalPrice}</TableCell>
                        <TableCell align="left">${row.email}</TableCell>
                        <TableCell align="left">
                          <Box
                            style={{
                              opacity: selected.length > 0 ? 0 : 1,
                              pointerEvents:
                                selected.length > 0 ? 'none' : 'auto',
                              transition: 'opacity 0.5s ease-in-out'
                            }}
                          >
                            <Tooltip title="Eliminar">
                              <IconButton
                                onClick={() =>
                                  handleConfirmDelete(row.idReservation)
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: 53 * emptyRows
                      }}
                    >
                      <TableCell colSpan={3} />
                    </TableRow>
                  )}
                  {page === 0 && rows.length === 0 && (
                    <TableRow
                      style={{
                        height: 53 * emptyRows
                      }}
                    >
                      <TableCell colSpan={7}>
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
              rowsPerPageOptions={[
                5,
                10,
                25,
                { label: 'Todos', value: rows.length }
              ]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={Math.min(
                page,
                Math.max(0, Math.ceil(rows.length / rowsPerPage) - 1)
              )} // Evita errores cuando cambia la cantidad de filas
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10))
                setPage(0) // Reinicia la paginación al cambiar el número de filas
              }}
              labelRowsPerPage="Filas por página"
              sx={{
                ...paginationStyles
              }}
            />
          </Paper>
        </MainWrapper>
      )}
    </>
  )
}

// ✅ Definición de PropTypes para MisReservas
MisReservas.propTypes = {
  idUser: PropTypes.string
}

export default MisReservas
