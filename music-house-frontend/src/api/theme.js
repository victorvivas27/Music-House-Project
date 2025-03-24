import axios from 'axios';
import { handleApiError } from './handleApiError';

//const URL_CATEGORIES = 'https://music-house.up.railway.app/api/category'
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Obtener todos los temas
export const getTheme = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/theme/all`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Obtener tema por ID
export const getThemeById = async (idTheme) => {
  try {
    const response = await axios.get(`${BASE_URL}/theme/search/${idTheme}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Crear nuevo tema
export const createTheme = async ({ themeName, description }) => {
  try {
    const response = await axios.post(`${BASE_URL}/theme/create`, {
      themeName,
      description
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Actualizar un tema existente
export const updateTheme = async ({ idTheme, themeName, description }) => {
  try {
    const response = await axios.put(`${BASE_URL}/theme/update`, {
      idTheme,
      themeName,
      description
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Eliminar un tema
export const deleteTheme = async (idTheme) => {
  try {
    const response = await axios.delete(`${BASE_URL}/theme/delete/${idTheme}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
