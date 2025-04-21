
import axios from 'axios';
import { handleApiError } from './handleApiError';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const getFavoritesByUserId = async (idUser, page = 0, size = 5, sort = 'registDate,desc') => {
  try {
    const response = await axios.get(`${BASE_URL}/favorites/${idUser}`, {
      params: { page, size, sort }
    })
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}


export const toggleFavorite = async (idUser, idInstrument) => {
  try {
    const response = await axios.post(`${BASE_URL}/favorites`, {
      idUser,
      idInstrument,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
