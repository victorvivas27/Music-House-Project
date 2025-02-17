import {
  useGetFetch,
  getFetch,
  postFetch,
  putFetch,
  deleteFetch
} from '../helpers/useFetch'

/* const URL_INSTRUMENTS = 'https://music-house.up.railway.app/api/instrument'
const URL_THEMES = 'https://music-house.up.railway.app/api/theme' */
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getInstruments = () => {
  return getFetch(`${BASE_URL}/instrument/all`)
}

export const getInstrumentById = (id) => {
  return getFetch(`${BASE_URL}/instrument/search/${id}`)
}

export const getThemes = () => {
  return useGetFetch(`${BASE_URL}/theme/all`)
}

export const createInstrument = (payload) => {
  return postFetch(`${BASE_URL}/instrument/create`, payload)
}

export const updateInstrument = (payload) => {
  return putFetch(`${BASE_URL}/instrument/update`, payload)
}

export const deleteInstrument = (idInstrument) => {
  return deleteFetch(`${BASE_URL}/instrument/delete/${idInstrument}`)
}

export const searchInstrumentsByName = (name) => {
  return useGetFetch(
    `${BASE_URL}/instrument/find/name/${name}`,
    (!name || name === '') && []
  )
}
