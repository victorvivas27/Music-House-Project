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

  const fetchItems = useCallback(async (overridePage = page) => {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const res = await fetchDataFn(overridePage, pageSize)
      const newItems = res?.result?.content || []
      setItems(prev => [
        ...prev,
        ...newItems.filter(n => !prev.some(p => getId(p) === getId(n)))
      ])
      setHasMore(!res?.result?.last)
      setPage(prev => prev + 1)
    } catch (err) {
      console.error('⚠️ Error al cargar:', err)
    } finally {
      setLoading(false)
    }
  }, [fetchDataFn, page, pageSize, loading, hasMore, getId])

  useEffect(() => {
    if (items.length === 0) fetchItems()
  }, [fetchItems, items.length])

  useEffect(() => {
    const ensureSelectedLoaded = async () => {
      if (selectedValue && !items.some(i => getId(i) === selectedValue)) {
        try {
          const res = await fetchDataFn(0, pageSize * 3)
          const match = res?.result?.content?.find(i => getId(i) === selectedValue)
          if (match) setItems(prev => [...prev, match])
        } catch (err) {
          console.error('⚠️ Error cargando valor seleccionado:', err)
        }
      }
    }
    ensureSelectedLoaded()
  }, [selectedValue, items, fetchDataFn, getId, pageSize])

  const handleScroll = e => {
    const bottom = e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight - 10
    if (bottom) fetchItems()
  }

  return (
    <FormControl fullWidth variant="outlined" margin="normal" sx={inputStyles}>
      <InputLabel id={`${name}-label`}>{label}</InputLabel>
      <Select
        labelId={`${name}-label`}
        value={selectedValue || ''}
        onChange={e => onChange({ target: { name, value: e.target.value } })}
        label={label}
        name={name}
        MenuProps={{
          PaperProps: {
            sx: { height: 130, overflowY: 'auto' },
            onScroll: handleScroll
          }
        }}
      >
        <MenuItem value="" disabled>
          <Typography variant="body1">{label}</Typography>
        </MenuItem>

        {items.map(item => (
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
