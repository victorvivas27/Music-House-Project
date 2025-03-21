import { styled } from '@mui/system'
import { Button } from '@mui/material'



export const CustomButton = styled(Button)(({ theme }) => ({
  minWidth: '190px', // Asegura que tenga un ancho mínimo
  minHeight: '50px', // Asegura que tenga una altura mínima
  color: 'var(--color-secundario)', // Texto con color secundario
  backgroundColor: 'var(--color-primario)', // Fondo con color primario
  fontWeight: 'bold', // Hace que el texto sea más llamativo
  textTransform: 'none', // Evita que el texto esté en mayúsculas
  borderRadius: '8px', // Bordes redondeados para un diseño moderno
  transition: '0.3s', // Agrega una transición suave
  

  '&:hover': {
    backgroundColor: 'var(--color-primario)', // Define un color de hover
   
  },
  '&:active': {
    backgroundColor: 'var(--color-primario-active)' // Define un color cuando se presiona
  },

  '&:disabled': {
    backgroundColor: 'var(--color-primario)', // ❌ No cambiar el color al deshabilitar
    color: 'var(--color-secundario)', // ❌ Mantener el color del texto
    opacity: 0.7, // 🔹 Agregar una leve transparencia
    cursor: 'not-allowed'
  },

  [theme.breakpoints.up('md')]: {
    marginTop: 0
  }
}))
