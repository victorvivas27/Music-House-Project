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
import { paginationStyles } from '../../styles/styleglobal'

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
//import { useAppStates } from '../../utils/global.context'
import ArrowBack from '../../utils/ArrowBack'
import { headCellsCategory } from '../../utils/types/HeadCells'
import useAlert from '../../../hook/useAlert'

export const Categories = () => {
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState({ data: [] })
  const [rows, setRows] = useState([])
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('number')
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  /*  const { state } = useAppStates()
  const { categoryCreated } = state */
  const navigate = useNavigate()
  const { showConfirm, showLoading, showSuccess, showError } = useAlert()

  const getAllCategories = async () => {
    setLoading(true)
    try {
      const [fetchedCategory] = await getCategories()
      setCategories(fetchedCategory)
      setRows(fetchedCategory.data || [])
    } catch {
      setCategories({ data: [] })
    } finally {
      setTimeout(() => setLoading(false), 500)
    }
  }

  useEffect(() => {
    setRows(categories.data)
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

    // ✅ Mostrar el modal de confirmación
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
      if (error?.data) {
        showError(
          `❌ ${error.data.message || '⚠️ No se pudo conectar con el servidor.'}`
        )
      }
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
              <Table aria-labelledby="tableTitle" size="medium">
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
