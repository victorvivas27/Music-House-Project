import { postFetch, deleteFetch } from '../helpers/useFetch'

//const URL_IMAGES = 'https://music-house.up.railway.app/api/imageurls'
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const addImage = (idInstrument, imageUrl) => {
  return postFetch(`${BASE_URL}/imageurls/add_image`, { idInstrument, imageUrl })
}

export const removeImage = (idImage, idInstrument) => {
  return deleteFetch(`${BASE_URL}/imageurls/delete/${idInstrument}/${idImage}`)
}
