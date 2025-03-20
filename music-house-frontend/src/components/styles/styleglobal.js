export const inputStyles = {
  width: "100%", // ✅ Se asegura de que ocupe todo el ancho disponible
  maxWidth: "500px", // 🔹 Opcional: limita el ancho máximo si es necesario
  transition: 'all 0.3s ease-in-out', // Suaviza las transiciones
  color: 'var(--color-azul)', // Color del texto
  boxSizing: 'border-box', // Evita desbordes por bordes gruesos
  '& .MuiInputBase-input': {
    color: 'var(--color-azul)', // Color del texto principal
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'var(--color-secundario)', // Borde normal
      borderWidth: '2px',
      borderRadius: '8px',
    },
    '&:hover fieldset': {
      borderColor: 'var(--color-primario)', // Color más fuerte en hover
      borderWidth: '2.5px',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--color-exito)', // Color en foco
      borderWidth: '1px',
    },
  },

  '& .MuiInputLabel-root': {
    color: 'var(--color--azul)', // Color del label normal
    fontSize: '1rem',
    transition: 'all 0.3s ease-in-out',
  },

  '& .MuiInputLabel-root.Mui-focused': {
    color: 'var(--color-azul)', // Color al enfocar
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

export const paginationStyles = {
  '& .MuiTablePagination-toolbar': { 
    backgroundColor: 'lightgray', // Fondo gris en la barra de paginación
    //borderRadius: '8px',
    padding: '10px' // Espaciado interno mejorado
  },
  '& .MuiTablePagination-selectLabel': { 
    fontWeight: 'bold', // Texto "Filas por página" en negrita
    color: 'var(--color-azul)'
  },
  '& .MuiTablePagination-input': { 
    fontSize: '16px', // Aumentar el tamaño del input
    color: 'var(--color-error)' // Cambiar color del texto del input
  },
  '& .MuiTablePagination-displayedRows': { 
    fontStyle: 'italic', // Poner en itálica el "1–10 of 24"
    fontSize:15,
    color: 'var(--color-exito)'
  },
  '& .MuiTablePagination-actions': { 
    color: 'var(--color-secundario)', // Color azul en los botones de navegación
    '& button': {
      borderRadius: '50%', // Hacer los botones redondos
      margin:1,
      backgroundColor: 'var(--color-primario)',
      transition: '0.3s',
      '&:hover': {
        backgroundColor: 'var(--color-secundario)',
        color: 'var(--color-primario)'
      }
    }
  }
}