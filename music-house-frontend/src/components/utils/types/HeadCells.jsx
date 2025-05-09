export const headCellsReservas = [
  {
    id: 'verDetalles',
    numeric: false,
    disablePadding: false,
    label: 'Ver detalles',
    sx: { display: { xs: 'table-cell', md: 'none' } }
  },

  {
    id: 'imageUrl',
    numeric: true,
    disablePadding: false,
    label: 'Imagen'
  },
  {
    id: 'instrumentName',
    numeric: true,
    disablePadding: false,
    label: 'Instrumento',
    sx: { display: { xs: 'none', md: 'table-cell' } }
  },

  {
    id: 'idInstrument',
    numeric: true,
    disablePadding: false,
    label: 'Instrumento',
    hidden: true
  },
  {
    id: 'startDate',
    numeric: false,
    Date: true,
    disablePadding: false,
    label: 'Inicio',
    sx: { display: { xs: 'none', md: 'table-cell' } }
  },
  {
    id: 'endDate',
    numeric: false,
    Date: true,
    disablePadding: false,
    label: 'Entrega',
    sx: { display: { xs: 'none', md: 'table-cell' } }
  },
  {
    id: 'totalPrice',
    numeric: true,
    disablePadding: false,
    label: 'Precio Total',
    sx: { display: { xs: 'none', md: 'table-cell' } }
  },
  {
    id: 'email',
    numeric: false,
    disablePadding: false,
    label: 'email',
    sx: { display: { xs: 'none', md: 'table-cell' } }
  },
  {
    id: 'delete',
    numeric: false,
    disablePadding: false,
    label: 'Eliminar',
    sx: { display: { xs: 'none', md: 'table-cell' } }
  }
]

export const headCellsInstrument = [
  {
    id: 'index',
    numeric: true,
    disablePadding: false,
    label: 'N°',
    hidden: false,
    disableSort: true
  },
  {
    id: 'imageUrl',
    numeric: true,
    disablePadding: false,
    label: 'Imagen',
    disableSort: true
  },
 
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Nombre'
  },
  {
    id: 'themeName',
    numeric: false,
    disablePadding: false,
    label: 'Tematica',
    disableSort: true
  },
  {
    id: 'categoryName',
    numeric: false,
    disablePadding: false,
    label: 'Categoria',
    disableSort: true
  },
  {
    id: 'registDate',
    numeric: false,
    disablePadding: false,
    label: 'Registro'
  },
  {
    id: 'modifiedDate',
    numeric: false,
    disablePadding: false,
    label: 'Modificado'
  },
  {
    id: 'actions',
    numeric: false,
    disablePadding: false,
    label: 'Acciones',
    disableSort: true
  }
]

export const headCellsUser = [
  {
    id: 'index',
    numeric: true,
    disablePadding: false,
    label: 'N°',
    hidden: false,
    disableSort: true
  },
  {
    id: 'imageUrl',
    numeric: true,
    disablePadding: false,
    label: 'Imagen',
    disableSort: true
  },
  {
    id: 'rol',
    numeric: false,
    disablePadding: false,
    label: 'Rol',
    disableSort: true
  },
  { id: 'name', numeric: false, disablePadding: false, label: 'Nombre' },
  { id: 'lastName', numeric: false, disablePadding: false, label: 'Apellido' },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
  {
    id: 'registDate',
    numeric: false,
    disablePadding: false,
    label: 'Registro'
  },
  {
    id: 'modifiedDate',
    numeric: false,
    disablePadding: false,
    label: 'Modificado'
  },
  {
    id: 'actions',
    numeric: false,
    disablePadding: false,
    label: 'Acciones',
    disableSort: true
  }
]

export const headCellsCategory = [
  {
    id: 'index',
    numeric: true,
    disablePadding: false,
    label: 'N°',
    hidden: false,
    disableSort: true
  },

  {
    id: 'categoryName',
    numeric: false,
    disablePadding: false,
    label: 'Nombre'
  },
  {
    id: 'description',
    numeric: false,
    disablePadding: false,
    label: 'Descripción',
    disableSort: true
  },
  {
    id: 'registDate',
    numeric: false,
    disablePadding: false,
    label: 'Registro'
  },
  {
    id: 'modifiedDate',
    numeric: false,
    disablePadding: false,
    label: 'Modificado'
  },
  {
    id: 'actions',
    numeric: false,
    disablePadding: false,
    label: 'Acciones',
    disableSort: true
  }
]

export const headCellsTheme = [
  {
    id: 'index',
    numeric: true,
    disablePadding: false,
    label: 'N°',
    hidden: false,
    disableSort: true
  },
  {
    id: 'imageUrl',
    numeric: true,
    disablePadding: false,
    label: 'Imagen',
    disableSort: true
  },
  {
    id: 'themeName',
    numeric: false,
    disablePadding: false,
    label: 'Nombre'
  },
  {
    id: 'description',
    numeric: false,
    disablePadding: false,
    label: 'Descripción',
    disableSort: true
  },
  {
    id: 'registDate',
    numeric: false,
    disablePadding: false,
    label: 'Registro'
  },
  {
    id: 'modifiedDate',
    numeric: false,
    disablePadding: false,
    label: 'Modificado'
  },
  {
    id: 'actions',
    numeric: false,
    disablePadding: false,
    label: 'Acciones',
    disableSort: true
  }
]
