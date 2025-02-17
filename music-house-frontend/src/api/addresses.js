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
