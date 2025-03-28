import axios from 'axios';
import { handleApiError } from './handleApiError';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const getInstrumentAvailability = async (idInstrument, startDate, endDate) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/available-dates/find/all/${startDate}/between/${endDate}/${idInstrument}`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};


export const getAllAvailableDatesByInstrument = async (idInstrument) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/available-dates/find/all/${idInstrument}/instrument`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};


export const addAvailableDates = async (availableDates) => {
  try {
    const response = await axios.post(`${BASE_URL}/available-dates/add`, availableDates);
    return response.data; 
  } catch (error) {
    handleApiError(error);
  }
};


export const removeAvailableDate = async (idInstrument, idDate) => {
  try {
    const response = await axios.delete(`${BASE_URL}/available-dates/delete/${idInstrument}/${idDate}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

