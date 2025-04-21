import { useAppStates } from "@/components/utils/global.context"
import { Box, IconButton, TextField } from "@mui/material"
import PropTypes from "prop-types"
import { useState } from "react"
import SearchIcon from '@mui/icons-material/Search'
const SearchBar = ({
    placeholder,
    searchFn,
    fetchAllFn,
    actionType,
    sortKey = 'name',
    defaultPage = 0,
    pageSize = 5,
    sortOrder = 'asc'
  }) => {
    const [localSearchTerm, setLocalSearchTerm] = useState('')
    const { dispatch } = useAppStates()
  
    const handleInputChange = async (event) => {
      const newTerm = event.target.value
      setLocalSearchTerm(newTerm)
      const sort = `${sortKey},${sortOrder}`
  
      try {
        const data =
          newTerm.trim() !== ''
            ? await searchFn(newTerm, defaultPage, pageSize, sort)
            : await fetchAllFn(defaultPage, pageSize, sort)
  
        dispatch({ type: actionType, payload: data.result })
      } catch (error) {
        dispatch({
          type: actionType,
          payload: { content: [], totalElements: 0 }
        })
      }
    }
  
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, px: 2 }}>
        <TextField
          label={placeholder}
          variant="outlined"
          value={localSearchTerm}
          onChange={handleInputChange}
          InputProps={{
            endAdornment: (
              <IconButton disabled>
                <SearchIcon sx={{ color: 'var(--color-azul)' }} />
              </IconButton>
            )
          }}
        />
      </Box>
    )
  }
  
  SearchBar.propTypes = {
    placeholder: PropTypes.string,
    searchFn: PropTypes.func.isRequired,
    fetchAllFn: PropTypes.func.isRequired,
    actionType: PropTypes.string.isRequired,
    sortKey: PropTypes.string,
    defaultPage: PropTypes.number,
    pageSize: PropTypes.number,
    sortOrder: PropTypes.string
  }
  
  export default SearchBar