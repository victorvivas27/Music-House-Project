import { useEffect, useState } from 'react'
import { Typography } from '@mui/material'
import { useAppStates } from '../utils/global.context'
import { getInstruments } from '../../api/instruments'
import { actions } from '../utils/actions'
import MainWrapper from '../common/MainWrapper'
import TematicCard from '../common/TematicCard'
import ProductsWrapper from '../common/ProductsWrapper'
import ProductCard from '../common/ProductCard'
import { Loader } from '../common/loader/Loader'
import { toast } from 'react-toastify'

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

  if (loading) return <Loader title="Un momento por favor..." />

  return (
    
     
        <>
          <MainWrapper>
            {state.tematics?.map((tematic, index) => (
              <TematicCard
                key={`tematic-card-${index}`}
                title={tematic.name}
                imageUrl={tematic.image}
              />
            ))}
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
                      : '/default-image.jpg'
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
