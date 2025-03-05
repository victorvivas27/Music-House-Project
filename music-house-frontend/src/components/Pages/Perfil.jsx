import { useEffect, useState } from 'react'
import { UsersApi } from '../../api/users'
import { useAuthContext } from '../utils/context/AuthGlobal'
import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  Divider,
  CssBaseline,
  Snackbar,
  Alert,
  Tooltip,
  IconButton,
  Button
} from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import HomeIcon from '@mui/icons-material/Home'
import { Loader } from '../common/loader/Loader'
import ModalNewDireccion from '../common/nuevadireccion/ModalNewDireccion'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { removeAddress } from '../../api/addresses'
import Swal from 'sweetalert2'
import ModalNewPhone from '../common/nuevontelefono/ModalNewPhone'
import { removePhone } from '../../api/phones'
import ModalUpdateUser from '../common/modificardatosuser/ModalUpdateUser'
import ModalUpdatePhone from '../common/nuevontelefono/ModalUpdatePhone'

const Perfil = () => {
  const { idUser } = useAuthContext()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [openModalPhone, setOpenModalPhone] = useState(false)
  const [openModalUser, setOpenModalUser] = useState(false)
  const [openModalPhoneUpdate, setOpenModalPhoneUpdate] = useState(false)
  const [selectedPhone, setSelectedPhone] = useState(null)

  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => setOpenModal(false)

  const handleOpenModalPhone = () => setOpenModalPhone(true)
  const handleCloseModalPhone = () => setOpenModalPhone(false)

  const handleOpenModalUser = () => setOpenModalUser(true)
  const handleCloseModalUser = () => setOpenModalUser(false)

  const handleOpenModalPhoneUpdate = (phone) => {
    setSelectedPhone(phone) // 📌 Guardar el teléfono seleccionado
    setOpenModalPhoneUpdate(true)
  }

  const handleCloseModalPhoneUpdate = () => {
    setOpenModalPhoneUpdate(false)
    setSelectedPhone(null) // 📌 Limpiar el estado al cerrar
  }

  // Función para cargar los datos del usuario
  const fetchUser = async () => {
    if (!idUser) return

    try {
      const response = await UsersApi.getUserById(idUser)
      if (response?.[0]?.data) {
        setUserData(response[0].data)
      } else {
        setError('Estructura de datos inesperada')
        setOpenSnackbar(true)
      }
    } catch (err) {
      setError('Error al obtener los datos del usuario.')
      setOpenSnackbar(true)
    } finally {
      setLoading(false)
    }
  }

  // Llamar la función cuando el componente se monte
  useEffect(() => {
    fetchUser()
  }, [idUser])

  // Cerrar el snackbar de error
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }
 

  if (loading) return <Loader title="Un momento por favor..." />

  return (
    <main
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '320px'
      }}
    >
      {!loading && userData && (
        <>
          <CssBaseline />
          <Box
            sx={{
              borderRadius: '12px',
              boxShadow: 3,
              maxWidth: 1300,
              backgroundColor: '#f9f9f9'
            }}
          >
            <Grid container justifyContent="center">
              <Card
                sx={{
                  width: '900px',
                  minHeight: '500px',
                  p: 4,
                  boxShadow: 4,
                  borderRadius: 4,
                  bgcolor: '#ffffff'
                }}
              >
                <CardContent>
                  {/* Encabezado con Avatar y Email */}
                  <Box display="flex" alignItems="center" mb={2}>
                    <Tooltip title="Haz clic para editar tus datos">
                    <Avatar
                      sx={{
                        bgcolor: '#1976D2',
                        width: 90,
                        height: 90,
                        fontSize: 40
                      }}
                      onClick={handleOpenModalUser}
                    >
                      {userData?.name?.[0] || '?'}
                    </Avatar>
                    </Tooltip>
                    
                    <Box ml={2}>
                      <Typography variant="h5" fontWeight="bold">
                        {userData?.name || 'Nombre no disponible'}{' '}
                        {userData?.lastName || ''}
                      </Typography>
                      
                      <Box display="flex" alignItems="center" mt={0.5}>
                        <EmailIcon sx={{ color: '#1976D2', mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {userData?.email || 'Correo no disponible'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Teléfono */}
                  <Box display="flex" alignItems="center" mb={2}>
                    <Box sx={{ width: 900 }}>
                      <Box display="flex" alignItems="center">
                        <Tooltip title="Agregar un nuevo telefono">
                          <IconButton
                            onClick={handleOpenModalPhone}
                            sx={{ color: '#1976D2' }}
                          >
                            <AddIcon />
                          </IconButton>
                        </Tooltip>
                        <PhoneIcon sx={{ color: '#43A047', mr: 1 }} />
                        <Typography variant="subtitle1">
                          <strong>Telefonos:</strong>
                        </Typography>
                      </Box>

                      <Grid container spacing={3} sx={{ mt: 2 }}>
                        {userData?.phones?.length > 0 ? (
                          userData.phones.map((phone) => (
                            <Grid item xs={12} sm={5} key={phone.idPhone}>
                              <Card
                                sx={{
                                  p: 1,
                                  borderRadius: '8px',
                                  boxShadow: 3,
                                  border: '1px solid black'
                                }}
                              >
                                <CardContent>
                                  <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                  >
                                    {/* 📌 Número de teléfono clickeable para llamadas */}
                                    <Typography variant="h6" fontWeight="bold">
                                      <a
                                        href={`tel:${phone.phoneNumber}`}
                                        style={{
                                          textDecoration: 'none',
                                          color: '#1976D2',
                                          fontWeight: 'bold'
                                        }}
                                      >
                                        {phone.phoneNumber}
                                      </a>
                                    </Typography>

                                    <Box>
                                      {/* Botón de editar */}
                                      <IconButton
                                        onClick={() =>
                                          handleOpenModalPhoneUpdate(phone)
                                        }
                                        sx={{ color: '#1976D2' }}
                                      >
                                        <EditIcon />
                                      </IconButton>

                                      {/* Botón de eliminar con confirmación */}
                                      <IconButton
                                        onClick={async () => {
                                          if (userData.phones.length > 1) {
                                            const result = await Swal.fire({
                                              title: '¿Estás seguro?',
                                              text: 'Esta acción eliminará el teléfono.',
                                              icon: 'warning',
                                              showCancelButton: true,
                                              confirmButtonColor: '#d33',
                                              cancelButtonColor: '#3085d6',
                                              confirmButtonText: 'Sí, eliminar',
                                              cancelButtonText: 'Cancelar'
                                            })

                                            if (result.isConfirmed) {
                                              await removePhone(phone.idPhone)
                                              fetchUser()
                                              Swal.fire(
                                                'Eliminado',
                                                'El teléfono ha sido eliminado correctamente.',
                                                'success'
                                              )
                                            }
                                          } else {
                                            Swal.fire(
                                              'Acción no permitida',
                                              'Debe haber al menos un teléfono registrado.',
                                              'error'
                                            )
                                          }
                                        }}
                                        color="error"
                                        disabled={userData.phones.length === 1}
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    </Box>
                                  </Box>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))
                        ) : (
                          <Typography variant="body2" sx={{ mt: 2 }}>
                            No hay teléfonos registrados.
                          </Typography>
                        )}
                      </Grid>
                    </Box>
                  </Box>

                  {/* Sección de Direcciones con Grid */}
                  <Box sx={{ width: 900 }}>
                    <Box display="flex" alignItems="center">
                      <Tooltip title="Agregar nueva dirección">
                        <IconButton
                          onClick={handleOpenModal}
                          sx={{ color: '#1976D2' }}
                        >
                          <AddIcon />
                        </IconButton>
                      </Tooltip>
                      <HomeIcon sx={{ color: '#FF9800', mr: 1 }} />
                      <Typography variant="subtitle1">
                        <strong>Direcciones:</strong>
                      </Typography>
                    </Box>

                    <Grid container spacing={3} sx={{ mt: 2 }}>
                      {userData?.addresses?.length > 0 ? (
                        userData.addresses.map((address) => (
                          <Grid item xs={12} sm={5} key={address.idAddress}>
                            <Card
                              sx={{
                                p: 1,
                                borderRadius: '8px',
                                boxShadow: 3,
                                border: '1px solid black'
                              }}
                            >
                              <CardContent>
                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                  alignItems="center"
                                >
                                  <Typography variant="h6" fontWeight="bold">
                                    {address.street}
                                  </Typography>
                                 
                                  {/* Botón de eliminar con confirmación */}
                                  <IconButton
                                    onClick={async () => {
                                      if (userData.addresses.length > 1) {
                                        // Evita eliminar la última dirección
                                        const result = await Swal.fire({
                                          title: '¿Estás seguro?',
                                          text: 'Esta acción eliminará la dirección de forma permanente.',
                                          icon: 'warning',
                                          showCancelButton: true,
                                          confirmButtonColor: '#d33',
                                          cancelButtonColor: '#3085d6',
                                          confirmButtonText: 'Sí, eliminar',
                                          cancelButtonText: 'Cancelar'
                                        })

                                        if (result.isConfirmed) {
                                          await removeAddress(address.idAddress)
                                          fetchUser() // 🔄 Actualiza la lista después de eliminar
                                          Swal.fire(
                                            'Eliminado',
                                            'La dirección ha sido eliminada correctamente.',
                                            'success'
                                          )
                                        }
                                      } else {
                                        Swal.fire(
                                          'Acción no permitida',
                                          'Debe haber al menos una dirección registrada.',
                                          'error'
                                        )
                                      }
                                    }}
                                    color="error"
                                    disabled={userData.addresses.length === 1} // 🔹 Desactiva el botón si solo hay una dirección
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Box>
                                <Typography variant="body2">
                                  Número: {address.number}
                                </Typography>
                                <Typography variant="body2">
                                  Ciudad: {address.city}
                                </Typography>
                                <Typography variant="body2">
                                  Estado: {address.state}
                                </Typography>
                                <Typography variant="body2">
                                  País: {address.country}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))
                      ) : (
                        <Typography variant="body2" sx={{ mt: 2 }}>
                          No hay direcciones registradas.
                        </Typography>
                      )}
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Modal para agregar nueva dirección */}
            <ModalNewDireccion
              open={openModal}
              handleClose={handleCloseModal}
              idUser={idUser}
              refreshUserData={fetchUser}
            />

            {/* Modal para agregar nuevo telefono */}
            <ModalNewPhone
              open={openModalPhone}
              handleCloseModalPhone={handleCloseModalPhone}
              idUser={idUser}
              refreshPhoneData={fetchUser}
            />

            {/* Modal para modificar datos del usuario */}
            <ModalUpdateUser
              open={openModalUser}
              handleCloseModalUser={handleCloseModalUser}
              idUser={idUser}
              refreshUserData={fetchUser}
              userData={userData}
            />
            <Button >Modificar Datos </Button>

            {/* Modal para modificar datos del telefono  */}
            <ModalUpdatePhone
              open={openModalPhoneUpdate}
              handleCloseModalPhoneUpdate={handleCloseModalPhoneUpdate}
              refreshUserData={fetchUser}
              selectedPhone={selectedPhone} // 📌 Pasa el teléfono seleccionado
            />
          </Box>
        </>
      )}

      {/* Snackbar para mostrar errores */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </main>
  )
}

export default Perfil
