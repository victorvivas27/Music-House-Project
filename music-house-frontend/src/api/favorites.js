
import axios from 'axios';
import { handleApiError } from './handleApiError';
//const URL_FAVORITES = 'https://music-house.up.railway.app/api/favorite'
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Obtener favoritos de un usuario
export const getAllFavorites = async (idUser) => {
  try {
    const response = await axios.get(`${BASE_URL}/favorite/search/${idUser}`);
    return response.data;
  } catch (error) {
    if (error?.response?.status === 404) {
      return []; // Usuario sin favoritos
    }
    handleApiError(error);
  }
};

// Agregar o quitar favorito
export const toggleFavorite = async (idUser, idInstrument) => {
  try {
    const response = await axios.post(`${BASE_URL}/favorite/add`, {
      idUser,
      idInstrument,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
