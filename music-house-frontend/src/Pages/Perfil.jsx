import { useCallback, useEffect, useState } from 'react'
import {
  Avatar,
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Snackbar,
  Alert,
  Tooltip,
  IconButton,
  Stack,
  Skeleton,
  Grid
} from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import HomeIcon from '@mui/icons-material/Home'

import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useAuth } from '@/hook/useAuth'
import useAlert from '@/hook/useAlert'
import useImageLoader from '@/hook/useImageLoader'
import { UsersApi } from '@/api/users'
import { getErrorMessage } from '@/api/getErrorMessage'
import { Loader } from '@/components/common/loader/Loader'
import { removePhone } from '@/api/phones'
import { removeAddress } from '@/api/addresses'
import ModalNewDireccion from '@/components/common/nuevadireccion/ModalNewDireccion'
import ModalNewPhone from '@/components/common/nuevontelefono/ModalNewPhone'
import ModalUpdateUser from '@/components/common/modificardatosuser/ModalUpdateUser'
import ModalUpdatePhone from '@/components/common/nuevontelefono/ModalUpdatePhone'
import ModalUpdateDireccion from '@/components/common/nuevadireccion/ModalUpdateDireccion'

const Perfil = () => {
  const { idUser } = useAuth()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [openModalPhone, setOpenModalPhone] = useState(false)
  const [openModalUser, setOpenModalUser] = useState(false)
  const [openModalPhoneUpdate, setOpenModalPhoneUpdate] = useState(false)
  const [openModalDireccionUpdate, setOpenModalDireccionUpdate] =
    useState(false)
  const [selectedPhone, setSelectedPhone] = useState(null)
  const [selectedDireccion, setSelectedDireccion] = useState(null)
  const { showSuccess, showConfirm } = useAlert()
  const avatarLoaded = useImageLoader(userData?.picture, 1500)

  const fetchUser = useCallback(async () => {
    if (!idUser) return
    try {
      const response = await UsersApi.getUserById(idUser)
      if (response?.result) setUserData(response.result)
      else throw new Error()
    } catch (err) {
      setError(`❌ ${getErrorMessage(error)}`)
      setOpenSnackbar(true)
    } finally {
      setLoading(false)
    }
  }, [idUser, error])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  if (loading) return <Loader title="Un momento por favor..." />

  return (
    <Box sx={{ p: 3, marginTop: 40 }}>
      <Card sx={{ borderRadius: 4, boxShadow: 'var(--box-shadow)', p: 2 }}>
        <CardContent>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            alignItems="center"
          >
            {avatarLoaded ? (
              <Tooltip title="Editar tus datos">
                <Avatar
                  src={userData?.picture || undefined}
                  sx={{ width: 90, height: 90, cursor: 'pointer' }}
                  onClick={() => setOpenModalUser(true)}
                >
                  {!userData?.picture && userData?.name?.[0]}
                </Avatar>
              </Tooltip>
            ) : (
              <Skeleton variant="circular" width={90} height={90} />
            )}

            <Box>
              <Typography variant="h5">
                {userData?.name} {userData?.lastName}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <EmailIcon fontSize="small" color="primary" />
                <Typography variant="body2">{userData?.email}</Typography>
              </Stack>
            </Box>
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Teléfonos */}
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <PhoneIcon color="success" />
              <Typography variant="h6">Teléfonos</Typography>
              <IconButton
                onClick={() => setOpenModalPhone(true)}
                color="secondary"
              >
                <AddIcon />
              </IconButton>
            </Stack>

            <Grid container spacing={2}>
              {userData?.phones?.length > 0 ? (
                userData.phones.map((phone) => (
                  <Grid item xs={12} sm={6} md={4} key={phone.idPhone}>
                    <Card sx={{ p: 2 }}>
                      <Stack
                        justifyContent="space-between"
                        direction="row"
                        alignItems="center"
                      >
                        <a
                          href={`tel:${phone.phoneNumber}`}
                          style={{ textDecoration: 'none', color: '#1976d2' }}
                        >
                          {phone.phoneNumber}
                        </a>
                        <Stack direction="row" spacing={1}>
                          <IconButton
                            onClick={() => {
                              setSelectedPhone(phone)
                              setOpenModalPhoneUpdate(true)
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={async () => {
                              if (userData.phones.length > 1) {
                                const confirm = await showConfirm(
                                  '¿Estás seguro?',
                                  'Esta acción eliminará el teléfono.'
                                )
                                if (confirm) {
                                  await removePhone(phone.idPhone)
                                  await fetchUser()
                                  showSuccess(
                                    'Eliminado',
                                    'Teléfono eliminado.'
                                  )
                                }
                              }
                            }}
                            disabled={userData.phones.length === 1}
                          >
                            <DeleteIcon
                              color={
                                userData.phones.length === 1
                                  ? 'disabled'
                                  : 'error'
                              }
                            />
                          </IconButton>
                        </Stack>
                      </Stack>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography variant="body2">
                  No hay teléfonos registrados.
                </Typography>
              )}
            </Grid>
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Direcciones */}
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <HomeIcon color="primary" />
              <Typography variant="h6">Direcciones</Typography>
              <IconButton onClick={() => setOpenModal(true)} color="secondary">
                <AddIcon />
              </IconButton>
            </Stack>

            <Grid container spacing={2}>
              {userData?.addresses?.length > 0 ? (
                userData.addresses.map((address) => (
                  <Grid item xs={12} sm={6} md={4} key={address.idAddress}>
                    <Card sx={{ p: 2 }}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {address.street}, {address.number}
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
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          <IconButton
                            onClick={() => {
                              setSelectedDireccion(address)
                              setOpenModalDireccionUpdate(true)
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={async () => {
                              if (userData.addresses.length > 1) {
                                const confirm = await showConfirm(
                                  '¿Estás seguro?',
                                  'Eliminarás esta dirección.'
                                )
                                if (confirm) {
                                  await removeAddress(address.idAddress)
                                  await fetchUser()
                                  showSuccess(
                                    'Eliminado',
                                    'Dirección eliminada.'
                                  )
                                }
                              }
                            }}
                            disabled={userData.addresses.length === 1}
                          >
                            <DeleteIcon
                              color={
                                userData.addresses.length === 1
                                  ? 'disabled'
                                  : 'error'
                              }
                            />
                          </IconButton>
                        </Stack>
                      </Stack>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography variant="body2">
                  No hay direcciones registradas.
                </Typography>
              )}
            </Grid>
          </Stack>
        </CardContent>
      </Card>

      {/* Modales */}
      <ModalNewDireccion
        open={openModal}
        handleClose={() => setOpenModal(false)}
        idUser={idUser}
        refreshUserData={fetchUser}
      />
      <ModalNewPhone
        open={openModalPhone}
        handleCloseModalPhone={() => setOpenModalPhone(false)}
        idUser={idUser}
        refreshPhoneData={fetchUser}
      />
      <ModalUpdateUser
        open={openModalUser}
        handleCloseModalUser={() => setOpenModalUser(false)}
        idUser={idUser}
        refreshUserData={fetchUser}
        userData={userData}
      />
      <ModalUpdatePhone
        open={openModalPhoneUpdate}
        handleCloseModalPhoneUpdate={() => setOpenModalPhoneUpdate(false)}
        refreshUserData={fetchUser}
        selectedPhone={selectedPhone}
      />
      <ModalUpdateDireccion
        open={openModalDireccionUpdate}
        handleCloseModalDireccionUpdate={() =>
          setOpenModalDireccionUpdate(false)
        }
        refreshUserData={fetchUser}
        selectedDireccion={selectedDireccion}
      />

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="error" onClose={() => setOpenSnackbar(false)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Perfil
