export const getErrorMessage = (error) => {
  if (!error) return '⚠️ Error desconocido (sin detalles).'


  if (error.message || error.error) {
    return error.message || error.error
  }


  if (error.response?.data?.message || error.response?.data?.error) {
    return error.response.data.message || error.response.data.error
  }


  if (error instanceof Error) {
    return error.message
  }


  return '⚠️ Error inesperado.'
} 