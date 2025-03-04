import axios from 'axios';
import { putFetch } from '../helpers/useFetch'

//const URL_PHONES = 'https://music-house.up.railway.app/api/phone'
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const updatePhone = ({ idPhone, phoneNumber }) => {
  return putFetch(`${BASE_URL}/phone/update`, {
    idPhone,
    phoneNumber
  })
}
export const addPhone = async ({ idUser, phoneNumber }) => {
  try {
    const response = await axios.post(`${BASE_URL}/phone/add_phone`, {
      idUser,
      phoneNumber
    });
    return response.data;
  } catch (error) {
    throw new Error('Error al agregar el telefono');
  }
};

export const removePhone = async (idPhone) => {
  try {
    await axios.delete(`${BASE_URL}/phone/delete/${idPhone}`);
    return true;
  } catch (error) {
    throw new Error('Error al eliminar un telefono');
  }
};