export const inputStyles = {
  '& .MuiInputBase-input': {
    color: 'var(--color-secundario)' // Color del texto
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'var(--color-secundario)' // Color del borde
    },
    '&:hover fieldset': {
      borderColor: 'var(--color-primario)' // Borde en hover
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--color-azul)' // Borde cuando está enfocado
    },
    padding: '5px' // Espaciado interno
  }
}


export const flexRowContainer = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
 
  borderRadius: '.625rem',
  flexWrap: 'wrap',
  boxShadow: '3px 3px 8px rgba(0, 0, 0, 0.1)',
}

export const flexColumnContainer = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  
  justifyContent: "space-evenly",
  backgroundColor: 'rgba(245, 245, 245, 0.8)',
  boxShadow: '3px 3px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '12px',
  

};