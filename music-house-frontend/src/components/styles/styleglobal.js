export const inputStyles = {
  //borderRadius: '40px', // Bordes redondeados
  transition: 'all 0.3s ease-in-out', // Suaviza las transiciones
  //backgroundColor: 'var(--background-color)', // Fondo dinámico
  color: 'var(--texto-inverso)', // Color del texto

  border: 'none', // Elimina borde predeterminado
  boxSizing: 'border-box', // Evita desbordes por bordes gruesos

  '& .MuiInputBase-input': {
    color: 'var(--color-azul)', // Color del texto principal
   
  },

  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'var(--color-secundario)', // Borde normal
      borderWidth: '2px', // Grosor inicial
      borderRadius: '8px',
    },
    '&:hover fieldset': {
      borderColor: 'var(--color-primario)', // Color más fuerte en hover
      borderWidth: '2.5px', // Borde más grueso en hover
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--color-azul)', // Color en foco
      borderWidth: '1px', // Borde más grueso en foco

    },
  },

  '& .MuiInputLabel-root': {
    color: 'var(--texto-inverso)', // Color del label normal
    fontSize: '1rem', // Tamaño base
    
    transition: 'all 0.3s ease-in-out', // Transición suave
  },

  '& .MuiInputLabel-root.Mui-focused': {
    color: 'var(--texto-inverso)', // Color al enfocar

  },

};

export const flexRowContainer = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '10px',
  flexWrap: 'wrap',
  boxShadow: '3px 3px 8px rgba(0, 0, 0, 0.1)',
  padding: '10px', // Espaciado interno mejorado
};

export const flexColumnContainer = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-evenly',
 // backgroundColor: 'rgba(245, 245, 245, 0.8)',
  boxShadow: '3px 3px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '12px',
  padding: '15px', // Mejora en espaciado interno
  maxWidth: '100%', // Evita desbordes en pantallas pequeñas
};