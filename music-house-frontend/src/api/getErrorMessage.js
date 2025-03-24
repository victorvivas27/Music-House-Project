export const getErrorMessage = (error) => {
    if (!error) return '⚠️ Error desconocido (sin detalles).'
  
    // Si el backend lo envió como { message, error, result, statusCode... }
    if (error.message || error.error) {
      return error.message || error.error
    }
  
    // Si es una excepción de axios con respuesta estructurada
    if (error.response?.data?.message || error.response?.data?.error) {
      return error.response.data.message || error.response.data.error
    }
  
    // Si es un Error estándar de JS
    if (error instanceof Error) {
      return error.message
    }
  
    // Fallback final
    return '⚠️ Error inesperado.'
  }