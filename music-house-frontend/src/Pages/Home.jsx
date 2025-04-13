import { useCallback, useEffect, useRef, useState} from 'react'
import { useAppStates } from '@/components/utils/global.context'
import { getInstruments } from '@/api/instruments'
import { actions } from '@/components/utils/actions'
import { getTheme } from '@/api/theme'
import { Loader } from '@/components/common/loader/Loader'
import { MainWrapper, ProductsWrapper, TitleResponsive } from '@/components/styles/ResponsiveComponents'
import AutoScrollCarousel from '@/components/common/autoScrollCarousel/AutoScrollCarousel'
import ProductCard from '@/components/common/instrumentGallery/ProductCard'
import { getErrorMessage } from '@/api/getErrorMessage'
import useAlert from '@/hook/useAlert'


export const Home = () => {
  const { state, dispatch } = useAppStates()
  const { showError } = useAlert()
  const [page, setPage] = useState(0)
  const [pageSize] = useState(5)

  const observer = useRef()
const lastElementRef = useCallback(
  (node) => {
    if (state.loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && state.instruments?.content?.length < state.instruments?.totalElements) {
        setPage((prevPage) => prevPage + 1)
      }
    })
    if (node) observer.current.observe(node)
  },
  [state.loading, state.instruments]
)
useEffect(() => {
  const fetchData = async () => {
    dispatch({ type: actions.SET_LOADING, payload: true })

    try {
      const instrumentsRes = await getInstruments(page, pageSize)
      const newInstruments = instrumentsRes.result

      dispatch({
        type: page === 0 ? actions.SET_INSTRUMENTS : actions.APPEND_INSTRUMENTS,
        payload: newInstruments
      })

      if (page === 0) {
        const themesRes = await getTheme()
        dispatch({ type: actions.SET_THEMES, payload: themesRes.result })
      }
    } catch (error) {
      showError(`❌ ${getErrorMessage(error)}`)
    } finally {
      dispatch({ type: actions.SET_LOADING, payload: false })
    }
  }

  fetchData()
}, [dispatch, page, pageSize, showError])

  if (state.loading) return <Loader title="Un momento por favor..." />

  const instruments = state.instruments?.content || []

  return (
    <>
      <MainWrapper>
        <AutoScrollCarousel themes={state.themes?.content || []} />
      </MainWrapper>

      <ProductsWrapper>
  {instruments.length > 0 ? (
    instruments.map((instrument, index) => (
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
    <TitleResponsive>No se han encontrado instrumentos</TitleResponsive>
  )}
  {/* Observador para scroll infinito */}
  <div ref={lastElementRef} style={{ height: '1px' }} />
</ProductsWrapper>
    </>
  )
}
