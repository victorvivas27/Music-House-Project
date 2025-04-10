import { inputStyles } from '@/components/styles/styleglobal'
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from '@mui/material'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useState } from 'react'

const SelectInfinete = ({
    label,
    name,
    selectedValue,
    onChange,
    fetchDataFn,
    getId,
    getLabel,
    pageSize = 5
  }) => {
    const [items, setItems] = useState([])
    const [page, setPage] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false)
  
    const fetchItems = useCallback(async () => {
      if (loading || !hasMore) return
      setLoading(true)
      try {
        const response = await fetchDataFn(page, pageSize)
        const newItems = response?.result?.content || []
        setItems((prev) => [
          ...prev,
          ...newItems.filter(
            (newItem) => !prev.some((item) => getId(item) === getId(newItem))
          )
        ])
        setHasMore(!response?.result?.last)
        setPage((prev) => prev + 1)
      } catch (e) {
        console.error('Error cargando datos:', e)
      } finally {
        setLoading(false)
      }
    }, [fetchDataFn, page, pageSize, hasMore, loading, getId])
  
    useEffect(() => {
      if (items.length === 0) {
        fetchItems()
      }
    }, [fetchItems, items.length])
  
    const handleScroll = (event) => {
      const bottom =
        event
        .target
        .scrollTop + event
        .target.clientHeight >= event
        .target
        .scrollHeight - 10
      if (bottom && hasMore && !loading) {
        fetchItems()
      }
    }
  
    const handleChange = (event) => {
      onChange?.({
        target: {
          name,
          value: event.target.value
        }
      })
    }
  
    return (
      <FormControl 
      fullWidth
      variant="outlined" 
      margin="normal"
      sx={{...inputStyles}}
      >
        <InputLabel id={`${name}-label`}>{label}</InputLabel>
        <Select
          labelId={`${name}-label`}
          value={selectedValue || ''}
          onChange={handleChange}
          label={label}
          name={name}
          MenuProps={{
            PaperProps: {
              sx: {
                height: 120,
                overflowY: 'auto'
              },
              onScroll: handleScroll
            }
          }}
        >
          <MenuItem value="" disabled>
            <Typography variant="body1">{label}</Typography>
          </MenuItem>
  
          {items.map((item) => (
            <MenuItem key={getId(item)} value={getId(item)}>
              {getLabel(item)}
            </MenuItem>
          ))}
  
          {loading && (
            <MenuItem disabled>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Cargando más...
            </MenuItem>
          )}
        </Select>
      </FormControl>
    )
  }
  
  SelectInfinete.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    selectedValue: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    fetchDataFn: PropTypes.func.isRequired,
    getId: PropTypes.func.isRequired,
    getLabel: PropTypes.func.isRequired,
    pageSize: PropTypes.number
  }
  
  export default SelectInfinete
