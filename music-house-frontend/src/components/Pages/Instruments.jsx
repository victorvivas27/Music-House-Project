import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Checkbox
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { useNavigate } from 'react-router-dom'
import { getInstruments, deleteInstrument } from '../../api/instruments'
import MainWrapper from '../common/MainWrapper'

import { Loader } from '../common/loader/Loader'
import {
  EnhancedTableHead,
  EnhancedTableToolbar,
  //getLabelDisplayedRows,
  isSelected,
  handleSort,
  handleSelectAll,
  handleSelected,
  getEmptyRows,
  useVisibleRows
} from './Admin/common/tableHelper'


import '../styles/instruments.styles.css'
import ArrowBack from '../utils/ArrowBack'
import Swal from 'sweetalert2'

const headCells = [
  {
    id: 'idInstrument',
    numeric: true,
    disablePadding: false,
    label: 'ID'
  },
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Nombre'
  },
  {
    id: 'actions',
    numeric: false,
    disablePadding: false,
    label: 'Acciones'
  }
]

export const Instruments = () => {
  const [instruments, setInstruments] = useState({ data: [] })
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('number')
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const navigate = useNavigate()

  useEffect(() => {
    getAllInstruments()
  }, [])

  useEffect(() => {
    setRows(instruments.data)
    setLoading(false)
  }, [instruments])

  const getAllInstruments = async () => {
    setLoading(true)
    try {
      const [fetchedInstruments] = await getInstruments()
      setInstruments(fetchedInstruments)
    } catch {
      setInstruments({ data: [] })
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => navigate('/agregarInstrumento')

  const handleSelectAllClick = (event) => handleSelectAll(event, rows, 'idInstrument', setSelected)

  const handleClick = (event, id) => handleSelected(event, id, selected, setSelected)

  const handleRequestSort = (event, property) => handleSort(event, property, orderBy, order, setOrderBy, setOrder)

  const handleEdit = (id) => navigate(`/editarInstrumento/${id}`)

  const handleConfirmDelete = async (idInstrument) => {
    const selectedId = idInstrument || selected[0]
    if (!selectedId) {
      Swal.fire({
        title: 'Error',
        text: 'No hay un instrumento seleccionado para eliminar.',
        icon: 'error',
        confirmButtonColor: '#d33'
      })
      return
    }

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
      handleDelete(selectedId)
    }
  }

  const handleDelete = async (idInstrument) => {
    try {
      await deleteInstrument(idInstrument)
      Swal.fire({
        title: '¡Eliminado!',
        text: 'El instrumento se eliminó correctamente.',
        icon: 'success',
        confirmButtonColor: '#3085d6'
      })
      setSelected([])
      getAllInstruments()
    } catch {
      Swal.fire({
        title: 'Error',
        text: 'No fue posible eliminar el instrumento.',
        icon: 'error',
        confirmButtonColor: '#d33'
      })
    }
  }

  const handleChangePage = (event, newPage) => setPage(newPage)

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const emptyRows = getEmptyRows(page, rowsPerPage, rows)
  const visibleRows = useVisibleRows(rows, order, orderBy, page, rowsPerPage)

  if (loading) return <Loader title="Cargando instrumentos" />

  return (
    <MainWrapper>
      <Paper sx={{ display: { xs: 'none', lg: 'initial' }, margin: 10, minWidth: 1700 }}>
        <ArrowBack />
        <EnhancedTableToolbar title="Instrumentos" titleAdd="Agregar instrumento" handleAdd={handleAdd} numSelected={selected.length} />
        <TableContainer >

          <Table aria-labelledby="tableTitle" size="medium" >

            <EnhancedTableHead
              headCells={headCells}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              disableSelectAll
             
            />

            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.idInstrument, selected)
                const labelId = `enhanced-table-checkbox-${index}`
                const isRowEven = index % 2 === 0

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.idInstrument}
                    selected={isItemSelected}
                    className={isRowEven ? 'table-row-even' : 'table-row-odd'}
                    sx={{ cursor: 'pointer'}}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        onChange={(event) => handleClick(event, row.idInstrument)}
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </TableCell>
                    
                    <TableCell component="th" id={labelId} scope="row" align="center">
                      {row.idInstrument}
                    </TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="left" className="actions-cell">
                      <Tooltip title="Editar">
                        <IconButton onClick={() => handleEdit(row.idInstrument)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton onClick={() => handleConfirmDelete(row.idInstrument)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={3} />
                </TableRow>
              )}
              {page === 0 && rows.length === 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={3}>
                    <Typography align="center">No se encontraron instrumentos</Typography>
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
          sx={{
            '& .MuiTablePagination-displayedRows': { display: 'none' },
            '& .MuiTablePagination-actions': { display: 'none' }
          }}
          labelRowsPerPage="Filas por página"
        />
      </Paper>
    </MainWrapper>
  )
}

export default Instruments
