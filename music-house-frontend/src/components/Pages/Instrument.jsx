import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getInstrumentById } from '../../api/instruments'
import { MainWrapper } from '../common/MainWrapper'
import { InstrumentDetailWrapper } from '../common/InstrumentDetailWrapper'
import { Box, Divider, Tooltip, Button, Typography } from '@mui/material'
import { ScreenModal } from '../common/ScreenModal'
import { InstrumentGallery } from '../common/InstrumentGallery'
import { InstrumentAvailability } from '../common/availability/InstrumentAvailability'
import { useAppStates } from '../utils/global.context'
import { useAuthContext } from '../utils/context/AuthGlobal'
import { ArrowLeft } from '../Images/ArrowLeft'
import { Si } from '../Images/Si'
import { No } from '../Images/No'
import { Favorite } from '@mui/icons-material'
import { FavoriteIconWrapper } from '../common/favorito/FavoriteIcon'
import { InstrumentTerms } from '../common/terms/InstrumentTerms'
import { Loader } from '../common/loader/Loader'
import { DateRangeBooking } from '../common/booking/DateRangeBooking'
import { MessageDialog } from '../common/MessageDialog'
import {
  addFavorite,
  removeFavorite,
  getAllFavorites
} from '../../api/favorites'
import { Code } from '../../api/constants'

import '../styles/instrument.styles.css'
import { actions } from '../utils/actions'

export const Instrument = () => {
  const { id } = useParams()
  const { state, dispatch } = useAppStates()
  const navigate = useNavigate()
  const [loading, setIsLoading] = useState(true)
  const [instrumentSelected, setInstrumentSelected] = useState({
    characteristics: {}
  })
  const [instrument, setInstrument] = useState()
  const [showGallery, setShowGallery] = useState(false)
  const { user, isUser, isUserAdmin } = useAuthContext()
  const [favorites] = getAllFavorites(user?.idUser)
  const [idFavorite, setIdFavorite] = useState()
  const [bookingDateFrom, setBookingDateFrom] = useState()
  const [bookingDateTo, setBookingDateTo] = useState()
  const [isValidBookingRange, setIsValidBookingRange] = useState()
  const [message, setMessage] = useState()
  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    getInstrumentById(id)
      .then(([instrument, _]) => {
        setInstrument(instrument)
      })
      .catch(([_, code]) => {
        setInstrument(undefined)
        navigate('/noDisponible')
      })
  }, [])

  useEffect(() => {
    if (!instrument?.data) return

    setInstrumentSelected(instrument.data)
    setIsLoading(false)
    if (window) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [instrument])

  useEffect(() => {
    if (favorites && favorites.data) {
      const favorite = favorites.data.filter(
        (favorite) => favorite.instrument.idInstrument === Number(id)
      )

      setIdFavorite(favorite && favorite.length > 0 && favorite[0].idFavorite)
    }
  }, [favorites])

  const onClose = () => {
    setShowGallery(false)
  }

  const handleFavoriteClick = () => {
    addFavorite(user.idUser, id)
      .then((response) => {
        setIdFavorite(response.data.idFavorite)
      })
      .catch(([error, code]) => {
        if (code === Code.ALREADY_EXISTS) {
          removeFromFavorites()
        }
      })
  }

  const removeFromFavorites = () => {
    if (!idFavorite) return

    removeFavorite(idFavorite, user.idUser, id)
      .then(() => {
        setIdFavorite(undefined)
      })
      .catch((error) => console.log(error))
  }

  const handleBooking = () => {
    if (!isValidBookingRange) {
      const message =
        !bookingDateFrom && !bookingDateTo
          ? 'No has seleccionado las fechas para reservar'
          : 'Hay días no disponibles en el periodo seleccionado. Modifica las fechas y vuelva a intentarlo'
      setMessage(message)
      setShowMessage(true)
    } else {
      dispatch({
        type: actions.BOOKING_CONFIRM,
        payload: {
          instrument: instrument.data,
          bookingDateFrom,
          bookingDateTo
        }
      })
      navigate('/confirmBooking')
    }
  }

  return (
    <main>
      <MainWrapper sx={{ alignItems: 'center', position: 'relative' }}>
        {loading && <Loader title="Cargando detalle del instrumento" />}
        {!loading && (
          <>
            <Box sx={{ position: 'relative', width: '100%' }}>
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
              {isUser && (
                <Box
                  sx={{
                    display: 'flex',
                    position: 'absolute',
                    top: { xs: '2.7rem', md: '3.5rem' },
                    right: { xs: '0', md: '0' },
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <Tooltip
                    title={
                      !!idFavorite
                        ? 'Remover de favoritos'
                        : 'Agregar a favoritos'
                    }
                  >
                    <FavoriteIconWrapper
                      aria-label="Agregar a favoritos"
                      onClick={handleFavoriteClick}
                      isFavorite={!!idFavorite}
                    >
                      <Favorite sx={{ color: '#000000 !important' }} />
                    </FavoriteIconWrapper>
                  </Tooltip>
                </Box>
              )}
            </Box>
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
                      style={{ objectFit: 'cover' }}
                    />
                  </Button>
                </Tooltip>
              </Box>
            </InstrumentDetailWrapper>
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
                      <ArrowLeft className="instrument-characteristic-arrow" />
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
                Disponibilidad
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  paddingBottom: '1rem',
                  width: '100%',
                  justifyContent: 'center'
                }}
              >
                <InstrumentAvailability id={id} />
              </Box>
            </Box>
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
                {user && !isUserAdmin && (
                  <>
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
                      <DateRangeBooking
                        id={id}
                        setBookingDateFrom={setBookingDateFrom}
                        setBookingDateTo={setBookingDateTo}
                        setIsValidBookingRange={setIsValidBookingRange}
                      />
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
                      <Tooltip title="Reservar">
                        <Button
                          variant="contained"
                          sx={{
                            borderRadius: '1rem',
                            padding: '1.3rem',
                            maxHeight: '4.5rem'
                          }}
                          onClick={handleBooking}
                        >
                          <Typography
                            textAlign="center"
                            sx={{ fontWeight: 'bold' }}
                            variant="h6"
                          >
                            Reservar
                          </Typography>
                        </Button>
                      </Tooltip>
                    </Box>
                  </>
                )}
              </Box>
              <Box sx={{ width: '100%' }}>
                <Divider sx={{ width: '100%' }} />
                <InstrumentTerms />
              </Box>
            </Box>
          </>
        )}
        <MessageDialog
          title="Reservar instrumento"
          message={message}
          isOpen={showMessage}
          buttonText="Ok"
          onClose={() => setShowMessage(false)}
          onButtonPressed={() => setShowMessage(false)}
        />
      </MainWrapper>
      <ScreenModal isOpen={showGallery} onClose={onClose} fullScreen>
        <InstrumentGallery itemData={instrumentSelected?.imageUrls} />
      </ScreenModal>
    </main>
  )
}
