export const getErrorMessage = (error) => {
  if (!error) return '⚠️ Error desconocido (sin detalles).'

  const response = error.response?.data

  // 🔹 Captura todos los posibles mensajes
  const message = response?.message || error.message
  const errorDetail = response?.error || error.error

  // 🔸 Si errorDetail es un array, lo unimos
  const errorText = Array.isArray(errorDetail)
    ? errorDetail.join('\n')
    : errorDetail

  // 🔹 Combina ambos si existen
  if (message && errorText) {
    return `${message}\n${errorText}`
  }

  // 🔹 Solo uno u otro
  return message || errorText || '⚠️ Error inesperado.'
}