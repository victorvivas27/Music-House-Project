import axios from 'axios';
import { handleApiError } from './handleApiError';

//const URL_PHONES = 'https://music-house.up.railway.app/api/phone'
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Actualizar un teléfono existente
export const updatePhone = async ({ idPhone, phoneNumber }) => {
  try {
    const response = await axios.put(`${BASE_URL}/phone/update`, {
      idPhone,
      phoneNumber
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Agregar un nuevo teléfono
export const addPhone = async ({ idUser, phoneNumber }) => {
  try {
    const response = await axios.post(`${BASE_URL}/phone/add`, {
      idUser,
      phoneNumber
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Eliminar un teléfono por ID
export const removePhone = async (idPhone) => {
  try {
    const response = await axios.delete(`${BASE_URL}/phone/delete/${idPhone}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};