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
  Checkbox,
  IconButton,
  Tooltip
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import MainWrapper from '../../common/MainWrapper'
import { UsersApi } from '../../../api/users'
import { useNavigate } from 'react-router-dom'
import {
  EnhancedTableHead,
  EnhancedTableToolbar,
  getLabelDisplayedRows,
  isSelected,
  handleSort,
  handleSelectAll,
  handleSelected,
  getEmptyRows,
  useVisibleRows
} from './common/tableHelper'
import { MessageDialog } from '../../common/MessageDialog'
import { Loader } from '../../common/loader/Loader'

const headCells = [
  {
    id: 'idUser',
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
    id: 'lastName',
    numeric: false,
    disablePadding: false,
    label: 'Apellido'
  },
  {
    id: 'email',
    numeric: false,
    disablePadding: false,
    label: 'email'
  },
  {
    id: 'actions',
    numeric: false,
    disablePadding: false,
    label: 'Acciones'
  }
]

export const Usuarios = () => {
  const [usuarios, setUsuarios] = useState()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('idUser')
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [showMessage, setShowMessage] = useState(false)
  const [message, setMessage] = useState()
  const [showCancelButton, setShowCancelButton] = useState(false)
  const [onButtonPressed, setOnButtonPressed] = useState()
  const navigate = useNavigate()

  useEffect(() => {
    getUsuarios()
  }, [])

  useEffect(() => {
    if (!usuarios) return

    if (usuarios) {
      setRows(usuarios.data)
      setLoading(false)
    }
  }, [usuarios])

  const getUsuarios = () => {
    setLoading(true)
    UsersApi.getAllUsers()
      .then(([usuarios]) => {
        setUsuarios(usuarios)
      })
      .catch(([_, code]) => {
        setUsuarios([])
      })
  }

  const handleAdd = () => {
    navigate('/agregarUsuario')
  }

  const handleRequestSort = (event, property) => {
    handleSort(event, property, orderBy, order, setOrderBy, setOrder)
  }

  const handleSelectAllClick = (event) => {
    handleSelectAll(event, rows, 'idUser', setSelected)
  }

  const handleClick = (event, id) => {
    handleSelected(event, id, selected, setSelected)
  }

  const handleEdit = (idUser) => {
    navigate(`/editarUsuario/${idUser}`)
  }

  const handleConfirmDelete = () => {
    setMessage('¿Desea eliminar este usuario?')
    setShowCancelButton(true)
    setOnButtonPressed(true)
    setShowMessage(true)
  }

  const handleClose = () => {
    setShowMessage(false)
    setSelected([])
  }
  const handleDelete = () => {
    setShowMessage(false)
    deleteSelectedUser()
  }

  const deleteSelectedUser = () => {
    const idUser = selected[0]

    UsersApi.deleteUser(idUser)
      .then(() => {
        setMessage('Usuario eliminado exitosamente')
        setShowCancelButton(false)
        setOnButtonPressed(false)
      })
      .catch(() => {
        setMessage('No fue posible eliminar usuario')
        setShowCancelButton(false)
        setOnButtonPressed(false)
      })
      .finally(() => {
        setSelected([])
        setShowMessage(true)
        getUsuarios()
      })
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = getEmptyRows(page, rowsPerPage, rows)

  const visibleRows = useVisibleRows(rows, order, orderBy, page, rowsPerPage)

  if (loading) return <Loader title="Cargando usuarios" />

  return (
    <>
      {!loading && (
        <MainWrapper sx={{ width: '100%' }}>
          <Paper
            sx={{
              display: { xs: 'none', lg: 'initial' },
              width: '100%',
              mb: 2
            }}
          >
            <EnhancedTableToolbar
              title="Usuarios"
              titleAdd="Agregar usuario"
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
                  {visibleRows &&
                    visibleRows.map((row, index) => {
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
                          <TableCell align="left">{row.name}</TableCell>
                          <TableCell align="left">{row.lastName}</TableCell>
                          <TableCell align="left">{row.email}</TableCell>
                          <TableCell align="left">
                            <Tooltip title="Editar">
                              <IconButton
                                onClick={() => handleEdit(row.idUser)}
                              >
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
                      <TableCell colSpan={5} />
                    </TableRow>
                  )}
                  {page == 0 && rows.length === 0 && (
                    <TableRow
                      style={{
                        height: 53 * emptyRows
                      }}
                    >
                      <TableCell colSpan={5}>
                        <Typography align="center">
                          {page === 0 ? 'No se encontraron usuarios' : ''}
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
              labelDisplayedRows={getLabelDisplayedRows}
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
            title="Eliminar usuario"
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
      )}
    </>
  )
}
