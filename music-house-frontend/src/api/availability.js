import { useGetFetch } from '../helpers/useFetch'

//const URL_FIND_INSTRUMENT_AVAILABILITY ='https://music-house.up.railway.app/api/available-dates/find/all'
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const findInstrumentAvailability = (
  idInstrument,
  startDate,
  endDate
) => {
  return useGetFetch(
    `${BASE_URL}/available-dates/find/all/${startDate}/between/${endDate}/${idInstrument}`
  )
}

export const findInstrumentsAvailabilityByDates = (startDate, endDate) => {
  return endDate
    ? useGetFetch(
        `${BASE_URL}/available-dates/find/all/${startDate}/between/${endDate}`
      )
    : useGetFetch(`${BASE_URL}/available-dates/find/all/${startDate}`)
}
