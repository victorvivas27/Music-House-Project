import axios from 'axios';
import { getFetch } from '../helpers/useFetch'

//const URL_CATEGORIES = 'https://music-house.up.railway.app/api/category'
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getTheme = () => {
  return getFetch(`${BASE_URL}/theme/all`)
}

export const getThemeById = (idTheme) => {
  return getFetch(`${BASE_URL}/theme/search/${idTheme}`)
}

export const createTheme = async ({ themeName, description }) => {
  try {
    const respuesta = await axios.post(`${BASE_URL}/theme/create`, { themeName, description });
    return respuesta.data;
  } catch (error) {
    if (error.response) {
      throw (error.response || "No se pudo conectar con el servidor");
    }
  }
}

export const updateTheme = async ({ idTheme, themeName, description }) => {
  try {
    const respuesta = await axios.put(`${BASE_URL}/theme/update`, { idTheme, themeName, description })
    return respuesta.data
  } catch (error) {
    if (error.response) {
      throw (error.response || "No se pudo conectar con el servidor");
    }
  }


}

export const deleteTheme = async (idTheme) => {
  try {
    const respuesta = await axios.delete(`${BASE_URL}/theme/delete/${idTheme}`)
    return respuesta.data
  } catch (error) {
    if (error.response) {
      throw (error.response || "No se pudo conectar con el servidor");
    }
  }

}
