
import {
  getFetch,
  postFetch,
  deleteFetch
} from '../helpers/useFetch'
//const URL_RESERVATIONS = 'https://music-house.up.railway.app/api/reservations'
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ReservationApi = {

  getReservations: () => {
    return getFetch(`${BASE_URL}/reservations/all`)
  },

  getReservationById: (id) => {
    return getFetch(`${BASE_URL}/reservations/search/user/${id}`)
  },


  deleteReservation: (idInstrument, idUser, idReservation) => {
    return deleteFetch(`${BASE_URL}/reservations/delete/${idInstrument}/${idUser}/${idReservation}`)
  }
 
  }

  export const createReservation = (idUser, idInstrument, startDate, endDate) => {
    return postFetch(`${BASE_URL}/reservations/create`, {
      idUser,
      idInstrument,
      startDate,
      endDate
    })
  }
