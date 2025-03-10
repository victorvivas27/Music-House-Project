import { styled } from '@mui/system'
import TextField from '@mui/material/TextField'
import { Button } from '@mui/material'

export const InputCustom = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    color: 'black',
    backgroundColor: '#D7D7D7D7'
  },

  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: '#F7E434'
    }
  },

  [theme.breakpoints.up('md')]: {
    backgroundColor: '#D7D7D73C'
  }
}))

export const CustomButton = styled(Button)(({ theme }) => ({
  minWidth: '100px', // Asegura que tenga un ancho mínimo
  minHeight: '30px', // Asegura que tenga una altura mínima
  color: 'var(--color-secundario)', // Texto con color secundario
  backgroundColor: 'var(--color-primario)', // Fondo con color primario
  fontWeight: 'bold', // Hace que el texto sea más llamativo
  textTransform: 'none', // Evita que el texto esté en mayúsculas
  borderRadius: '8px', // Bordes redondeados para un diseño moderno
  transition: '0.3s', // Agrega una transición suave

  '&:hover': {
    backgroundColor: 'var(--color-primario-hover)', // Define un color de hover
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)' // Agrega un efecto de sombra al pasar el mouse
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
