export const inputStyles = {
  '& .MuiInputBase-input': {
    color: 'var(--texto-primario)', // Color del texto
    fontSize: '1rem', // Tamaño de la fuente más legible
    
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'var(--color-secundario)', // Color del borde normal
      borderWidth: '2px' // Grosor del borde
    },
    '&:hover fieldset': {
      borderColor: 'var(--color-primario-dark)', // Color más fuerte en hover
      borderWidth: '2.5px' // Borde más grueso al pasar el mouse
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--color-azul)', // Color más fuerte al estar enfocado
      borderWidth: '3px', // Borde más grueso al hacer foco
      
    },
    borderRadius: '8px', // Bordes más redondeados
    transition: 'all 0.3s ease-in-out' // Suaviza los cambios de estilo
  },
  '& .MuiInputLabel-root': {
    color: 'var(--calendario-fondo-no-disponible)', // Color del label
    fontSize: '1rem', // Tamaño del texto normal
    fontWeight: 'bold', // Opcional: hacer el label más grueso
    transition: 'all 0.3s ease-in-out', // Transición suave
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: 'var(--calendario-fondo-no-disponible)', // Color cuando el input está enfocado
    fontSize: '1.1rem', // Opcional: agrandar al enfocar
  }
};


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