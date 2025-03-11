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
      <MainWrapper sx={{ alignItems: 'center', position: 'relative' }}>
        {/*<Typography variant="h2" sx={{ color: 'red', textAlign: 'center' }}>
          {isUserAdmin ? 'ADMIN' : isUser ? 'USER' : 'No autenticado'}
        </Typography>*/}

        {loading && <Loader title="Cargando detalle del instrumento" />}
        {!loading && (
          <>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' },
                textAlign: 'center',
                fontWeight: 'lighter',
                paddingTop: '2rem',
                paddingBottom: '3rem'
              }}
            >
              {instrumentSelected?.name}
            </Typography>

            {/* Aqui datos del instrumento */}
            <InstrumentDetailWrapper>
              <Box
                sx={{
                  width: { xs: '100%', md: '40%' },
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  minHeight: '15rem'
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: 'left',
                    fontWeight: 'lighter'
                  }}
                >
                  {instrumentSelected?.description}
                </Typography>
                <Divider />
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: 'left',
                    fontWeight: 'lighter'
                  }}
                >
                  Medida: {instrumentSelected?.measures}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: 'left',
                    fontWeight: 'lighter'
                  }}
                >
                  Peso: {instrumentSelected?.weight}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: 'left',
                    fontWeight: 'lighter'
                  }}
                >
                  Tipo: {instrumentSelected?.category?.categoryName}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: 'left',
                    fontWeight: 'lighter'
                  }}
                >
                  Temática: {instrumentSelected?.theme?.themeName}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: {
                    xs: '100%',
                    md: '40%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center'
                  },
                  cursor: 'pointer',
                  borderRadius: '.625rem'
                }}
              >
                <Box>
                  <Tooltip title="Ver más imágenes">
                    <Button
                      onClick={() => setShowGallery(true)}
                      sx={{
                        backgroundColor: 'white',
                        ':hover': { backgroundColor: 'white' },
                        borderRadius: '.625rem'
                      }}
                    >
                      <img
                        className="instrument-image"
                        src={
                          instrumentSelected?.imageUrls?.length &&
                          instrumentSelected.imageUrls[0].imageUrl
                        }
                        alt={instrumentSelected?.name}
                        style={{ objectFit: 'cover', padding: 20 }}
                      />
                    </Button>
                  </Tooltip>
                  {/* Icono de favorito si el usuario está autenticado */}
                  {isUser && (
                    <Box sx={{ position: 'relative' }}>
                      <FavoriteIcon />
                    </Box>
                  )}
                </Box>
              </Box>
            </InstrumentDetailWrapper>

            {/*Aqui comienzan las caracteristicas*/}
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Divider />
              <Typography
                variant="h5"
                sx={{ textAlign: 'center', fontWeight: '300', padding: '1rem' }}
              >
                Características
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  paddingBottom: '1rem',
                  width: '100%',
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
                        <Si className="instrument-characteristic-text" />
                      ) : (
                        <No className="instrument-characteristic-text" />
                      )}
                    </Box>
                  )
                })}
              </Box>
            </Box>

            {/*Aqui comienza el calendario */}
            {isUserAdmin && (
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Divider />
                <Typography
                  variant="h5"
                  sx={{
                    textAlign: 'center',
                    fontWeight: '300',
                    padding: '1rem'
                  }}
                >
                  <div className="container mx-auto p-4">
                    <h1 className="text-2xl font-bold mb-4">
                      Calendario de Disponibilidad
                    </h1>
                    <MyCalendar instrument={instrument} />
                  </div>
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    paddingBottom: '1rem',
                    width: '100%',
                    justifyContent: 'center'
                  }}
                ></Box>
              </Box>
            )}

            {isUser && (
              <>
                <Box
                  sx={{
                    width: '100%',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '1rem'
                  }}
                >
                  <Divider sx={{ width: '100%' }} />
                  <Box
                    sx={{
                      border: '1px solid black',
                      borderRadius: '1rem',
                      width: { xs: '100%', md: '50%' },
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}
                  >
                    <Box sx={{ width: '100%', padding: '1rem', flexGrow: 1 }}>
                      <Typography
                        variant="h5"
                        sx={{
                          textAlign: 'center',
                          fontWeight: 'lighter'
                        }}
                      >
                        Valor día: $ {instrumentSelected?.rentalPrice}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: '100%',
                        padding: '1rem',
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <CalendarReserva instrument={instrument} />
                    </Box>
                    <Box
                      sx={{
                        flexGrow: 1,
                        cursor: 'pointer',
                        padding: '1rem',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center'
                      }}
                    >
                      
                       
                      
                    </Box>
                  </Box>
                  <Box sx={{ width: '100%' }}>
                    <Divider sx={{ width: '100%' }} />
                    <InstrumentTerms />
                  </Box>
                </Box>
              </>
            )}
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
      <ScreenModal isOpen={showGallery} onClose={onClose} >
        <InstrumentGallery itemData={instrumentSelected?.imageUrls} />
      </ScreenModal>
    </main>
  )
}
