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
  handleSelected
} from '../Admin/common/tableHelper'
import useAlert from '@/hook/useAlert'
import { deleteTheme, getTheme } from '@/api/theme'
import { getErrorMessage } from '@/api/getErrorMessage'
import { Loader } from '@/components/common/loader/Loader'
import {
  MainWrapper,
  TitleResponsive
} from '@/components/styles/ResponsiveComponents'
import ArrowBack from '@/components/utils/ArrowBack'
import { headCellsTheme } from '@/components/utils/types/HeadCells'
import {
  flexRowContainer,
  paginationStyles
} from '@/components/styles/styleglobal'
import { useAppStates } from '@/components/utils/global.context'
import { actions } from '@/components/utils/actions'
import SearchNameTheme from '@/components/common/search/SearchNameTheme'
import { usePaginationControl } from '@/hook/usePaginationControl'

export const Theme = () => {
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('themeName')
  const [selected, setSelected] = useState([])
  const [firstLoad, setFirstLoad] = useState(true)
  const navigate = useNavigate()
  const { showConfirm, showLoading, showSuccess, showError } = useAlert()
  const { state, dispatch } = useAppStates()
  const {
    page,
    safePage,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage
  } = usePaginationControl(state.themes.totalElements)

  const getAllTheme = async (
    pageToUse = page,
    sizeToUse = rowsPerPage,
    isFirst = false
  ) => {
    if (isFirst) dispatch({ type: actions.SET_LOADING, payload: true })
    const sort = `${orderBy},${order}`

    try {
      const data = await getTheme(pageToUse, sizeToUse, sort)
      dispatch({ type: actions.SET_THEMES, payload: data.result })
    } catch {
      dispatch({
        type: actions.SET_THEMES,
        payload: { content: [], totalElements: 0 }
      })
    } finally {
      setTimeout(() => {
        if (isFirst) setFirstLoad(false)
        dispatch({ type: actions.SET_LOADING, payload: false })
      }, 500)
    }
  }
  const rows = Array.isArray(state.themes.content) ? state.themes.content : []

  useEffect(() => {
    getAllTheme(page, rowsPerPage, firstLoad)
  }, [page, rowsPerPage, order, orderBy])

  const handleAdd = () => navigate('/agregarTheme')

  const handleSelectAllClick = (event) => {
    handleSelectAll(event, rows, 'idTheme', setSelected)
  }

  const handleClick = (event, id) => {
    handleSelected(event, id, selected, setSelected)
  }

  const handleRequestSort = (event, property) => {
    const column = headCellsTheme.find((col) => col.id === property)
    if (column?.disableSort) return

    handleSort(event, property, orderBy, order, setOrderBy, setOrder)
  }

  const handleEdit = (id) => navigate(`/editarTheme/${id}`)

  const handleConfirmDelete = async (idTheme = null) => {
    const selectedIds = idTheme ? [idTheme] : selected
    if (selectedIds.length === 0) {
      showError('Error', 'No hay tematicas seleccionadas para eliminar.')
      return
    }

    const isConfirmed = await showConfirm(
      `¿Eliminar ${selectedIds.length} thematicas(s)?`,
      'Esta acción no se puede deshacer.'
    )
    if (!isConfirmed) return

    showLoading('Eliminando...', 'Por favor espera.')

    try {
      await Promise.all(selectedIds.map((id) => deleteTheme(id)))
      showSuccess(
        '¡Eliminado(s)!',
        `${selectedIds.length} tematicas(s) eliminada(s) correctamente.`
      )
      setSelected([])
      getAllTheme(page, rowsPerPage)
    } catch (error) {
      showError(`❌ ${getErrorMessage(error)}`)
    }
  }

  if (state.loading) return <Loader title="Cargando tematicas..." />

  return (
    <MainWrapper>
      <Paper
        sx={{
          width: '90%',
          display: { xs: 'none', lg: 'initial' },
          margin: 10,
          borderRadius: 4,
          boxShadow: 'var(--box-shadow)'
        }}
      >
        <ArrowBack />

        <EnhancedTableToolbar
          title="Tematica"
          titleAdd="Agregar tematica"
          handleAdd={handleAdd}
          numSelected={selected.length}
          handleConfirmDelete={() => handleConfirmDelete()}
        />
        <SearchNameTheme />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              headCells={headCellsTheme}
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

                    <TableCell align="center">
                      {page * rowsPerPage + index + 1}
                    </TableCell>

                    <TableCell align="left" sx={{ ...flexRowContainer }}>
                      <Box
                        sx={{
                          width: 80
                        }}
                      >
                        <img
                          src={
                            row?.imageUrlTheme ||
                            '/src/assets/instrumento_general_03.jpg'
                          }
                          alt="Imagen tematica"
                          style={{
                            width: '80px',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: '50%',
                            border: '1px solid #ccc',
                            boxShadow: 'var(--box-shadow)',
                            display: 'block'
                          }}
                        />
                      </Box>
                    </TableCell>

                    <TableCell align="left">{row.themeName}</TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                        maxWidth: 500
                      }}
                    >
                      {row.description}
                    </TableCell>
                    <TableCell align="left">{row.registDate}</TableCell>
                    <TableCell align="left">{row.modifiedDate}</TableCell>
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
                              handleEdit(row.idTheme)
                              event.stopPropagation()
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Eliminar">
                          <IconButton
                            onClick={(event) => {
                              handleConfirmDelete(row.idTheme)
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
                    <TitleResponsive>No hay temáticas</TitleResponsive>
                  </TableCell>
                </TableRow>
              )}
              {Array.from({
                length: Math.max(0, rowsPerPage - rows.length)
              }).map((_, i) => (
                <TableRow key={`empty-${i}`} style={{ height: 80 }}>
                  <TableCell colSpan={7} />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={state.themes.totalElements || 0}
          rowsPerPage={rowsPerPage}
          page={safePage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
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
          sx={{ paddingTop: 30, fontWeight: 'bold' }}
        >
          Funcionalidad no disponible en esta resolución
        </Typography>
      </Box>
    </MainWrapper>
  )
}
