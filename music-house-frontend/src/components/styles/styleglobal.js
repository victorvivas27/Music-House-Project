export const inputStyles = {
  width: "99%",
  color: 'var(--texto-inverso-black)',
  textShadow: '0 1px 2px var(--color-primario)',
  '& .MuiInputBase-input': {
    color: 'var(--color-exito)',
    height: "10px",
    fontSize:21,
   

  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'var(--color-secundario)',
      borderWidth: '2px',
      borderRadius: '8px',
    
    },
    '&:hover fieldset': {
      borderColor: 'var(--color-primario)',
      textShadow: '0 1px 2px var(--color-primario)',

    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--color-exito)',

    },
  },

  '& .MuiInputLabel-root': {
    color: 'var(--texto-inverso-black)',
    textShadow: '0 1px 2px var(--color-primario)',

  },

  '& .MuiInputLabel-root.Mui-focused': {
    color: 'var(--texto-inverso-black)',
    textShadow: '0 1px 2px var(--color-primario)',
  },
};

export const flexRowContainer = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
 
};

export const flexColumnContainer = {
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
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
    fontSize: 15,
    color: 'var(--color-exito)'
  },
  '& .MuiTablePagination-actions': {
    color: 'var(--color-secundario)',
    '& button': {
      borderRadius: '50%',
      margin: 1,
      backgroundColor: 'var(--color-primario)',
      transition: '0.3s',
      '&:hover': {
        backgroundColor: 'var(--color-secundario)',
        color: 'var(--color-primario)'
      }
    }
  }
}

export const fontSizeResponsi = {
  fontSize: {
    xs: '20px',
    sm: '23px',
    md: '24px',
    lg: '25px'
  },
  marginRight: 1
}