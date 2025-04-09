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
import useAlert from '@/hook/useAlert'
import { useAppStates } from '@/components/utils/global.context'
import { actions } from '@/components/utils/actions'
import { deleteCategory, getCategories } from '@/api/categories'
import { EnhancedTableHead, EnhancedTableToolbar, handleSelectAll, handleSelected, handleSort, isSelected } from './common/tableHelper'
import { headCellsCategory } from '@/components/utils/types/HeadCells'
import { getErrorMessage } from '@/api/getErrorMessage'
import { Loader } from '@/components/common/loader/Loader'
import { MainWrapper, TitleResponsive } from '@/components/styles/ResponsiveComponents'
import ArrowBack from '@/components/utils/ArrowBack'
import SearchInput from '@/components/common/search/SearchInput'
import { paginationStyles } from '@/components/styles/styleglobal'



export const Categories = () => {
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('categoryName')
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [firstLoad, setFirstLoad] = useState(true)
  const navigate = useNavigate()
  const { showConfirm, showLoading, showSuccess, showError } = useAlert()
  const { state, dispatch } = useAppStates()

  const fetchData = async (
    pageToUse = page,
    sizeToUse = rowsPerPage,
    isFirst = false
  ) => {
    if (isFirst) dispatch({ type: actions.SET_LOADING, payload: true })
    const sort = `${orderBy},${order}`

    try {
      const data = await getCategories(pageToUse, sizeToUse, sort)
      dispatch({ type: actions.SET_CATEGORIES, payload: data.result })
    } catch {
      dispatch({
        type: actions.SET_CATEGORIES,
        payload: { content: [], totalElements: 0 }
      })
    } finally {
      setTimeout(() => {
        if (isFirst) setFirstLoad(false)
        dispatch({ type: actions.SET_LOADING, payload: false })
      }, 500)
    }
  }
  const rows = Array.isArray(state.categories.content)
    ? state.categories.content
    : []

  useEffect(() => {
    fetchData(page, rowsPerPage, firstLoad)
  }, [page, rowsPerPage, order, orderBy])

 

  const handleAdd = () => navigate('/agregarCategoria')

  const handleSelectAllClick = (event) => {
    handleSelectAll(event, rows, 'idCategory', setSelected)
  }

  const handleClick = (event, id) => {
    handleSelected(event, id, selected, setSelected)
  }

  const handleRequestSort = (event, property) => {
    const column = headCellsCategory.find((col) => col.id === property)
    if (column?.disableSort) return

    handleSort(event, property, orderBy, order, setOrderBy, setOrder)
  }

  const handleEdit = (id) => navigate(`/editarCategoria/${id}`)

  const handleConfirmDelete = async (idCategory = null) => {
    const selectedIds = idCategory ? [idCategory] : selected
    if (selectedIds.length === 0) {
      showError('Error', 'No hay categorías seleccionadas para eliminar.')
      return
    }

    const isConfirmed = await showConfirm(
      `¿Eliminar ${selectedIds.length} categoría(s)?`,
      'Esta acción no se puede deshacer.'
    )
    if (!isConfirmed) return

    showLoading('Eliminando...', 'Por favor espera.')

    try {
      await Promise.all(selectedIds.map((id) => deleteCategory(id)))
      showSuccess(
        '¡Eliminado(s)!',
        `${selectedIds.length} categoría(s) eliminada(s) correctamente.`
      )
      setSelected([])
      await fetchData(page, rowsPerPage)
    } catch (error) {
      showError(`❌ ${getErrorMessage(error)}`)
    }
  }

 

  if (state.loading) return <Loader title="Cargando categorías..." />

  return (
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

        <EnhancedTableToolbar
          title="Categorías"
          titleAdd="Agregar categoría"
          handleAdd={handleAdd}
          numSelected={selected.length}
          handleConfirmDelete={() => handleConfirmDelete()}
        />
        <SearchInput />
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
              {rows.map((row, index) => {
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
                      isRowEven ? 'table-row-even' : 'table-row-odd'}
                    sx={{ cursor: 'pointer' }}
                    onClick={(event) => handleClick(event, row.idCategory)}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </TableCell>

                    <TableCell align="center">
                      {page * rowsPerPage + index + 1}
                    </TableCell>

                    <TableCell align="left">{row.categoryName}</TableCell>
                    <TableCell align="left">{row.description}</TableCell>
                    <TableCell align="left">
                      <Box
                        style={{
                          opacity: selected.length > 0 ? 0 : 1,
                          pointerEvents: selected.length > 0 ? 'none' : 'auto',
                          transition: 'opacity 0.5s ease-in-out'
                        }}
                      >
                        <Tooltip title="Editar">
                          <IconButton
                            onClick={(event) => {
                              handleEdit(row.idCategory)
                              event.stopPropagation()
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                            onClick={(event) => {
                              handleConfirmDelete(row.idCategory)
                              event.stopPropagation()
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              })}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <TitleResponsive>No se encontraron categorías</TitleResponsive>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            {Array.from({ length: Math.max(0, rowsPerPage - rows.length) }).map(
              (_, i) => (
                <TableRow key={`empty-${i}`} style={{ height: 80 }}>
                  <TableCell colSpan={7} />
                </TableRow>
              )
            )}
            
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={state.categories.totalElements || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10))
            setPage(0)
          }}
          labelRowsPerPage="Filas por página"
          sx={{ ...paginationStyles }}
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
          sx={{ paddingTop: 30, fontWeight: 'bold' }}
        >
          Funcionalidad no disponible en esta resolución
        </Typography>
      </Box>
    </MainWrapper>
  )
}
