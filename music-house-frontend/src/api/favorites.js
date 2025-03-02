
import axios from 'axios';
//const URL_FAVORITES = 'https://music-house.up.railway.app/api/favorite'
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAllFavorites = async (idUser) => {
  try {
    const response = await axios.get(`${BASE_URL}/favorite/search/${idUser}`)
    return response.data.data
  } catch (error) {
    if (error?.response?.status === 404) {
      return [] // Si no hay favoritos, devolvemos un array vacío
    }
    throw new Error('Error al obtener favoritos')
  }
}

export const addFavorite = async (idUser, idInstrument) => {
  try {
    const response = await axios.post(`${BASE_URL}/favorite/add`, {
      idUser,
      idInstrument
    })
    return response.data
  } catch (error) {
    if (error?.response?.status === 409) {
      throw new Error('Ya está en favoritos')
    }
    throw new Error('Error al agregar a favoritos')
  }
}

export const removeFavorite = async (idFavorite, idUser, idInstrument) => {
  try {
    await axios.delete(`${BASE_URL}/favorite/delete/${idInstrument}/${idUser}/${idFavorite}`)
    return true
  } catch (error) {
    throw new Error('Error al eliminar favorito')
  }
}
