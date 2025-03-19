import { useMemo } from 'react'
import { alpha } from '@mui/material'
import {
  Box,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Checkbox,
  IconButton,
  Tooltip
} from '@mui/material'
import { visuallyHidden } from '@mui/utils'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import PropTypes from 'prop-types'

/*Funcion -------------------------------*/
const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

/* Fin  Funcion -------------------------------*/

/*Funcion -------------------------------*/
const getComparator = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}
/* Fin  Funcion -------------------------------*/

/*Funcion -------------------------------*/
const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}
/* Fin  Funcion -------------------------------*/

/*  Funcion -------------------------------*/
export const EnhancedTableHead = (props) => {
  const {
    headCells,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    disableSelectAll = false
  } = props
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          {!disableSelectAll && (
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'se seleccionaron todos los instrumentos'
              }}
            />
          )}
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            sx={{
              ...{ display: headCell.hidden ? 'none' : 'table-cell' },
              ...(headCell.sx ? headCell.sx : {})
            }}
            key={headCell.id}
            align={headCell.numeric ? 'center' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}
/* Fin  Funcion -------------------------------*/

/* Funcion -------------------------------*/
export const EnhancedTableToolbar = (props) => {
  const { numSelected, handleConfirmDelete } = props

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            )
        })
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} seleccionado{numSelected > 1 ? 's' : ''}
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {props.title}
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Eliminar EL Total Seleccionado">
          <IconButton onClick={handleConfirmDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title={props.titleAdd}>
          <IconButton onClick={props.handleAdd}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  )
}
/* Fin  Funcion -------------------------------*/

export const isSelected = (id, selected) => selected.indexOf(id) !== -1

export const handleSort = (
  event,
  property,
  orderBy,
  order,
  setOrderBy,
  setOrder
) => {
  const isAsc = orderBy === property && order === 'asc'
  setOrder(isAsc ? 'desc' : 'asc')
  setOrderBy(property)
}

export const handleSelectAll = (event, rows, idName, setSelected) => {
  if (event.target.checked) {
    const newSelected = rows.map((n) => n[idName])
    setSelected(newSelected)
    return
  }
  setSelected([])
}

export const handleSelected = (event, id, selected, setSelected) => {
  const selectedIndex = selected.indexOf(id)
  let newSelected = []

  if (selectedIndex === -1) {
    newSelected = newSelected.concat(selected, id)
  } else if (selectedIndex === 0) {
    newSelected = newSelected.concat(selected.slice(1))
  } else if (selectedIndex === selected.length - 1) {
    newSelected = newSelected.concat(selected.slice(0, -1))
  } else if (selectedIndex > 0) {
    newSelected = newSelected.concat(
      selected.slice(0, selectedIndex),
      selected.slice(selectedIndex + 1)
    )
  }
  setSelected(newSelected)
}

export const getEmptyRows = (page, rowsPerPage, rows) =>
  page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

export const useVisibleRows = (rows, order, orderBy, page, rowsPerPage) =>
  useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [rows, order, orderBy, page, rowsPerPage]
  )
// ✅ Validación para `EnhancedTableHead`
EnhancedTableHead.propTypes = {
  headCells: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      numeric: PropTypes.bool,
      disablePadding: PropTypes.bool,
      label: PropTypes.string.isRequired,
      hidden: PropTypes.bool,
      sx: PropTypes.object
    })
  ).isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  numSelected: PropTypes.number.isRequired,
  rowCount: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  disableSelectAll: PropTypes.bool
};

// ✅ Validación para `EnhancedTableToolbar`
EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  handleConfirmDelete: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  titleAdd: PropTypes.string,
  handleAdd: PropTypes.func
};