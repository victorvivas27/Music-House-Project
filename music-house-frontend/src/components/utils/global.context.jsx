import { createContext, useContext, useReducer, useMemo } from 'react'
import { actions } from './actions'

import alternative from '../../assets/alternative.svg'
import classic from '../../assets/classic.svg'
import ancestral from '../../assets/ancestral.svg'

import instrumentCase from '../../assets/instrumentCase.svg'
import support from '../../assets/support.svg'
import tuner from '../../assets/tuner.svg'
import microphone from '../../assets/microphone.svg'
import phoneHolder from '../../assets/phoneHolder.svg'
import PropTypes from 'prop-types'

const initialState = {
  instruments: [],
  favorites: [],
  loading: false, 
  tematics: [
    { name: 'Alternativo', image: alternative },
    { name: 'Clásico', image: classic },
    { name: 'Ancestral', image: ancestral }
  ],
  characteristics: [
    { name: 'Estuche', image: instrumentCase, id: 'instrumentCase' },
    { name: 'Soporte', image: support, id: 'support' },
    { name: 'Afinador', image: tuner, id: 'tuner' },
    { name: 'Micrófono', image: microphone, id: 'microphone' },
    { name: 'Phone holder', image: phoneHolder, id: 'phoneHolder' }
  ],
  searchOptions: {
    found: undefined
  },
  categoryCreated: undefined,
  categoryUpdated: undefined,
  themeCreated: undefined,
  bookingInfo: undefined
}

const ContextGlobal = createContext()

const appReducer = (state, action) => {
  switch (action.type) {
    case actions.SET_LOADING:
      return { ...state, loading: action.payload }

    case actions.UPDATE_INSTRUMENTS:
      return { ...state, instruments: action.payload }

    case actions.FIND_INSTRUMENT:
      return {
        ...state,
        searchOptions: {
          found: action.payload.found
        }
      }

    case actions.CATEGORY_CREATED:
      return {
        ...state,
        categoryCreated: action.payload.created
      }

    case actions.CATEGORY_UPDATED:
      return {
        ...state,
        categoryUpdated: action.payload.updated
      }
    case actions.THEME_CREATED:
      return {
        ...state,
        themeCreated: action.payload.created
      }

    case actions.BOOKING_CONFIRM:
      return {
        ...state,
        bookingInfo: action.payload
      }

    case actions.BOOKING_UPDATE:
      return {
        ...state,
        bookingInfo: action.payload
      }

      case actions.UPDATE_FAVORITES:
        return { ...state, favorites: action.payload }

      case actions.TOGGLE_FAVORITE: {
        const { isFavorite, favorite, instrumentId } = action.payload
      
        const updatedFavorites = isFavorite
          ? [...state.favorites, favorite] // ✅ Se agrega
          : state.favorites.filter(f => f.instrument.idInstrument !== instrumentId) 
      
        return { ...state, favorites: updatedFavorites }
      }

      

    default:
      return state
  }
}

export const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)
  const data = useMemo(() => ({ state, dispatch }), [state, dispatch])

  return (
    <ContextGlobal.Provider value={data}>{children}</ContextGlobal.Provider>
  )
}

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export const useAppStates = () => useContext(ContextGlobal)
