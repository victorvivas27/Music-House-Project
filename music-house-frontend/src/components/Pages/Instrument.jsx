import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getInstrumentById } from '../../api/instruments'
import { InstrumentDetailWrapper } from '../common/InstrumentDetailWrapper'
import { Box, Divider, Tooltip, Button, Typography } from '@mui/material'
import { ScreenModal } from '../common/ScreenModal'
import { InstrumentGallery } from '../common/InstrumentGallery'
import { useAppStates } from '../utils/global.context'
import { Si } from '../Images/Si'
import { No } from '../Images/No'
import { InstrumentTerms } from '../common/terms/InstrumentTerms'
import { Loader } from '../common/loader/Loader'
import FavoriteIcon from '../common/favorito/FavoriteIcon'
import CalendarReserva from '../common/availability/CalendarReseva'
import { flexRowContainer, flexColumnContainer } from '../styles/styleglobal'
import ArrowBack from '../utils/ArrowBack'
import { useAuth } from '../../hook/useAuth'
import {
  ParagraphResponsive,
  TitleResponsive
} from '../Form/formUsuario/CustomButton'
import CalendarAdmin from '../common/availability/CalendarAdmin'
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

  useEffect(() => {
    setIsLoading(true)
    getInstrumentById(id)
      .then((instrument) => {
        setInstrument(instrument)
      })
      .catch(() => {
        setInstrument(undefined)
        navigate('/noDisponible')
      })
  }, [id, navigate])

  useEffect(() => {
    if (!instrument?.result) return

    setInstrumentSelected(instrument.result)
    setIsLoading(false)
    if (window) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [instrument])

  const onClose = () => {
    setShowGallery(false)
  }
  if (loading) return <Loader title="Cargando instrumentos..." />
  return (
    <>
      <InstrumentDetailWrapper>
        <ArrowBack />
        {/*Contenedor de la imagen,de los datos y del iciono de favoritos */}
        <Box
          sx={{
            ...flexRowContainer,
            justifyContent: 'space-evenly'
          }}
        >
          {/* Datos del instrumento */}
          <Box
            sx={{
              ...flexColumnContainer,
              width: {
                sm: '48%',
                md: '55%',
                lg: '57%',
                xl: '60%'
              }
            }}
          >
            {/* Descripción */}
            <ParagraphResponsive
              sx={{
                color: 'var(--color-oscuro-suave)',
                width: '97%'
              }}
            >
              {instrumentSelected?.description}
            </ParagraphResponsive>

            <Divider sx={{ width: '100%', my: 2 }} />

            {/* Otras características */}
            {[
              { label: 'Medida', value: instrumentSelected?.measures },
              {
                label: 'Peso',
                value: instrumentSelected?.formattedWeight
              },
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
              width: {
                sm: '35%',
                md: '31%',
                lg: '32%',
                xl: '30%'
              },
              margin: 1,
              boxShadow: 'var(--box-shadow)',
              borderRadius: 5
            }}
          >
            {/* Nombre del instrumento */}
            <TitleResponsive
              sx={{
                textAlign: 'center',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '3px',
                textShadow: '2px 2px 5px rgba(0,0,0,0.2)',
                padding: 1
              }}
            >
              {instrumentSelected?.name}
            </TitleResponsive>
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
                    height: 'auto',
                    objectFit: 'contain'
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
            width: {
              sm: '87%',
              md: '88%',
              lg: '89%',
              xl: '90%'
            },

            margin: 1
          }}
        >
          <Divider sx={{ width: '100%' }} />
          <TitleResponsive
            sx={{
              letterSpacing: '1px',
              textTransform: 'uppercase',
              textAlign: 'center'
            }}
          >
            Características
          </TitleResponsive>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-evenly'
            }}
          >
            {state?.characteristics?.map((characteristic) => {
              return (
                <Box
                  key={characteristic.id}
                  sx={{
                    ...flexRowContainer
                  }}
                >
                  <Tooltip title={characteristic.name}>
                    <Box
                      component="img"
                      src={characteristic.image}
                      sx={{
                        width: {
                          xs: '36%',
                          sm: '38%',
                          md: '40%',
                          lg: '42%',
                          xl: '45%'
                        },
                        backgroundColor: 'var(--color-primario)',
                        borderRadius: 4,
                        margin: 1
                      }}
                    />
                  </Tooltip>

                  {instrumentSelected?.characteristics[characteristic.id] ===
                  'si' ? (
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
              width: {
                xs: '100%',
                sm: '69%',
                md: '70%',
                lg: '72%',
                xl: '75%'
              }
            }}
          >
            {/* 📌 Título del calendario */}
            <TitleResponsive
              sx={{
                textTransform: 'uppercase'
              }}
            >
              📅 Calendario para agregar Disponibilidad
            </TitleResponsive>
            <Divider sx={{ width: '100%' }} />

            {/* 📌 Contenedor del Calendario */}
            <Box
              sx={{
                width: {
                  xs: '100%',
                  sm: '69%',
                  md: '70%',
                  lg: '72%',
                  xl: '75%'
                }
              }}
            >
              <CalendarAdmin instrument={instrument} />
            </Box>
          </Box>
        )}
        {/*Fin del calendario ADMIN*/}

        {/* 📌 Sección para el usuario */}

        {/* 📌 Contenedor del Calendario */}
        {isUser && (
          <>
            <Box
              sx={{
                width: {
                  xs: '100%',
                  sm: '69%',
                  md: '70%',
                  lg: '72%',
                  xl: '75%'
                }
              }}
            >
              {/* 🔹 Precio por día */}
              <Typography
                variant="h5"
                sx={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  margin: 2
                }}
              >
                Este instrumento tiene un valor por día de alquiler:{' '}
                <span
                  style={{ color: 'var(--color-azul)', fontWeight: 'bold' }}
                >
                  $ {instrumentSelected?.rentalPrice}
                </span>
              </Typography>
              {/* 🔹Fin  Precio por día */}

              <Divider sx={{ width: '100%' }} />

              <CalendarReserva instrument={instrument} />
            </Box>
            {/* 📌 Fin Contenedor del Calendario */}

            
            {/* 📌 Términos del Instrumento */}
            <Box
              sx={{
                width: '100%',
                height: '100%'
              }}
            >
              <Divider sx={{ width: '100%' }} />
              <InstrumentTerms />
            </Box>
          </>
        )}
            <ScreenModal
             isOpen={showGallery} 
             onClose={onClose}
             
             >
              <InstrumentGallery itemData={instrumentSelected?.imageUrls} />
            </ScreenModal>
      </InstrumentDetailWrapper>
    </>
  )
}
