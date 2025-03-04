import axios from 'axios';
import { putFetch } from '../helpers/useFetch'

//const URL_ADDRESSES = 'https://music-house.up.railway.app/api/address'
const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const updateAddress = ({
  idAddress,
  street,
  number,
  city,
  state,
  country
}) => {
  return putFetch(`${BASE_URL}/address/update`, {
    idAddress,
    street,
    number,
    city,
    state,
    country
  })
}
export const addAddress = async ({ idUser, street, number, city, state, country }) => {
  try {
    const response = await axios.post(`${BASE_URL}/address/add_address`, {
      idUser,
      street,
      number,
      city,
      state,
      country
    });
    return response.data;
  } catch (error) {
    throw new Error('Error al agregar la dirección');
  }
};

export const removeAddress = async (idAddress) => {
  try {
    await axios.delete(`${BASE_URL}/address/delete/${idAddress}`);
    return true;
  } catch (error) {
    throw new Error('Error al eliminar la dirección');
  }
};
