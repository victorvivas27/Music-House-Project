import { postFetch} from '../helpers/useFetch'

//const URL_FIND_INSTRUMENT_AVAILABILITY ='https://music-house.up.railway.app/api/available-dates/find/all'
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const findInstrumentAvailability = (idInstrument, startDate, endDate) => {
  if (!idInstrument) {
    console.error("Error: idInstrument no puede ser null o undefined.");
    return null; // Retorna null para evitar llamadas incorrectas
  }
  
  return `${BASE_URL}/available-dates/find/all/${startDate}/between/${endDate}/${idInstrument}`;
}

export const findInstrumentsAvailabilityByDates = (startDate, endDate) => {
  return endDate
    ? `${BASE_URL}/available-dates/find/all/${startDate}/between/${endDate}`
    : `${BASE_URL}/available-dates/find/all/${startDate}`
}

export const addAvailableDates = (availableDates) => {
  return postFetch(`${BASE_URL}/available-dates/add`, availableDates);
};

