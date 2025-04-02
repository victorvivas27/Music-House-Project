import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
  Typography,
  Box
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { useNavigate } from 'react-router-dom'
import { UsersApi } from '@/api/users'
import useAlert from '@/hook/useAlert'
import {
  EnhancedTableHead,
  EnhancedTableToolbar,
  getEmptyRows,
  handleSelectAll,
  handleSelected,
  handleSort,
  isSelected,
  useVisibleRows
} from './common/tableHelper'
import { getErrorMessage } from '@/api/getErrorMessage'
import { Loader } from '@/components/common/loader/Loader'
import ArrowBack from '@/components/utils/ArrowBack'
import { headCellsUser } from '@/components/utils/types/HeadCells'
import { paginationStyles } from '@/components/styles/styleglobal'
import { MainWrapper } from '@/components/styles/ResponsiveComponents'

export const Usuarios = () => {
  const [usuarios, setUsuarios] = useState({ result: [] })
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('idUser')
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const navigate = useNavigate()
  const { showConfirm, showLoading, showSuccess, showError } = useAlert()

  const getUsuarios = async () => {
    setLoading(true)
    try {
      const fetchedUsers = await UsersApi.getAllUsers()
      setUsuarios(fetchedUsers)
      setRows(fetchedUsers.result || [])
    } catch {
      setUsuarios({ result: [] })
    } finally {
      setTimeout(() => setLoading(false))
    }
  }

  useEffect(() => {
    setRows(usuarios.result)
    setLoading(false)
  }, [usuarios])

  useEffect(() => {
    getUsuarios()
  }, [])

  const handleAdd = () => navigate('/agregarUsuario')

  const handleSelectAllClick = (event) => {
    handleSelectAll(event, usuarios, 'idUser', setSelected)
  }
  const handleClick = (event, id) => {
    handleSelected(event, id, selected, setSelected)
  }
  const handleRequestSort = (event, property) => {
    handleSort(event, property, orderBy, order, setOrderBy, setOrder)
  }

  const handleEdit = (idUser) => navigate(`/editarUsuario/${idUser}`)

  const handleDelete = async (idUser = null) => {
    const selectedIds = idUser ? [idUser] : selected
    if (selectedIds.length === 0) {
      showError('Error', 'No hay usuario seleccionados para eliminar.')
      return
    }
    const isConfirmed = await showConfirm({
      title: `¿Eliminar ${selectedIds.length} usuario(s)?`,
      text: 'Esta acción no se puede deshacer.'
    })
    if (!isConfirmed) return
    showLoading('Eliminando...', 'Por favor espera.')
    try {
      await Promise.all(selectedIds.map((id) => UsersApi.deleteUser(id)))
      showSuccess(
        '¡Eliminado(s)!',
        `${selectedIds.length} usuario(s) eliminado(s) correctamente.`
      )
      setSelected([])
      getUsuarios()
    } catch (error) {
      showError(`❌ ${getErrorMessage(error)}`)
    }
  }

  const emptyRows = getEmptyRows(page, rowsPerPage, usuarios)
  const visibleRows = useVisibleRows(rows, order, orderBy, page, rowsPerPage)

  if (loading) return <Loader title="Cargando usuarios..." />

  return (
    <>
      {!loading && (
        <MainWrapper>
          <Paper
            sx={{
              display: { xs: 'none', lg: 'initial' },
              margin: 10,
              width: '95%',
              borderRadius: 4,
              boxShadow: 'var(--box-shadow)'
            }}
          >
            <ArrowBack />
            {/* Contador */}
            <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>
              Total de Usuarios: {rows.length}
            </Typography>
            {/*Fin Contador */}

            <EnhancedTableToolbar
              title="Usuarios"
              titleAdd="Agregar usuario"
              handleAdd={handleAdd}
              numSelected={selected.length}
              handleConfirmDelete={() => handleDelete()}
            />

            <TableContainer>
              <Table aria-labelledby="tableTitle" size="medium">
                <EnhancedTableHead
                  headCells={headCellsUser}
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
                    const isItemSelected = isSelected(row.idUser, selected)
                    const labelId = `enhanced-table-checkbox-${index}`
                    const isRowEven = index % 2 === 0

                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.idUser}
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
                            onChange={(event) => handleClick(event, row.idUser)}
                            inputProps={{
                              'aria-labelledby': labelId
                            }}
                          />
                        </TableCell>

                        <TableCell align="left">
                          <img
                            src={
                              row?.picture ||
                              '/src/assets/avatar_general_02.png'
                            }
                            alt="Instrumento"
                            style={{
                              width: '80px',
                              height: '80px',
                              objectFit: 'cover',
                              borderRadius: '40px',
                              border: '1px solid #ccc',
                              boxShadow: 'var(--box-shadow)'
                            }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                          align="center"
                        >
                          {row.idUser}
                        </TableCell>

                        <TableCell align="left">
                          {row.roles.join(', ')}
                        </TableCell>
                        <TableCell align="left">{row.name}</TableCell>
                        <TableCell align="left">{row.lastName}</TableCell>
                        <TableCell align="left">{row.email}</TableCell>
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
                                onClick={(event) => {
                                  event.stopPropagation()
                                  handleEdit(row.idUser)
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Eliminar">
                              <IconButton
                                onClick={(event) => {
                                  event.stopPropagation()
                                  handleDelete(row.idUser)
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
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={3} />
                    </TableRow>
                  )}
                  {page === 0 && usuarios.length === 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={7} align="center" />
                      <Typography>No se encontraron usuarios</Typography>
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
        </MainWrapper>
      )}
    </>
  )
}
