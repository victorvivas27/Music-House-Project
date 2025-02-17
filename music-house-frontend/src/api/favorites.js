import { useGetFetch, postFetch, deleteFetch } from '../helpers/useFetch'

//const URL_FAVORITES = 'https://music-house.up.railway.app/api/favorite'
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAllFavorites = (idUser) => {
  return useGetFetch(`${BASE_URL}/favorite/search/${idUser}`)
}

export const addFavorite = (idUser, idInstrument) => {
  return postFetch(`${BASE_URL}/favorite/add`, { idUser, idInstrument })
}

export const removeFavorite = (idFavorite, idUser, idInstrument) => {
  return deleteFetch(
    `${BASE_URL}/favorite/delete/${idInstrument}/${idUser}/${idFavorite}`
  )
}
