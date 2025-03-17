export const headCells = [
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
    label: '',
    sx: { display: { xs: 'none', md: 'table-cell' } }
  }
]

 export const headCellsInstrument = [
  {
    id: 'idInstrument',
    numeric: true,
    disablePadding: false,
    label: 'ID'
  },
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Nombre'
  },
  {
    id: 'actions',
    numeric: false,
    disablePadding: false,
    label: 'Acciones'
  }
]
