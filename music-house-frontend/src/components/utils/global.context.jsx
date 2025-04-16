import { createContext, useContext, useReducer, useMemo } from 'react'
import { actions } from './actions'
import instrumentCase from '@/assets/instrumentCase.svg'
import support from '@/assets/support.svg'
import tuner from '@/assets/tuner.svg'
import microphone from '@/assets/microphone.svg'
import phoneHolder from '@/assets/phoneHolder.svg'
import PropTypes from 'prop-types'

const initialState = {
  favorites: [],
  loading: false,

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
  categories: { content: [], totalElements: 0 },
  themes: { content: [], totalElements: 0 },
  users: { content: [], totalElements: 0 },
  instruments: { content: [], totalElements: 0 }
}

const ContextGlobal = createContext()

const appReducer = (state, action) => {
  switch (action.type) {
    case actions.SET_LOADING:
      return { ...state, loading: action.payload }

    case actions.FIND_INSTRUMENT:
      return {
        ...state,
        searchOptions: {
          found: action.payload.found
        }
      }

    case actions.UPDATE_FAVORITES:
      return {
        ...state,
        favorites: Array.isArray(action.payload) ? action.payload : []
      }

    case actions.TOGGLE_FAVORITE: {
      const { favorite } = action.payload
      const isFavorite = favorite.isFavorite
      const instrumentId = favorite.instrument.idInstrument

      const updatedFavorites = isFavorite
        ? [...state.favorites, favorite]
        : state.favorites.filter(
            (f) => f.instrument.idInstrument !== instrumentId
          )

      return { ...state, favorites: updatedFavorites }
    }

    case actions.SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload?.content
          ? action.payload
          : {
              content: Array.isArray(action.payload) ? action.payload : [],
              totalElements: 0
            }
      }

    case actions.SET_THEMES:
      return {
        ...state,
        themes: action.payload?.content
          ? action.payload
          : {
              content: Array.isArray(action.payload) ? action.payload : [],
              totalElements: 0
            }
      }
    case actions.SET_INSTRUMENTS:
      return {
        ...state,
        instruments: action.payload?.content
          ? action.payload
          : {
              content: Array.isArray(action.payload) ? action.payload : [],
              totalElements: 0
            }
      }
    case actions.APPEND_INSTRUMENTS:
      return {
        ...state,
        instruments: {
          ...action.payload,
          content: [
            ...(state.instruments?.content || []),
            ...action.payload.content
          ]
        }
      }
    case actions.SET_USERS:
      return {
        ...state,
        users: action.payload
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
