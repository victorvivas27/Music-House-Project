import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getInstrumentById } from '../../api/instruments'
import { MainWrapper } from '../common/MainWrapper'
import { InstrumentDetailWrapper } from '../common/InstrumentDetailWrapper'
import { Box, Divider, Tooltip, Button, Typography } from '@mui/material'
import { ScreenModal } from '../common/ScreenModal'
import { InstrumentGallery } from '../common/InstrumentGallery'
import { useAppStates } from '../utils/global.context'
import { useAuthContext } from '../utils/context/AuthGlobal'
import { Si } from '../Images/Si'
import { No } from '../Images/No'
import { InstrumentTerms } from '../common/terms/InstrumentTerms'
import { Loader } from '../common/loader/Loader'
import { MessageDialog } from '../common/MessageDialog'
import '../styles/instrument.styles.css'
import FavoriteIcon from '../common/favorito/FavoriteIcon'
import MyCalendar from '../common/availability/MyCalendar'
import CalendarReserva from '../common/availability/CalendarReseva'
export const Instrument = () => {
  const { id } = useParams()
  const { state } = useAppStates()
  const navigate = useNavigate()
  const [loading, setIsLoading] = useState(true)
  const [instrumentSelected, setInstrumentSelected] = useState({
    characteristics: {}
  })
  const [instrument, setInstrument] = useState()
  const [showGallery, setShowGallery] = useState(false)
  const { isUser, isUserAdmin } = useAuthContext()
  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    getInstrumentById(id)
      .then(([instrument]) => {
        setInstrument(instrument)
      })
      .catch(() => {
        setInstrument(undefined)
        navigate('/noDisponible')
      })
  }, [id, navigate])

  useEffect(() => {
    if (!instrument?.data) return

    setInstrumentSelected(instrument.data)
    setIsLoading(false)
    if (window) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [instrument])

  const onClose = () => {
    setShowGallery(false)
  }

  return (
    <main>
      <MainWrapper>
        {/*<Typography variant="h2" sx={{ color: 'red', textAlign: 'center' }}>
          {isUserAdmin ? 'ADMIN' : isUser ? 'USER' : 'No autenticado'}
        </Typography>*/}

        {loading && <Loader title="Cargando detalle del instrumento" />}
        {!loading && (
          <>
            <InstrumentDetailWrapper>
              {/*Imagen del instrumento  instrumento */}
              <Box
                sx={{
                  display: 'flex',
                  //flexDirection: { xs: 'column', md: 'row' }, // 📌 En móviles en columna, en desktop lado a lado
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '7px solid rgb(53, 203, 27)',
                  borderRadius: '.625rem',

                  minWidth: {
                    xs: '95%',
                    sm: '1000px',
                    md: '1100px',
                    lg: '1500px'
                  }, // 📌 Ajusta en cada tamaño de pantalla
                  width: '100%', // 📌 Permite que el ancho sea dinámico

                  flexWrap: 'wrap' // 📌 Evita desbordamientos en pantallas medianas
                }}
              >
                {/* Datos del instrumento */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '12px', // 🔹 Bordes más suaves
                    backgroundColor: 'rgba(245, 245, 245, 0.8)', // 🎨 Color neutro con ligera transparencia
                    boxShadow: '3px 3px 8px rgba(0, 0, 0, 0.1)', // 🔹 Sombra sutil para profundidad
                    padding: '1.5rem',
                    minHeight: {
                      xs: 'auto',
                      sm: '160px',
                      md: '190px',
                      lg: '220px'
                    },
                    maxWidth: {
                      xs: '95%', // 📌 Se adapta mejor en móviles
                      sm: '85%', // 📌 Más compacto en tablets
                      md: '70%', // 📌 Mejor ajuste en laptops
                      lg: '55%' // 📌 Tamaño ideal en pantallas grandes
                    },
                    width: '100%',
                    margin: 'auto'
                  }}
                >
                  {/* Descripción */}
                  <Typography
                    sx={{
                      textAlign: 'center',
                      fontWeight: '400',
                      fontSize: {
                        xs: '1rem',
                        sm: '1.1rem',
                        md: '1.2rem',
                        lg: '1.3rem'
                      },
                      color: '#333', // 🎨 Color oscuro suave
                      lineHeight: '1.6', // 🔹 Mejora la legibilidad
                      fontStyle: 'italic' // 🔹 Agrega un toque más refinado
                    }}
                  >
                    {instrumentSelected?.description}
                  </Typography>

                  <Divider sx={{ width: '100%', my: 2, bgcolor: '#ccc' }} />

                  {/* Otras características */}
                  {[
                    { label: 'Medida', value: instrumentSelected?.measures },
                    { label: 'Peso', value: instrumentSelected?.weight },
                    {
                      label: 'Tipo',
                      value: instrumentSelected?.category?.categoryName
                    },
                    {
                      label: 'Temática',
                      value: instrumentSelected?.theme?.themeName
                    }
                  ].map(({ label, value }, index) => (
                    <Typography
                      key={index}
                      variant="h6"
                      sx={{
                        textAlign: 'center',
                        fontWeight: '300',
                        fontSize: {
                          xs: '0.9rem',
                          sm: '1rem',
                          md: '1.1rem'
                        },
                        color: '#444', // 🎨 Un tono más oscuro para mejor contraste
                        padding: '0.3rem 0'
                      }}
                    >
                      <strong>{label}:</strong> {value}
                    </Typography>
                  ))}
                </Box>
                {/* Fin Datos del instrumento */}

                {/*Comienzo Imagen del instrumento */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',

                    maxWidth: 900,
                    alignItems: 'center',
                    border: '7px solid rgb(41, 167, 43)'
                  }}
                >
                  {/* Nombre del instrumento */}
                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: {
                        xs: '1rem',
                        sm: '0.7rem',
                        md: '0.9rem',
                        lg: '1rem',
                        xl: '1.5rem'
                      }, // 📌 Tamaños más impactantes
                      textAlign: 'center',
                      fontWeight: 'bold', // 📌 Mayor impacto visual
                      color: 'rgb(15, 15, 15)', // 🔥 Color llamativo
                      textTransform: 'uppercase', // 🔹 Convierte en mayúsculas
                      letterSpacing: '2px', // 🔹 Espaciado entre letras para más elegancia
                      textShadow: '2px 2px 5px rgba(0,0,0,0.2)', // 🔹 Sombra para más profundidad
                      padding: 1,
                      borderRadius: '8px', // 🔹 Bordes redondeados
                      // border: '4px solid rgba(240, 206, 14, 0.8)', // 🔹 Borde más fino y con transparencia
                      // background:
                      // 'linear-gradient(135deg, rgba(163, 203, 42, 0.2), rgba(246, 255, 69, 0.4))', // 🔥 Efecto degradado para hacerlo más atractivo
                      width: 'fit-content', // 📌 Se ajusta al contenido
                      margin: '0 auto' // 📌 Centra horizontalmente
                    }}
                  >
                    {instrumentSelected?.name}
                  </Typography>
                  {/* Fin Nombre del instrumento */}

                  <Tooltip title="Ver más imágenes">
                    <Button
                      onClick={() => setShowGallery(true)}
                      sx={{
                        backgroundColor: 'white',
                        ':hover': { backgroundColor: 'white' },
                        borderRadius: '.625rem'
                      }}
                    >
                      <Box
                        component="img"
                        src={
                          instrumentSelected?.imageUrls?.length
                            ? instrumentSelected.imageUrls[0].imageUrl
                            : '/images/default-placeholder.png'
                        }
                        alt={instrumentSelected?.name}
                        sx={{
                          width: '100%', // 🔥 Ajusta dinámicamente
                          maxWidth: { xs: '300px', md: '400px' }, // 🔥 Tamaño variable
                          height: 'auto',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          boxShadow: '3px 3px 10px rgba(0,0,0,0.2)',
                          margin: 'auto' // Centra en móviles
                        }}
                      />
                    </Button>
                  </Tooltip>

                  {/* 📌 Icono de favorito si el usuario está autenticado */}
                  {isUser && (
                    <Box sx={{ position: 'relative' }}>
                      <FavoriteIcon />
                    </Box>
                  )}
                </Box>
                {/*Fin imagen de instrumento */}
              </Box>

              {/*Aqui comienzan las caracteristicas*/}
              <Box
                sx={{
                  minWidth: {
                    xs: 'auto',
                    sm: '70%',
                    md: '80%',
                    lg: '98%'
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  border: '7px solid rgb(18, 18, 18)'
                }}
              >
                <Divider />
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: {
                      xs: '1rem',
                      sm: '1.6rem',
                      md: '1rem',
                      lg: '1.4rem',
                      xl: '2rem'
                    },
                    fontWeight: 'bold',
                    color: '#333', // 🎨 Color más elegante
                    letterSpacing: '1px', // 🔹 Mejora la estética del título
                    textTransform: 'uppercase', // 🔹 Hace que el título resalte más
                    mb: 2, // 🔹 Espacio debajo del título
                    textAlign: 'center',
                    fontStyle: 'italic' // 🔹 Agrega un toque más refinado
                  }}
                >
                  Características
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    paddingBottom: '1rem',

                    justifyContent: 'space-evenly'
                  }}
                >
                  {state?.characteristics?.map((characteristic) => {
                    return (
                      <Box
                        key={characteristic.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Tooltip title={characteristic.name}>
                          <img
                            src={characteristic.image}
                            className="instrument-characteristic-image"
                          />
                        </Tooltip>
                        {/* <ArrowLeft className="instrument-characteristic-arrow" />*/}
                        {instrumentSelected?.characteristics[
                          characteristic.id
                        ] === 'si' ? (
                          <Si size={18} color="var(--color-azul)" />
                        ) : (
                          <No size={18} color="var(--color-error)" />
                        )}
                      </Box>
                    )
                  })}
                </Box>
              </Box>
              {/*Fin de las caracteristicas */}

              {/*Inicio del calendario ADMIN*/}
              {isUserAdmin && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    maxWidth: {
                      xs: '100%', // 📌 En móviles, ocupa todo el ancho disponible
                      sm: '450px', // 📌 En tablets pequeñas
                      md: '650px', // 📌 En tablets grandes
                      lg: '1200px', // 📌 En pantallas grandes
                      xl: '1400px' // 📌 En pantallas extra grandes
                    },
                    padding: '2rem',
                    borderRadius: '12px', // 🔹 Bordes más suaves
                    backgroundColor: 'rgba(250, 250, 250, 0.9)', // 🔹 Color neutro con ligera transparencia
                    boxShadow: '4px 4px 12px rgba(0,0,0,0.1)', // 🔹 Sombra sutil
                    textAlign: 'center',
                    transition: 'all 0.3s ease-in-out', // 🔹 Suaviza animaciones
                    '&:hover': {
                      boxShadow: '6px 6px 14px rgba(0,0,0,0.2)' // 🎨 Sombra más pronunciada al pasar el mouse
                    }
                  }}
                >
                  {/* 📌 Título del calendario */}
                  <Typography
                    sx={{
                      fontSize: {
                        xs: '1rem',
                        sm: '1.6rem',
                        md: '1rem',
                        lg: '1.4rem',
                        xl: '2rem'
                      },
                      fontWeight: 'bold',
                      color: '#333', // 🎨 Color más elegante
                      letterSpacing: '1px', // 🔹 Mejora la estética del título
                      textTransform: 'uppercase', // 🔹 Hace que el título resalte más
                      mb: 2 // 🔹 Espacio debajo del título
                    }}
                  >
                    📅 Calendario de Disponibilidad
                  </Typography>

                  {/* 📌 Contenedor del Calendario */}
                  <Box
                    sx={{
                      width: '100%',
                      maxWidth: {
                        xs: '100%',
                        sm: '400px',
                        md: '550px',
                        lg: '850px',
                        xl: '1050px'
                      },
                      height: {
                        xs: '520px',
                        sm: '380px',
                        md: '450px',
                        lg: '500px',
                        xl: '550px'
                      },
                      borderRadius: '10px',
                      border: '4px solid rgba(18, 18, 18, 0.7)',
                      overflow: 'hidden',
                      backgroundColor: 'white', // 🔹 Fondo blanco para mejor contraste
                      boxShadow: '2px 2px 8px rgba(0,0,0,0.15)' // 🔹 Sombra ligera
                    }}
                  >
                    <MyCalendar instrument={instrument} />
                  </Box>
                </Box>
              )}
              {/*Fin del calendario ADMIN*/}

              {/* 📌 Sección para el usuario */}
              {isUser && (
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '1.5rem',
                    gap: '1.5rem',
                    backgroundColor: '#f9f9f9', // 🎨 Fondo sutil
                    borderRadius: '12px', // 🔹 Bordes redondeados
                    boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.1)', // 🔹 Sombra ligera
                    border: '3px solid rgba(0, 0, 0, 0.2)',
                    maxWidth: {
                      xs: '100%',
                      sm: '400px',
                      md: '550px',
                      lg: '850px',
                      xl: '100%'
                    },
                    height: {
                      xs: 'auto',
                      sm: '420px',
                      md: '460px',
                      lg: '520px',
                      xl: 'auto'
                    }
                  }}
                >
                  <Divider sx={{ width: '100%' }} />

                  {/* 🔹 Precio por día */}
                  <Typography
                    variant="h5"
                    sx={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: '#333',
                      marginBottom: '1rem'
                    }}
                  >
                    Valor por día:{' '}
                    <span style={{ color: '#1a73e8', fontWeight: 'bold' }}>
                      $ {instrumentSelected?.rentalPrice}
                    </span>
                  </Typography>

                  {/* 📌 Contenedor del Calendario */}

                  <CalendarReserva instrument={instrument} />
                </Box>
              )}

              {/* 📌 Términos del Instrumento */}
              <Box sx={{ width: '100%' }}>
                <Divider sx={{ width: '100%' }} />
                <InstrumentTerms />
              </Box>
            </InstrumentDetailWrapper>
          </>
        )}
        <MessageDialog
          title="Reservar instrumento"
          isOpen={showMessage}
          buttonText="Ok"
          onClose={() => setShowMessage(false)}
          onButtonPressed={() => setShowMessage(false)}
        />
      </MainWrapper>
      <ScreenModal isOpen={showGallery} onClose={onClose}>
        <InstrumentGallery itemData={instrumentSelected?.imageUrls} />
      </ScreenModal>
    </main>
  )
}
