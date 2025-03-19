import axios from 'axios';
import {
  useGetFetch,
  getFetch,
  putFetch,

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

export const createInstrument = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/instrument/create`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response
    } else if (error.request) {
      throw new Error('No se pudo conectar con el servidor');
    } else {
      // ❌ Error inesperado (ejemplo: problema con axios)
      throw new Error(`Error inesperado: ${error.message}`);
    }
  }
};

export const updateInstrument = (payload) => {
  return putFetch(`${BASE_URL}/instrument/update`, payload)
}

export const deleteInstrument = async (idInstrument) => {
  try {
    const response = await axios.delete(`${BASE_URL}/instrument/delete/${idInstrument}`)
    return response.data // 📌 Devolver la respuesta si es necesario
  } catch (error) {
    console.error('❌ Error al eliminar el instrumento:', error.response?.data || error.message)
    throw error // 📌 Lanzar el error para que el frontend pueda manejarlo
  }
}

export const searchInstrumentsByName = (name) => {
  if (!name) return []; // Si `name` no existe, no hacer la petición

  return useGetFetch(`${BASE_URL}/instrument/find/name/${name}`);
}
