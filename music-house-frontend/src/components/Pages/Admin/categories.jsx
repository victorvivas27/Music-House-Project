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
import { getCategories, deleteCategory } from '../../../api/categories'
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
import ArrowBack from '../../utils/ArrowBack'

const headCells = [
  {
    id: 'idCategory',
    numeric: true,
    disablePadding: false,
    label: 'ID'
  },
  {
    id: 'categoryName',
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

export const Categories = () => {
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState()
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
  const { categoryCreated } = state
  const navigate = useNavigate()

  useEffect(() => {
    getAllGategories()
  }, [])

  const getAllGategories = () => {
    setLoading(true)
    getCategories()
      .then(([categories]) => {
        setCategories(categories)
      })
      .catch(() => {
        setCategories([])
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (state.categoryCreated) {
      getAllGategories()
    }
  }, [categoryCreated, state.categoryCreated])

  useEffect(() => {
    if (!categories) return

    setRows(categories.data)
  }, [categories])

  const handleAdd = () => {
    navigate('/agregarCategoria')
  }

  const handleSelectAllClick = (event) => {
    handleSelectAll(event, rows, 'idCategory', setSelected)
  }

  const handleClick = (event, id) => {
    handleSelected(event, id, selected, setSelected)
  }

  const handleRequestSort = (event, property) => {
    handleSort(event, property, orderBy, order, setOrderBy, setOrder)
  }

  const handleEdit = (id) => {
    navigate(`/editarCategoria/${id}`)
  }

  const handleConfirmDelete = () => {
    setMessage('¿Desea eliminar esta categoría?')
    setShowCancelButton(true)
    setOnButtonPressed(true)
    setShowMessage(true)
  }

  const handleDelete = () => {
    const idCategory = selected[0]
    deleteCategory(idCategory)
      .then(() => {
        getAllGategories()
      })
      .catch(() => {
        setMessage(
          'No fue posible eliminar categoría. Por favor, vuelva a intentarlo'
        )
        setShowCancelButton(false)
        setOnButtonPressed(false)
      })
      .finally(() => {
        setSelected([])
        setShowMessage(false)
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

  if (loading) return <Loader title="Cargando categorías" />

  return (
    <MainWrapper >
      <Paper 
      sx={{
        
        margin:10,
        display: { xs: 'none', lg: 'initial' },
        
        }}>
          <ArrowBack/>
        <EnhancedTableToolbar
          title="Categorías"
          titleAdd="Agregar categoría"
          handleAdd={handleAdd}
          numSelected={selected.length}
          
        />
        <TableContainer>
          <Table aria-labelledby="tableTitle" size="medium">
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
                const isItemSelected = isSelected(row.idCategory, selected)
                const labelId = `enhanced-table-checkbox-${index}`
                const isRowEven = index % 2 === 0

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.idCategory}
                    selected={isItemSelected}
                    className={isRowEven ? 'table-row-even' : 'table-row-odd'}
                    sx={{ cursor: 'pointer' }}
                    onClick={(event) => handleClick(event, row.idCategory)}
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
                      {row.idCategory}
                    </TableCell>
                    <TableCell align="left">{row.categoryName}</TableCell>
                    <TableCell align="left">{row.description}</TableCell>
                    <TableCell align="left" className="actions-cell">
                      <Tooltip title="Editar">
                        <IconButton onClick={() => handleEdit(row.idCategory)}>
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
                      {page === 0 ? 'No se encontraron categorías' : ''}
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
            '& .MuiTablePagination-displayedRows': { display: 'none' },
            '& .MuiTablePagination-actions': { display: 'none' }
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
        title="Eliminar Categoría"
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
