import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getInstrumentById } from '../../api/instruments'
import { MainWrapper } from '../common/MainWrapper'
import { InstrumentDetailWrapper } from '../common/InstrumentDetailWrapper'
import { Box, Divider, Tooltip, Button, Typography } from '@mui/material'
import { ScreenModal } from '../common/ScreenModal'
import { InstrumentGallery } from '../common/InstrumentGallery'
import { useAppStates } from '../utils/global.context'
import { Si } from '../Images/Si'
import { No } from '../Images/No'
import { InstrumentTerms } from '../common/terms/InstrumentTerms'
import { Loader } from '../common/loader/Loader'
import { MessageDialog } from '../common/MessageDialog'
import '../styles/instrument.styles.css'
import FavoriteIcon from '../common/favorito/FavoriteIcon'
import MyCalendar from '../common/availability/MyCalendar'
import CalendarReserva from '../common/availability/CalendarReseva'
import { flexRowContainer, flexColumnContainer } from '../styles/styleglobal'
import ArrowBack from '../utils/ArrowBack'
import { useAuth } from '../../hook/useAuth'
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
  const { isUser, isUserAdmin } = useAuth()
  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    setIsLoading(true);
    getInstrumentById(id)
      .then((instrument) => {
        setInstrument(instrument); // ya no destructurás porque no es un array
      })
      .catch(() => {
        setInstrument(undefined);
        navigate('/noDisponible');
      });
  }, [id, navigate]);
  
  useEffect(() => {
    if (!instrument?.result) return;
  
    setInstrumentSelected(instrument.result); // 👈 cambio de data a result
    setIsLoading(false);
    if (window) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [instrument]);

  const onClose = () => {
    setShowGallery(false)
  }

  return (
    <main>
      <MainWrapper>
      

        {loading && <Loader title="Cargando detalle del instrumento" />}
        {!loading && (
          <>
            <InstrumentDetailWrapper>
              <ArrowBack/>
              {/*Contenedor de la imagen,de los datos y del iciono de favoritos */}
              <Box
                sx={{
                  ...flexRowContainer,
                  width: '100%',
                  height: '100%'
                }}
              >
                {/* Datos del instrumento */}
                <Box
                  sx={{
                    ...flexColumnContainer,
                    padding: '1rem',
                    margin: 'auto',
                    minHeight: {
                      xs: 'auto',
                      sm: '180px',
                      md: '210px',
                      lg: '340px',
                      xl: '460px'
                    },

                    maxWidth: {
                      xs: '100%',
                      sm: '35%',
                      md: '40%',
                      lg: '45%',
                      xl: '50%'
                    }
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
                      color: 'var(--color-oscuro-suave)',
                      lineHeight: '1.6',
                      fontStyle: 'italic'
                    }}
                  >
                    {instrumentSelected?.description}
                  </Typography>

                  <Divider sx={{ width: '100%', my: 2 }} />

                  {/* Otras características */}
                  {[
                    { label: 'Medida', value: instrumentSelected?.measures },
                    { label: 'Peso', value: instrumentSelected?.formattedWeight },
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
                        color: 'var(--color-suave)',
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
                    ...flexColumnContainer,
                    minHeight: {
                      xs: 'auto',
                      sm: '180px',
                      md: '210px',
                      lg: '240px',
                      xl: '360px'
                    },
                    maxWidth: {
                      xs: '100%',
                      sm: '15%',
                      md: '25%',
                      lg: '20%',
                      xl: '30%'
                    },
                    margin:1
                  }}
                >
                  
                  {/* Nombre del instrumento */}
                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: {
                        xs: '0.7rem',
                        sm: '0.8rem',
                        md: '1rem',
                        lg: '1.1rem',
                        xl: '1.5rem'
                      }, 
                      textAlign: 'center',
                      fontWeight: 'bold', 
                      textTransform: 'uppercase', 
                      letterSpacing: '2px', 
                      textShadow: '2px 2px 5px rgba(0,0,0,0.2)', 
                      padding: 1,
                      width: 'fit-content', 
                      margin: '0 auto'
                    }}
                  >
                    {instrumentSelected?.name}
                  </Typography>
                  {/* Fin Nombre del instrumento */}

                  <Tooltip title="Ver más imágenes">
                    <Button
                      onClick={() => setShowGallery(true)}
                      disableRipple
                      disableElevation
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
                          width: '100%', 
                          height: 'auto',
                          objectFit: 'contain',
                          display: 'block',
                          borderRadius: '8px',
                      
                          mixBlendMode: 'multiply'
                      
                          
                        }}
                      />
                    </Button>
                  </Tooltip>

                  {/* 📌 Icono de favorito si el usuario está autenticado */}
                  {isUser && (
                    <Box>
                      <FavoriteIcon />
                    </Box>
                  )}
                  {/* 📌 Fin  Icono de favorito si el usuario está autenticado */}
                </Box>
                {/*Fin imagen de instrumento */}
              </Box>
              {/* Fin Contenedor de la imagen,de los datos y del iciono de favoritos */}

              {/*Aqui comienzan las caracteristicas*/}
              <Box
                sx={{
                  minWidth: {
                    xs: 'auto',
                    sm: '70%',
                    md: '80%',
                    lg: '99%'
                  },
                  boxShadow:
                    ' rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset',
                  padding: 1,
                  borderRadius: 2
                }}
              >
                <Divider />
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: {
                      xs: '0.8rem',
                      sm: '0.9rem',
                      md: '1rem',
                      lg: '1.1rem',
                      xl: '1.2rem'
                    },
                    fontWeight: 'bold',

                    letterSpacing: '1px', 
                    textTransform: 'uppercase', 
                    mb: 2, 
                    textAlign: 'center',
                    fontStyle: 'italic' 
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
                      xs: '100%', 
                      sm: '450px', 
                      md: '650px', 
                      lg: '1200px', 
                      xl: '1400px' 
                    },
                    padding: '2rem',
                    borderRadius: '12px',
                    backgroundColor: 'var(--background-color)',
                    boxShadow: '4px 4px 12px rgba(0,0,0,0.1)',
                    textAlign: 'center',
                    transition: 'all 0.3s ease-in-out', 
                    '&:hover': {
                      boxShadow: '6px 6px 14px rgba(0,0,0,0.2)' 
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
                      color: '#333', 
                      letterSpacing: '1px', 
                      textTransform: 'uppercase', 
                      mb: 2 
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
                     
                      overflow: 'hidden',
                      backgroundColor: 'var(--background-color)',
                      boxShadow: '2px 2px 8px rgba(0,0,0,0.15)' 
                    }}
                  >
                    <MyCalendar instrument={instrument} />
                  </Box>
                </Box>
              )}
              {/*Fin del calendario ADMIN*/}

              {/* 📌 Sección para el usuario */}
              
              {/* 📌 Contenedor del Calendario */}
              {isUser && (
                <Box
                  sx={{
                    width: '100%',

                    padding: '1.5rem',
                    gap: '1.5rem',
                    backgroundColor: 'var(--background-color)',
                    borderRadius: '12px', 
                    boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.1)', 
                  

                    height: {
                      xs: '800px',
                      sm: '810px',
                      md: '8100px',
                      lg: '820px',
                      xl: '850px'
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
                      margin: 2
                    }}
                  >
                    Valor por día:{' '}
                    <span
                      style={{ color: 'var(--color-azul)', fontWeight: 'bold' }}
                    >
                      $ {instrumentSelected?.rentalPrice}
                    </span>
                  </Typography>
                  {/* 🔹Fin  Precio por día */}

                  <CalendarReserva instrument={instrument} />
                </Box>
              )}
              {/* 📌 Fin Contenedor del Calendario */}

              {/* 📌 Términos del Instrumento */}
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                 
                }}
              >
                <Divider sx={{ width: '100%' }} />
                <InstrumentTerms />
              </Box>
              <ArrowBack/>
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
