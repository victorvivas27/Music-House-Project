import { useEffect, useState } from 'react'
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
  useMediaQuery,
  Stack,
  Skeleton
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
import { MainWrapper, ParagraphResponsive, TitleResponsive } from '@/components/styles/ResponsiveComponents'
import { flexRowContainer, fontSizeResponsi } from '@/components/styles/styleglobal'
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
  const avatarLoaded = useImageLoader(userData?.picture, 500)

  const isMobile = useMediaQuery('(max-width:600px)')

  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => setOpenModal(false)

  const handleOpenModalPhone = () => setOpenModalPhone(true)
  const handleCloseModalPhone = () => setOpenModalPhone(false)

  const handleOpenModalUser = () => setOpenModalUser(true)
  const handleCloseModalUser = () => setOpenModalUser(false)

  const handleOpenModalPhoneUpdate = (phone) => {
    setSelectedPhone(phone)
    setOpenModalPhoneUpdate(true)
  }

  const handleCloseModalPhoneUpdate = () => {
    setOpenModalPhoneUpdate(false)
    setSelectedPhone(null)
  }

  const handleOpenModalDireccionUpdate = (address) => {
    setSelectedDireccion(address)
    setOpenModalDireccionUpdate(true)
  }

  const handleCloseModalDireccionUpdate = () => {
    setOpenModalDireccionUpdate(false)
    setSelectedDireccion(null)
  }

  const fetchUser = async () => {
    if (!idUser) return

    try {
      const response = await UsersApi.getUserById(idUser)

      if (response?.result) {
        setUserData(response.result)
      } else {
        setError(`❌ ${getErrorMessage(error)}`)
        setOpenSnackbar(true)
      }
    } catch (err) {
      setError(`❌ ${getErrorMessage(error)}`)
      setOpenSnackbar(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [idUser])

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  if (loading) return <Loader title="Un momento por favor..." />

  return (
    <MainWrapper
      sx={{
        marginLeft: {
          xs: '1%',
          sm: '8%',
          md: '3%',
          lg: '3%',
          xl: '3%'
        }
      }}
    >
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: 'var(--box-shadow)',
          width: {
            xs: '95%',
            sm: '85%',
            md: '90%',
            lg: '90%',
            xl: '90%'
          }
        }}
      >
        <CardContent>
          {/* Encabezado con Avatar y Email */}
          <Box
            display="flex"
            alignItems="center"
            flexDirection={isMobile ? 'column' : 'row'}
            gap={2}
          >
            <Tooltip title="Editar tus datos">
              <Stack spacing={1}>
                {!avatarLoaded && (
                  <Skeleton
                    variant="circular"
                    width={isMobile ? 70 : 90}
                    height={isMobile ? 70 : 90}
                    sx={{
                      bgcolor: 'var(--color-primario)',
                      animation: 'pulse 1.5s ease-in-out infinite'
                    }}
                  />
                )}

                {avatarLoaded && (
                  <Avatar
                    sx={{
                      width: isMobile ? 70 : 90,
                      height: isMobile ? 70 : 90
                    }}
                    onClick={handleOpenModalUser}
                    src={userData?.picture || undefined}
                  >
                    {!userData?.picture && userData?.name?.[0]}
                  </Avatar>
                )}
              </Stack>
            </Tooltip>

            <Box>
              <TitleResponsive sx={{ color: 'var(--texto-inverso-black)' }}>
                {userData?.name || 'Nombre no disponible'}{' '}
                {userData?.lastName || ''}
              </TitleResponsive>

              <Box display="flex" alignItems="center">
                <EmailIcon sx={{ color: 'var(--color-azul)', mr: 1 }} />
                <ParagraphResponsive>
                  {userData?.email || 'Correo no disponible'}
                </ParagraphResponsive>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Teléfono */}

          <Box>
            <Box
              sx={{
                ...flexRowContainer
              }}
            >
              <Tooltip title="Agregar un nuevo telefono">
                <IconButton onClick={handleOpenModalPhone}>
                  <AddIcon
                    sx={{
                      backgroundColor: 'ButtonShadow',
                      borderRadius: 20,
                      color: 'var(--color-secundario)',
                      ...fontSizeResponsi
                    }}
                  />
                </IconButton>
              </Tooltip>
              <PhoneIcon
                sx={{
                  color: 'var(--color-exito)',
                  ...fontSizeResponsi
                }}
              />
              <TitleResponsive sx={{ color: 'var(--texto-inverso-black)' }}>
                Telefonos:
              </TitleResponsive>
            </Box>

            <Box
              sx={{
                ...flexRowContainer,
                justifyContent: 'space-evenly'
              }}
            >
              {userData?.phones?.length > 0 ? (
                userData.phones.map((phone) => {
                  return (
                    <Box key={phone.idPhone}>
                      <Card
                        sx={{
                          boxShadow: 'var(--box-shadow)',
                          borderRadius: '8px',
                          margin: 1
                        }}
                      >
                        <CardContent>
                          <Box sx={{ ...flexRowContainer }}>
                            {/* 📌 Número de teléfono clickeable para llamadas */}
                            <ParagraphResponsive>
                              <a
                                href={`tel:${phone.phoneNumber}`}
                                style={{
                                  textDecoration: 'none',
                                  color: 'var(--color-azul)'
                                }}
                              >
                                {phone.phoneNumber}
                              </a>
                            </ParagraphResponsive>

                            <Box>
                              {/* Botón de editar */}
                              <IconButton
                                onClick={() =>
                                  handleOpenModalPhoneUpdate(phone)
                                }
                              >
                                <EditIcon
                                  sx={{
                                    color: 'var(--color-primario)'
                                  }}
                                />
                              </IconButton>

                              {/* Botón de eliminar con confirmación */}
                              <IconButton
                                onClick={async () => {
                                  if (userData.phones.length > 1) {
                                    const isConfirmed = await showConfirm(
                                      '¿Estás seguro?',
                                      'Esta acción eliminará el teléfono.'
                                    )

                                    if (isConfirmed) {
                                      await removePhone(phone.idPhone)
                                      await fetchUser()
                                      showSuccess(
                                        'Eliminado',
                                        'El teléfono ha sido eliminado correctamente.'
                                      )
                                    }
                                  }
                                }}
                                color="error"
                                disabled={userData.phones.length === 1}
                                sx={{
                                  opacity:
                                    userData.phones.length === 1 ? 0.5 : 1,
                                  cursor:
                                    userData.phones.length === 1
                                      ? 'not-allowed'
                                      : 'pointer'
                                }}
                              >
                                <DeleteIcon
                                  sx={{
                                    color:
                                      userData.phones.length === 1
                                        ? 'gray'
                                        : 'var(--color-error)'
                                  }}
                                />
                              </IconButton>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Box>
                  )
                })
              ) : (
                <Typography variant="body2" sx={{ mt: 2 }}>
                  No hay teléfonos registrados.
                </Typography>
              )}
            </Box>
          </Box>
          <Divider sx={{ my: 4 }} />
          {/* Sección de Direcciones con Grid */}
          <Box>
            <Box
              sx={{
                ...flexRowContainer
              }}
            >
              <Tooltip title="Agregar nueva dirección">
                <IconButton onClick={handleOpenModal}>
                  <AddIcon
                    sx={{
                      backgroundColor: 'ButtonShadow',
                      borderRadius: 20,
                      color: 'var(--color-secundario)',
                      ...fontSizeResponsi
                    }}
                  />
                </IconButton>
              </Tooltip>
              <HomeIcon
                sx={{
                  color: 'var(--color-primario)',
                  ...fontSizeResponsi
                }}
              />
              <TitleResponsive sx={{ color: 'var(--texto-inverso-black)' }}>
                Direcciones:
              </TitleResponsive>
            </Box>

            <Box
              sx={{
                ...flexRowContainer,
                justifyContent: 'space-evenly'
              }}
            >
              {userData?.addresses?.length > 0 ? (
                userData.addresses.map((address) => (
                  <Box key={address.idAddress}>
                    <Card
                      sx={{
                        boxShadow: 'var(--box-shadow)',
                        borderRadius: '8px',
                        margin: 1
                      }}
                    >
                      <CardContent>
                        <Box sx={{ ...flexRowContainer }}>
                          <TitleResponsive
                            sx={{ color: 'var(--texto-inverso-black)' }}
                          >
                            {address.street}
                          </TitleResponsive>
                          {/* Botón de editar */}
                          <IconButton
                            onClick={() => {
                              handleOpenModalDireccionUpdate(address)
                            }}
                          >
                            <EditIcon sx={{ color: 'var(--color-primario)' }} />
                          </IconButton>
                          {/* Botón de eliminar con confirmación */}
                          <IconButton
                            onClick={async () => {
                              if (userData.addresses.length > 1) {
                                const isConfirm = await showConfirm(
                                  '¿Estás seguro?',
                                  'Esta acción eliminará la dirección de forma permanente.'
                                )

                                if (isConfirm) {
                                  await removeAddress(address.idAddress)
                                  await fetchUser()
                                  showSuccess(
                                    'Eliminado',
                                    'La dirección ha sido eliminada correctamente.'
                                  )
                                }
                              }
                            }}
                            color="error"
                            disabled={userData.addresses.length === 1}
                            sx={{
                              opacity:
                                userData.addresses.length === 1 ? 0.5 : 1,
                              cursor:
                                userData.addresses.length === 1
                                  ? 'not-allowed'
                                  : 'pointer'
                            }}
                          >
                            <DeleteIcon
                              sx={{
                                color:
                                  userData.addresses.length === 1
                                    ? 'gray'
                                    : 'var(--color-error)'
                              }}
                            />
                          </IconButton>
                        </Box>
                        <ParagraphResponsive>
                          <strong>Número:</strong>{' '}
                          <em
                            style={{
                              fontStyle: 'italic',
                              fontWeight: 'inherit'
                            }}
                          >
                            {address.number}
                          </em>
                        </ParagraphResponsive>

                        <ParagraphResponsive>
                          <strong> Ciudad:</strong>{' '}
                          <em
                            style={{
                              fontFamily: 'italica',
                              fontWeight: 'inherit'
                            }}
                          >
                            {address.city}
                          </em>
                        </ParagraphResponsive>

                        <ParagraphResponsive>
                          <strong> Estado:</strong>{' '}
                          <em
                            style={{
                              fontFamily: 'italica',
                              fontWeight: 'inherit'
                            }}
                          >
                            {address.state}
                          </em>
                        </ParagraphResponsive>

                        <ParagraphResponsive>
                          <strong> País:</strong>{' '}
                          <em
                            style={{
                              fontFamily: 'italica',
                              fontWeight: 'inherit'
                            }}
                          >
                            {address.country}
                          </em>
                        </ParagraphResponsive>
                      </CardContent>
                    </Card>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" sx={{ mt: 2 }}>
                  No hay direcciones registradas.
                </Typography>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

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

      {/* Modal para modificar datos del telefono  */}
      <ModalUpdatePhone
        open={openModalPhoneUpdate}
        handleCloseModalPhoneUpdate={handleCloseModalPhoneUpdate}
        refreshUserData={fetchUser}
        selectedPhone={selectedPhone} // 📌 Pasa el teléfono seleccionado
      />
      {/* Modal para modificar datos de la direccion*/}
      <ModalUpdateDireccion
        open={openModalDireccionUpdate}
        handleCloseModalDireccionUpdate={handleCloseModalDireccionUpdate}
        refreshUserData={fetchUser}
        selectedDireccion={selectedDireccion}
      />

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
    </MainWrapper>
  )
}

export default Perfil
