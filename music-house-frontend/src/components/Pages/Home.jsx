import { useEffect, useState } from 'react'
import { CssBaseline, Typography, Container } from '@mui/material'
import { useAppStates } from '../utils/global.context'
import { getInstruments } from '../../api/instruments'
import { actions } from '../utils/actions'
import MainWrapper from '../common/MainWrapper'
import TematicCard from '../common/TematicCard'
import ProductsWrapper from '../common/ProductsWrapper'
import ProductCard from '../common/ProductCard'
import { Loader } from '../common/loader/Loader'



export const Home = () => {
  const { state, dispatch } = useAppStates()
  const { searchOptions } = state
  const [selectedInstruments, setSelectedInstruments] = useState([])
  const [loading, setLoading] = useState(true)
  const [instruments, setInstruments] = useState()

  useEffect(() => {
    getInstruments().then(([instruments]) => {
      setInstruments(instruments)
    })
  }, [])

  useEffect(() => {
    if (instruments && instruments.data) {
      dispatch({ type: actions.UPDATE_INSTRUMENTS, payload: instruments })
      setSelectedInstruments(instruments.data)
      setLoading(false)
    }
  }, [instruments])

  useEffect(() => {
    if (instruments && instruments.data) {
      const found = searchOptions.found
        ? instruments?.data?.filter((instrument) =>
            searchOptions.found.some(
              (instrumentFound) =>
                instrument.idInstrument === instrumentFound.idInstrument
            )
          )
        : instruments.data
      setSelectedInstruments(found)
      if (searchOptions.found && window) {
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
      }
    }
  }, [searchOptions])

  if (loading) return <Loader title="Un momento por favor..." />

  return (
    <main>
      {!loading && (
        <>
          <CssBaseline />

          <MainWrapper>
            {state.tematics?.map((tematic, index) => (
              <TematicCard
                key={`tematic-card-${index}`}
                title={tematic.name}
                imageUrl={tematic.image}
              />
            ))}
          </MainWrapper>


          <Container
            sx={{
              display: 'flex',
              flexDirection: 'column',
              paddingBottom: 5,
              paddingLeft: { xs: '0' },
              paddingRight: { xs: '0' },
              border:" 2px solid blue"
            }}
          >
            
            <ProductsWrapper>
              {selectedInstruments.length > 0 ? (
                selectedInstruments?.map((instrument, index) => (
                  <ProductCard
                    key={`product-card-${index}`}
                    name={instrument.name}
                    imageUrl={instrument.imageUrls[0].imageUrl}
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
          </Container>
        </>
      )}
    </main>
  )
}
