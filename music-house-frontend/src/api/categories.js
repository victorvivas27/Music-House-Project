import { getFetch, postFetch, putFetch, deleteFetch } from '../helpers/useFetch'

//const URL_CATEGORIES = 'https://music-house.up.railway.app/api/category'
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getCategories = () => {
  return getFetch(`${BASE_URL}/category/all`)
}

export const getCategoryById = (idCategory) => {
  return getFetch(`${BASE_URL}/category/search/${idCategory}`)
}

export const createCategory = ({ categoryName, description }) => {
  return postFetch(`${BASE_URL}/category/create`, { categoryName, description })
}

export const updateCategory = ({ idCategory, categoryName, description }) => {
  return putFetch(`${BASE_URL}/category/update`, {
    idCategory,
    categoryName,
    description
  })
}

export const deleteCategory = (idCategory) => {
  return deleteFetch(`${BASE_URL}/category/delete/${idCategory}`)
}
