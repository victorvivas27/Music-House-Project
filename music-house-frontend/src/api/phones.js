import { putFetch } from '../helpers/useFetch'

//const URL_PHONES = 'https://music-house.up.railway.app/api/phone'
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const updatePhone = ({ idPhone, phoneNumber }) => {
  return putFetch(`${BASE_URL}/phone/update`, {
    idPhone,
    phoneNumber
  })
}
