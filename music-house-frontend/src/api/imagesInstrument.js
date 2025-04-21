
import axios from 'axios';
import { handleApiError } from './handleApiError';


const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const addImage = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/imageurls`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};




export const removeImage = async (idImage, idInstrument) => {
  try {
    const response = await axios.delete(`${BASE_URL}/imageurls/${idInstrument}/${idImage}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};


export const imageUrlsAllInstrumentId = async (idInstrument) => {
  try {
    const response = await axios.get(`${BASE_URL}/imageurls/${idInstrument}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};