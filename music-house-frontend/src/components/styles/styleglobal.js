export const inputStyles = {
  width: "90%", 
  color: 'var(--color-azul)', 
  '& .MuiInputBase-input': {
    color: 'var(--color-azul)',
    height:"10px",
  
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'var(--color-secundario)',
      borderWidth: '2px',
      borderRadius: '8px',
    },
    '&:hover fieldset': {
      borderColor: 'var(--color-primario)',
     
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--color-exito)', 
    },
  },

  '& .MuiInputLabel-root': {
    color: 'var(--color--azul)',
  },

  '& .MuiInputLabel-root.Mui-focused': {
    color: 'var(--color-azul)', 
  },
};

export const flexRowContainer = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '10px',
  flexWrap: 'wrap',
  boxShadow: '3px 3px 8px rgba(0, 0, 0, 0.1)',
  padding: '10px',
};

export const flexColumnContainer = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-evenly',
  boxShadow: '3px 3px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '12px',
  padding: '15px', 
  maxWidth: '100%', 
};

export const paginationStyles = {
  '& .MuiTablePagination-toolbar': { 
    backgroundColor: 'lightgray', 
    padding: '10px' 
  },
  '& .MuiTablePagination-selectLabel': { 
    fontWeight: 'bold',
    color: 'var(--color-azul)'
  },
  '& .MuiTablePagination-input': { 
    fontSize: '16px',
    color: 'var(--color-error)' 
  },
  '& .MuiTablePagination-displayedRows': { 
    fontStyle: 'italic',
    fontSize:15,
    color: 'var(--color-exito)'
  },
  '& .MuiTablePagination-actions': { 
    color: 'var(--color-secundario)',
    '& button': {
      borderRadius: '50%', 
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