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
  Checkbox,
  Box
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { useNavigate } from 'react-router-dom'
import useAlert from '@/hook/useAlert'
import { deleteInstrument, getInstruments } from '@/api/instruments'
import {
  EnhancedTableHead,
  EnhancedTableToolbar,
  handleSelectAll,
  handleSelected,
  handleSort,
  isSelected
} from './Admin/common/tableHelper'
import { getErrorMessage } from '@/api/getErrorMessage'
import { Loader } from '@/components/common/loader/Loader'
import {
  MainWrapper,
  TitleResponsive
} from '@/components/styles/ResponsiveComponents'
import { headCellsInstrument } from '@/components/utils/types/HeadCells'
import {
  flexRowContainer,
  paginationStyles
} from '@/components/styles/styleglobal'
import { useAppStates } from '@/components/utils/global.context'
import { actions } from '@/components/utils/actions'
import ArrowBack from '@/components/utils/ArrowBack'

export const Instruments = () => {
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('name')
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [firstLoad, setFirstLoad] = useState(true)
  const navigate = useNavigate()
  const { showConfirm, showLoading, showSuccess, showError } = useAlert()
  const { state, dispatch } = useAppStates()

  const getAllInstruments = async (
    pageToUse = page,
    sizeToUse = rowsPerPage,
    isFirst = false
  ) => {
    if (isFirst) dispatch({ type: actions.SET_LOADING, payload: true })
    const sort = `${orderBy},${order}`
    try {
      const data = await getInstruments(pageToUse, sizeToUse, sort)
      dispatch({ type: actions.SET_INSTRUMENTS, payload: data?.result })
    } catch {
      dispatch({
        type: actions.SET_INSTRUMENTS,
        payload: { content: [], totalElements: 0 }
      })
    } finally {
      setTimeout(() => {
        if (isFirst) setFirstLoad(false)
        dispatch({ type: actions.SET_LOADING, payload: false })
      }, 500)
    }
  }
  const rows = Array.isArray(state?.instruments?.content)
    ? state?.instruments?.content
    : []

  useEffect(() => {
    getAllInstruments(page, rowsPerPage, firstLoad)
  }, [page, rowsPerPage, orderBy, order])

  const handleAdd = () => navigate('/agregarInstrumento')

  const handleSelectAllClick = (event) =>
    handleSelectAll(event, rows, 'idInstrument', setSelected)

  const handleClick = (event, id) =>
    handleSelected(event, id, selected, setSelected)

  const handleRequestSort = (event, property) => {
    const colum = headCellsInstrument.find(
      (headCell) => headCell.id === property
    )
    if (colum?.disableSort) return

    handleSort(event, property, orderBy, order, setOrderBy, setOrder)
  }
  const handleEdit = (id) => navigate(`/editarInstrumento/${id}`)

  const handleConfirmDelete = async (idInstrument = null) => {
    const selectedIds = idInstrument ? [idInstrument] : selected
    if (selectedIds.length === 0) {
      showError('Error', 'No hay instrumentos seleccionados para eliminar.')
      return
    }
    const isConfirmed = await showConfirm(
      `¿Eliminar ${selectedIds.length} instrumento(s)?`,
      'Esta acción no se puede deshacer.'
    )
    if (!isConfirmed) return

    showLoading('Eliminando...', 'Por favor espera.')
    try {
      await Promise.all(selectedIds.map((id) => deleteInstrument(id)))
      showSuccess(
        '¡Eliminado(s)!',
        `${selectedIds.length} instrumento(s) eliminado(s) correctamente.`
      )
      setSelected([])
      getAllInstruments(page, rowsPerPage)
    } catch (error) {
      showError(`❌ ${getErrorMessage(error)}`)
    }
  }

  if (state.loading) return <Loader title="Cargando instrumentos..." />

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

        {/*Tercer parte de la tabla */}
        <EnhancedTableToolbar
          title="Instrumentos"
          titleAdd="Agregar instrumento"
          handleAdd={handleAdd}
          numSelected={selected.length}
          handleConfirmDelete={() => handleConfirmDelete()}
        />
        {/*Fin Tercer parte de la tabla */}

        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              headCells={headCellsInstrument}
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
                    sx={{ cursor: 'pointer' }}
                    onChange={(event) => handleClick(event, row.idInstrument)}
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
                          width: 80,
                          height: 80
                        }}
                      >
                        <img
                          src={
                            row.imageUrls?.[0]?.imageUrl ||
                            '/src/assets/instrumento_general_03.jpg'
                          }
                          alt="Imagen Instrumento"
                          style={{
                            width: '80px',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: '40px',
                            border: '1px solid #ccc',
                            boxShadow: 'var(--box-shadow)'
                          }}
                        />
                      </Box>
                    </TableCell>

                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="left">{row.theme.themeName}</TableCell>
                    <TableCell align="left">
                      {row.category.categoryName}
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
                              handleEdit(row.idInstrument)
                              event.stopPropagation()
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Eliminar">
                          <IconButton
                            onClick={(event) => {
                              handleConfirmDelete(row.idInstrument)
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
                    <TitleResponsive>
                      No se encontraron instrumentos
                    </TitleResponsive>
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
          count={state?.instruments?.totalElements || 0}
          rowsPerPage={rowsPerPage}
          page={page}
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
          sx={{ paddingTop: 30, fontWeight: 'bold' }}
        >
          Funcionalidad no disponible en esta resolución
        </Typography>
      </Box>
    </MainWrapper>
  )
}

export default Instruments
