
import axios from 'axios';
//const URL_FAVORITES = 'https://music-house.up.railway.app/api/favorite'
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAllFavorites = async (idUser) => {
  try {
    const response = await axios.get(`${BASE_URL}/favorite/search/${idUser}`)
    return response.data.data
  } catch (error) {
    if (error?.response?.status === 404) {
      return [] 
    }
    throw new Error('Error al obtener favoritos')
  }
}

export const toggleFavorite = async (idUser, idInstrument) => {
  const response = await axios.post(`${BASE_URL}/favorite/add`, {
    idUser,
    idInstrument,
  })
  return response.data
}

