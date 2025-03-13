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
import Swal from 'sweetalert2'

const headCells = [
  { id: 'idUser', numeric: true, disablePadding: false, label: 'ID' },
  { id: 'rol', numeric: false, disablePadding: false, label: 'Rol' },
  { id: 'name', numeric: false, disablePadding: false, label: 'Nombre' },
  { id: 'lastName', numeric: false, disablePadding: false, label: 'Apellido' },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
  { id: 'actions', numeric: false, disablePadding: false, label: 'Acciones' }
]

export const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('idUser')
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const navigate = useNavigate()

  useEffect(() => {
    getUsuarios()
  }, [])

  const getUsuarios = () => {
    setLoading(true)
    UsersApi.getAllUsers()
      .then(([usuarios]) => {
        setUsuarios(usuarios?.data || [])
      })
      .catch(() => {
        setUsuarios([])
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los usuarios',
          icon: 'error',
          confirmButtonText: 'Entendido'
        })
      })
      .finally(() => setLoading(false))
  }

  const handleAdd = () => {
    navigate('/agregarUsuario')
  }

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

  const handleDelete = (idUser) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará permanentemente al usuario.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        UsersApi.deleteUser(idUser)
          .then(() => {
            Swal.fire({
              title: 'Usuario eliminado',
              text: 'El usuario fue eliminado con éxito.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            })
            getUsuarios()
          })
          .catch(() => {
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar el usuario.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            })
          })
      }
    })
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

  if (loading) return <Loader title="Cargando usuarios" />

  return (
    <>
      {!loading && (
        <MainWrapper>
          <Paper
            sx={{
              display: { xs: 'none', lg: 'initial' },
              margin: 10,
              minWidth: 1700
            }}
          >
            <ArrowBack />
            <EnhancedTableToolbar
              title="Usuarios"
              titleAdd="Agregar usuario"
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
                      <TableCell colSpan={5} />
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
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </MainWrapper>
      )}
    </>
  )
}
