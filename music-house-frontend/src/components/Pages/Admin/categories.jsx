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




import {
  EnhancedTableHead,
  EnhancedTableToolbar,
  isSelected,
  handleSort,
  handleSelectAll,
  handleSelected,
  getEmptyRows,
  useVisibleRows
} from '../Admin/common/tableHelper'
import ArrowBack from '../../utils/ArrowBack'
import { headCellsCategory } from '../../utils/types/HeadCells'
import useAlert from '../../../hook/useAlert'
import { getErrorMessage } from '../../../api/getErrorMessage'
import { deleteCategory, getCategories } from '@/api/categories'
import { Loader } from '@/components/common/loader/Loader'
import { MainWrapper } from '@/components/styles/ResponsiveComponents'
import { paginationStyles } from '@/components/styles/styleglobal'

export const Categories = () => {
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState({ result: [] })
  const [rows, setRows] = useState([])
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('number')
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const navigate = useNavigate()
  const { showConfirm, showLoading, showSuccess, showError } = useAlert()

  const getAllCategories = async () => {
    setLoading(true)

    try {
      const fetchedCategory = await getCategories()
      setCategories(fetchedCategory)
      setRows(fetchedCategory.result || [])
    } catch {
      setCategories({ result: [] })
    } finally {
      setTimeout(() => setLoading(false), 500)
    }
  }

  useEffect(() => {
    setRows(categories.result)
    setLoading(false)
  }, [categories])

  useEffect(() => {
    getAllCategories()
  }, [])

  const handleAdd = () => navigate('/agregarCategoria')

  const handleSelectAllClick = (event) => {
    handleSelectAll(event, rows, 'idCategory', setSelected)
  }

  const handleClick = (event, id) => {
    handleSelected(event, id, selected, setSelected)
  }

  const handleRequestSort = (event, property) => {
    handleSort(event, property, orderBy, order, setOrderBy, setOrder)
  }

  const handleEdit = (id) => navigate(`/editarCategoria/${id}`)

  const handleConfirmDelete = async (idCategory = null) => {
    const selectedIds = idCategory ? [idCategory] : selected
    if (selectedIds.length === 0) {
      showError('Error', 'No hay categorías seleccionadas para eliminar.')
      return
    }

    const isConfirmed = await showConfirm({
      title: `¿Eliminar ${selectedIds.length} categoría(s)?`,
      text: 'Esta acción no se puede deshacer.'
    })
    if (!isConfirmed) return

    showLoading('Eliminando...', 'Por favor espera.')

    try {
      await Promise.all(selectedIds.map((id) => deleteCategory(id)))
      showSuccess(
        '¡Eliminado(s)!',
        `${selectedIds.length} categoría(s) eliminada(s) correctamente.`
      )
      setSelected([])
      getAllCategories()
    } catch (error) {
      showError(`❌ ${getErrorMessage(error)}`)
    }
  }

  const emptyRows = getEmptyRows(page, rowsPerPage, rows)
  const visibleRows = useVisibleRows(rows, order, orderBy, page, rowsPerPage)

  if (loading) return <Loader title="Cargando categorías..." />

  return (
    <>
      {!loading && (
        <MainWrapper>
          <Paper
            sx={{
              width: '90%',
              margin: 10,
              display: { xs: 'none', lg: 'initial' },
              borderRadius: 4,
              boxShadow: 'var(--box-shadow)'
            }}
          >
            <ArrowBack />
            <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>
              Total de Categorias:{rows.length}
            </Typography>

            <EnhancedTableToolbar
              title="Categorías"
              titleAdd="Agregar categoría"
              handleAdd={handleAdd}
              numSelected={selected.length}
              handleConfirmDelete={() => handleConfirmDelete()}
            />
            <TableContainer>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size="medium"
              >
                <EnhancedTableHead
                  headCells={headCellsCategory}
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
                        className={
                          isRowEven ? 'table-row-even' : 'table-row-odd'
                        }
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
                        <TableCell align="left">
                          <Box
                            style={{
                              opacity: selected.length > 0 ? 0 : 1,
                              pointerEvents:
                                selected.length > 0 ? 'none' : 'auto',
                              transition: 'opacity 0.5s ease-in-out'
                            }}
                          >
                            <Tooltip title="Editar">
                              <IconButton
                                onClick={() => handleEdit(row.idCategory)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar">
                              <IconButton
                                onClick={() =>
                                  handleConfirmDelete(row.idCategory)
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
                      <TableCell colSpan={4} />
                    </TableRow>
                  )}
                  {page === 0 && rows.length === 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={7} align="center" />
                      <Typography>No se encontraron categorías</Typography>
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
              )}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10))
                setPage(0)
              }}
              labelRowsPerPage="Filas por página"
              sx={{
                ...paginationStyles
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
        </MainWrapper>
      )}
    </>
  )
}
