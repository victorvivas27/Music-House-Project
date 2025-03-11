import { useState, useEffect } from 'react'
import {
  Box,
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
import { getTheme, deleteTheme } from '../../../api/theme'
import MainWrapper from '../../common/MainWrapper'
import { MessageDialog } from '../../common/MessageDialog'
import { Loader } from '../../common/loader/Loader'
import {
  EnhancedTableHead,
  EnhancedTableToolbar,
 // getLabelDisplayedRows,
  isSelected,
  handleSort,
  handleSelectAll,
  handleSelected,
  getEmptyRows,
  useVisibleRows
} from '../Admin/common/tableHelper'
import { useAppStates } from '../../utils/global.context'

const headCells = [
  {
    id: 'idTheme',
    numeric: true,
    disablePadding: false,
    label: 'ID'
  },
  {
    id: 'themeName',
    numeric: false,
    disablePadding: false,
    label: 'Nombre'
  },
  {
    id: 'description',
    numeric: false,
    disablePadding: false,
    label: 'Descripción'
  },
  {
    id: 'actions',
    numeric: false,
    disablePadding: false,
    label: 'Acciones'
  }
]

export const Theme = () => {
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState()
  const [rows, setRows] = useState([])
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('number')
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [showMessage, setShowMessage] = useState(false)
  const [message, setMessage] = useState()
  const [showCancelButton, setShowCancelButton] = useState(false)
  const [onButtonPressed, setOnButtonPressed] = useState()
  const { state } = useAppStates()
  const { themeCreated } = state
  const navigate = useNavigate()

  useEffect(() => {
    getAllTheme()
  }, [])

  const getAllTheme = () => {
    setLoading(true)
    getTheme()
      .then(([theme]) => {
        setTheme(theme)
      })
      .catch(() => {
        setTheme([])
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (state.categoryCreated) {
      getAllTheme()
    }
  }, [state.categoryCreated, themeCreated])

  useEffect(() => {
    if (!theme) return

    setRows(theme.data)
  }, [theme])

  const handleAdd = () => {
    navigate('/agregarTheme')
  }

  const handleSelectAllClick = (event) => {
    handleSelectAll(event, rows, 'idTheme', setSelected)
  }

  const handleClick = (event, id) => {
    handleSelected(event, id, selected, setSelected)
  }

  const handleRequestSort = (event, property) => {
    handleSort(event, property, orderBy, order, setOrderBy, setOrder)
  }

  const handleEdit = (id) => {
    navigate(`/editarTheme/${id}`)
  }

  const handleConfirmDelete = () => {
    setMessage('¿Desea eliminar esta Tematica?')
    setShowCancelButton(true)
    setOnButtonPressed(true)
    setShowMessage(true)
  }

  const handleDelete = () => {
    const idTheme = selected[0]
    deleteTheme(idTheme)
      .then(() => {
        getAllTheme()
      })
      .catch(() => {
        setMessage(
          'No fue posible eliminar la Tematica. Por favor, vuelva a intentarlo'
        )
        setShowCancelButton(false)
        setOnButtonPressed(false)
      })
      .finally(() => {
        setShowMessage(false)
        setSelected([])
      })
  }

  const handleClose = () => {
    setShowMessage(false)
    setSelected([])
  }

  const handleChangePage = (newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = getEmptyRows(page, rowsPerPage, rows)

  const visibleRows = useVisibleRows(rows, order, orderBy, page, rowsPerPage)

  if (loading) return <Loader title="Cargando tematica" />

  return (
    <MainWrapper>
      <Paper
        sx={{
          display: { xs: 'none', lg: 'initial' },
          width: '100%',
          mb: 2,
          maxWidth: 1200,
          minHeight: '50vh'
        }}
      >
        <EnhancedTableToolbar
          title="Tematica"
          titleAdd="Agregar tematica"
          handleAdd={handleAdd}
          numSelected={selected.length}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
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
                const isItemSelected = isSelected(row.idTheme, selected)
                const labelId = `enhanced-table-checkbox-${index}`
                const isRowEven = index % 2 === 0

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.idTheme}
                    selected={isItemSelected}
                    className={isRowEven ? 'table-row-even' : 'table-row-odd'}
                    sx={{ cursor: 'pointer' }}
                    onClick={(event) => handleClick(event, row.idTheme)}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      align="center"
                    >
                      {row.idTheme}
                    </TableCell>
                    <TableCell align="left">{row.themeName}</TableCell>
                    <TableCell align="left">{row.description}</TableCell>
                    <TableCell align="left" className="actions-cell">
                      <Tooltip title="Editar">
                        <IconButton onClick={() => handleEdit(row.idTheme)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Eliminar">
                        <IconButton onClick={handleConfirmDelete}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
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
                  <TableCell colSpan={4} />
                </TableRow>
              )}
              {page === 0 && rows === 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows
                  }}
                >
                  <TableCell colSpan={4}>
                    <Typography align="center">
                      {page === 0 ? 'No se encontraro la tematica' : ''}
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
          labelRowsPerPage="Filas por página"
         // labelDisplayedRows={getLabelDisplayedRows}
         sx={{
          "& .MuiTablePagination-displayedRows": { display: "none" } ,
          "& .MuiTablePagination-actions": { display: "none" } 
        }}
        />
      </Paper>
      <Box
        sx={{
          display: { xs: 'flex', lg: 'none' },
          height: '100vh'
        }}
      >
        <Typography
          gutterBottom
          variant="h6"
          component="h6"
          textAlign="center"
          sx={{
            paddingTop: 30,
            fontWeight: 'bold'
          }}
        >
          Funcionalidad no disponible en esta resolución
        </Typography>
      </Box>
      <MessageDialog
        title="Eliminar tematica"
        message={message}
        isOpen={showMessage}
        buttonText="Ok"
        onClose={handleClose}
        onButtonPressed={() =>
          onButtonPressed ? handleDelete() : handleClose()
        }
        showCancelButton={showCancelButton}
      />
    </MainWrapper>
  )
}
