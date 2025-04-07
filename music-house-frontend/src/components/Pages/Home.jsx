import { useEffect, useState } from 'react'
import { Typography } from '@mui/material'
import { useAppStates } from '../utils/global.context'
import { actions } from '../utils/actions'
import { Loader } from '../common/loader/Loader'
import { toast } from 'react-toastify'
import AutoScrollCarousel from '../common/autoScrollCarousel/AutoScrollCarousel'
import { getInstruments } from '@/api/instruments'
import { getTheme } from '@/api/theme'
import { MainWrapper, ProductsWrapper } from '../styles/ResponsiveComponents'
import ProductCard from '../common/instrumentGallery/ProductCard'

export const Home = () => {
  const { state, dispatch } = useAppStates()
  const { searchOptions } = state
  const [selectedInstruments, setSelectedInstruments] = useState([])
  const [loading, setLoading] = useState(true)
  const [instruments, setInstruments] = useState([])

  useEffect(() => {
    const fetchInstruments = async () => {
      setLoading(true)
      try {
        const { result } = await getInstruments()
        setInstruments(result)
      } catch (error) {
        toast.error(error)
      } finally {
        setTimeout(() => setLoading(false), 500)
      }
    }

    fetchInstruments()
  }, [])

  useEffect(() => {
    if (instruments.length > 0) {
      dispatch({ type: actions.UPDATE_INSTRUMENTS, payload: instruments })
      setSelectedInstruments(instruments)
    }
  }, [dispatch, instruments])

  useEffect(() => {
    if (instruments.length > 0) {
      const found = searchOptions.found
        ? instruments.filter((instrument) =>
            searchOptions.found.some(
              (instrumentFound) =>
                instrument.idInstrument === instrumentFound.idInstrument
            )
          )
        : instruments
      setSelectedInstruments(found)

      if (searchOptions.found && window) {
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
      }
    }
  }, [instruments, searchOptions])

  useEffect(() => {
    const fetchTheme = async () => {
      setLoading(true)
      try {
        const data = await getTheme()
        dispatch({ type: actions.SET_THEMES, payload: data.result })
      } catch (error) {
        toast.error(error)
      } finally {
        setTimeout(() => setLoading(false), 500)
      }
    }

    fetchTheme()
  }, [dispatch])
  if (loading) return <Loader title="Un momento por favor..." />

  return (
    <>
      <MainWrapper>
        <AutoScrollCarousel themes={state.themes?.content || []} />
      </MainWrapper>

      <ProductsWrapper>
        {selectedInstruments.length > 0 ? (
          selectedInstruments.map((instrument, index) => (
            <ProductCard
              key={`product-card-${index}`}
              name={instrument.name}
              imageUrl={
                instrument.imageUrls?.length > 0
                  ? instrument.imageUrls[0].imageUrl
                  : '/src/assets/instrumento_general_03.jpg'
              }
              id={instrument.idInstrument}
            />
          ))
        ) : (
          <Typography
            gutterBottom
            variant="h6"
            component="h6"
            textAlign="center"
            sx={{ paddingBottom: 1, fontWeight: 'bold' }}
          >
            No se han encontrado instrumentos
          </Typography>
        )}
      </ProductsWrapper>
    </>
  )
}
