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
  Typography
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import MainWrapper from '../../common/MainWrapper'
import { UsersApi } from '../../../api/users'
import { useNavigate } from 'react-router-dom'
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
} from './common/tableHelper'
import { Loader } from '../../common/loader/Loader'
import ArrowBack from '../../utils/ArrowBack'
import { headCellsUser } from '../../utils/types/HeadCells'
import useAlert from '../../../hook/useAlert'
export const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('idUser')
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const navigate = useNavigate()
  const { showConfirm, showLoading, showSuccess, showError } = useAlert()

  const getUsuarios = () => {
    setLoading(true)
    UsersApi.getAllUsers()
      .then(([usuarios]) => {
        setUsuarios(usuarios?.data || [])
      })
      .catch(() => {
        setUsuarios([])
      })
      .finally(() => {
        setTimeout(() => setLoading(false), 500)
      })
  }

  useEffect(() => {
    getUsuarios()
  }, [])

  /*  const handleAdd = () => {
    navigate('/agregarUsuario')
  } */

  const handleRequestSort = (event, property) => {
    handleSort(event, property, orderBy, order, setOrderBy, setOrder)
  }

  const handleSelectAllClick = (event) => {
    handleSelectAll(event, usuarios, 'idUser', setSelected)
  }

  const handleClick = (event, id) => {
    handleSelected(event, id, selected, setSelected)
  }

  const handleEdit = (idUser) => {
    navigate(`/editarUsuario/${idUser}`)
  }

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
      if (error.data) {
        // ✅ Ahora sí capturamos el mensaje que envía el backend
        showError(
          `❌ ${
            error.data.message || '⚠️ No se pudo conectar con el servidor.'
          }`
        )
      }
    }
  }

  const handleChangePage = (newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const emptyRows = getEmptyRows(page, rowsPerPage, usuarios)
  const visibleRows = useVisibleRows(
    usuarios,
    order,
    orderBy,
    page,
    rowsPerPage
  )

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
              Total de Usuarios: {usuarios.length}
            </Typography>
            {/*Fin Contador */}

            <EnhancedTableToolbar
              title="Usuarios"
              titleAdd="Agregar usuario"
              //handleAdd={handleAdd}
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
                  rowCount={usuarios.length}
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
                        sx={{
                          cursor: 'pointer',
                          backgroundColor: isRowEven ? '#fbf194' : 'inherit'
                        }}
                        onClick={(event) => handleClick(event, row.idUser)}
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
                          padding="none"
                          align="center"
                        >
                          {row.idUser}
                        </TableCell>
                        <TableCell align="left">
                          {row.roles.map((r) => r.rol).join(', ')}
                        </TableCell>
                        <TableCell align="left">{row.name}</TableCell>
                        <TableCell align="left">{row.lastName}</TableCell>
                        <TableCell align="left">{row.email}</TableCell>
                        <TableCell align="left">
                          <Tooltip title="Editar">
                            <IconButton
                              onClick={(event) => {
                                event.stopPropagation() // Evita que se seleccione la fila
                                handleEdit(row.idUser)
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Eliminar">
                            <IconButton
                              onClick={(event) => {
                                event.stopPropagation() // Evita que se seleccione la fila
                                handleDelete(row.idUser)
                              }}
                            >
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
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={usuarios.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              labelRowsPerPage="Filas por página"
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                '& .MuiTablePagination-displayedRows': { display: 'none' },
                '& .MuiTablePagination-actions': { display: 'none' }
              }}
            />
          </Paper>
        </MainWrapper>
      )}
    </>
  )
}
