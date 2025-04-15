export const inputStyles = {
  width: "99%",
  color: 'var(--color-azul)',
  height: 70,
  '& .MuiInputBase-input': {
    color: 'var(--color-azul)',
    fontSize: '16px',

  },

  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'var(--color-secundario)',
      borderWidth: '2px',
      borderRadius: '8px',
      fontSize: '16px',

    },
    '&:hover fieldset': {
      borderColor: 'var(--color-primario)',
      fontSize: '16px',

    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--color-exito)',
      fontSize: '16px',

    }
  },

  '& .MuiInputLabel-root': {
    color: 'var(--color-azul)',
    fontSize: '18px',

  },

  '& .MuiInputLabel-root.Mui-focused': {
    color: 'var(--color-azul)',
    fontSize: '18px',

  }
}

export const flexRowContainer = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: "wrap"


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
    color: 'var(--color-azul)',
    textShadow: '0 1px 2px var(--color-primario)',
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
    color: 'var(--texto-inverso-black)',
    '& button': {
      borderRadius: '50%',
      margin: 1,
      backgroundColor: 'var(--color-primario)',
      transition: '0.3s',
      '&:hover': {
        backgroundColor: 'var(--color-primario)',
        color: 'var(--color-secundario)'
      }
    }
  }
}

export const fontSizeResponsi = {
  fontSize: {
    xs: '20px',
    sm: '23px',
    md: '25px',
    lg: '30px',
    xl: '35px'
  },
  marginRight: 1
}
