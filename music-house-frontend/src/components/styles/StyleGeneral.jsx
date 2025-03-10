export const inputStyles = {
    '& .MuiInputBase-input': {
      color: 'var(--color-secundario)', // Color del texto
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'var(--color-secundario)', // Color del borde
      },
      '&:hover fieldset': {
        borderColor: 'var(--color-primario)', // Borde en hover
      },
      '&.Mui-focused fieldset': {
        borderColor: 'var(--color-azul)', // Borde cuando está enfocado
      },
      padding: '5px' // Espaciado interno
     
    },
  };