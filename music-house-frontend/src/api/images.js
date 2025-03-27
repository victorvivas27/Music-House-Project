
import axios from 'axios';
import { handleApiError } from './handleApiError';

//const URL_IMAGES = 'https://music-house.up.railway.app/api/imageurls'
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Agregar una imagen al instrumento
export const addImage = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/imageurls/add_image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};



// Eliminar una imagen del instrumento
export const removeImage = async (idImage, idInstrument) => {
  try {
    const response = await axios.delete(`${BASE_URL}/imageurls/delete/${idInstrument}/image-id/${idImage}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};


export const imageUrlsAllInstrumentId = async (idInstrument) => {
  try {
    const response = await axios.get(`${BASE_URL}/imageurls/by-instrument/${idInstrument}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};