import axios from 'axios';
import { getFetch,} from '../helpers/useFetch'

//const URL_CATEGORIES = 'https://music-house.up.railway.app/api/category'
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getCategories = () => {
  return getFetch(`${BASE_URL}/category/all`)
}

export const getCategoryById = (idCategory) => {
  return getFetch(`${BASE_URL}/category/search/${idCategory}`)
}

export const createCategory  = async({ categoryName, description }) => {
  try{
    const respuesta = await axios.post(`${BASE_URL}/category/create`, { categoryName, description });
    return  respuesta.data; 
  }catch(error){
    if (error.response) {
      throw (error.response || "No se pudo conectar con el servidor");
    }
  }
  
}

export const updateCategory = async({ idCategory, categoryName, description }) => {
  try{
    const respuesta = await axios.put(`${BASE_URL}/category/update`, {idCategory,categoryName, description})
    return respuesta.data
  }catch(error){
    if (error.response) {
      throw (error.response || "No se pudo conectar con el servidor");
    }
  }
}

export const deleteCategory = async (idCategory) => {
  try{
    const respuesta = await axios.delete(`${BASE_URL}/category/delete/${idCategory}`)
    return respuesta.data
  }catch(error){
    if (error.response) {
      throw (error.response || "No se pudo conectar con el servidor");
    }
  }
}
