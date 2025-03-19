import axios from 'axios';
import {
  useGetFetch,
  getFetch,
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
      throw (error.response || "No se pudo conectar con el servidor");
    } 
  }
};

export const updateInstrument = async (payload) => {
  try {
    const response = await axios.put(`${BASE_URL}/instrument/update`, payload)
    return response.data

  } catch (error) {
    if (error.response) {
      throw (error.response || "No se pudo conectar con el servidor");
    } 

  }

}

export const deleteInstrument = async (idInstrument) => {
  try {
    const response = await axios.delete(`${BASE_URL}/instrument/delete/${idInstrument}`)
    return response.data // 📌 Devolver la respuesta si es necesario
  } catch (error) {
    if (error.response) {
      throw (error.response || "No se pudo conectar con el servidor");
    } 
  }
}

export const searchInstrumentsByName = (name) => {
  if (!name) return []; // Si `name` no existe, no hacer la petición

  return useGetFetch(`${BASE_URL}/instrument/find/name/${name}`);
}
