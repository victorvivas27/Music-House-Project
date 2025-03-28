
import axios from 'axios';
import { handleApiError } from './handleApiError';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const getAllFavorites = async (idUser) => {
  try {
    const response = await axios.get(`${BASE_URL}/favorite/search/${idUser}`);
    return response.data;
  } catch (error) {
    if (error?.response?.status === 404) {
      return [];
    }
    handleApiError(error);
  }
};


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
