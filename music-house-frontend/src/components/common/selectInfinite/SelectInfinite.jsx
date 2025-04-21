import { getErrorMessage } from '@/api/getErrorMessage'
import { inputStyles } from '@/components/styles/styleglobal'
import useAlert from '@/hook/useAlert'
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
  pageSize = 5,
  fetchSingleItemFn
}) => {
  const [items, setItems] = useState([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const { showError } = useAlert()

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
    } catch (error) {
       showError(`❌ ${getErrorMessage(error)}`)
    } finally {
      setLoading(false)
    }
  }, [page, loading, hasMore, fetchDataFn, pageSize, getId, showError])

  useEffect(() => {
    if (items.length === 0) fetchItems()
  }, [fetchItems, items.length])

  useEffect(() => {
    const ensureSelectedLoaded = async () => {
    
   if (selectedValue && !items.some(i => getId(i) === selectedValue)) {
        try {
          let match = null
  
          if (fetchSingleItemFn) {
            match = (await fetchSingleItemFn(selectedValue))?.result
          } else {
            const res = await fetchDataFn(0, pageSize * 5)
            match = res?.result?.content?.find(i => getId(i) === selectedValue)
          }
  
          if (match && getId(match)) {
            setItems(prev => [...prev, match])
          }
        } catch (error) {
          showError(`❌ ${getErrorMessage(error)}`)
        }
      }
    }
  
    ensureSelectedLoaded()
  }, [selectedValue, items, fetchDataFn, getId, pageSize, fetchSingleItemFn, showError])

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
            sx: { height: 120, overflowY: 'auto' },
            onScroll: handleScroll
          }
        }}
      >
        <MenuItem value="" disabled>
          <Typography variant="body1">{label}</Typography>
        </MenuItem>
        {items.map((item, index) => (
  <MenuItem key={`${getId(item) ?? index}`} value={getId(item)}>
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
  pageSize: PropTypes.number,
  fetchSingleItemFn: PropTypes.func,
}

export default SelectInfinete
