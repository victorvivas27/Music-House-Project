import { useEffect, useState } from 'react'
import { Typography } from '@mui/material'
import { toast } from 'react-toastify'
import { useAppStates } from '@/components/utils/global.context'
import { getInstruments } from '@/api/instruments'
import { actions } from '@/components/utils/actions'
import { getTheme } from '@/api/theme'
import { Loader } from '@/components/common/loader/Loader'
import { MainWrapper, ProductsWrapper } from '@/components/styles/ResponsiveComponents'
import AutoScrollCarousel from '@/components/common/autoScrollCarousel/AutoScrollCarousel'
import ProductCard from '@/components/common/instrumentGallery/ProductCard'


export const Home = () => {
  const { state, dispatch } = useAppStates()
  const { searchOptions } = state
  const [selectedInstruments, setSelectedInstruments] = useState([])
  const [instruments, setInstruments] = useState([])

  useEffect(() => {
    const fetchInstruments = async () => {
      dispatch({ type: actions.SET_LOADING, payload:true })
      try {
        const { result } = await getInstruments()
        setInstruments(result)
      } catch (error) {
        toast.error(error)
      } finally {
        setTimeout(() => 
          dispatch({ type: actions.SET_LOADING, payload:false }), 500)
      }
    }

    fetchInstruments()
  }, [dispatch])

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
      dispatch({ type: actions.SET_LOADING, payload:true })
      try {
        const data = await getTheme()
        dispatch({ type: actions.SET_THEMES, payload: data.result })
      } catch (error) {
        toast.error(error)
      } finally {
        setTimeout(() =>  
          dispatch({ type: actions.SET_LOADING, payload:false }), 500)
      }
    }

    fetchTheme()
  }, [dispatch])
  if (state.loading) return <Loader title="Un momento por favor..." />

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
