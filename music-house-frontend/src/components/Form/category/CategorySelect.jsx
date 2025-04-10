import { Select, MenuItem, Typography } from '@mui/material'
import { useCallback,  useEffect,  useMemo,  useState } from 'react'
import PropTypes from 'prop-types'
import { getCategories } from '@/api/categories'
import { useAppStates } from '@/components/utils/global.context'
import { actions } from '@/components/utils/actions'
import useAlert from '@/hook/useAlert'
import { getErrorMessage } from '@/api/getErrorMessage'

const PAGE_SIZE = 2 // Dinámico: cambiás acá según necesidad

const CategorySelect = ({ label, onChange, selectedCategoryId }) => {
  const { state, dispatch } = useAppStates()
  const categories = useMemo(() => state.categories?.content || [], [state.categories])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
 
  const { showError } = useAlert()
  const{ loading }=state

  const fetchCategories = useCallback(async () => {
    if (loading || !hasMore) return
      dispatch({ type: actions.SET_LOADING, payload: true })

    try {
      console.log(`🔄 Cargando página ${page} con size ${PAGE_SIZE}`)
      const response = await getCategories(page, PAGE_SIZE)
      const newCategories = response.result?.content || []

     
      const updated = [
        ...categories,
        ...newCategories.filter(
          (newCat) => !categories.some((cat) => cat.idCategory === newCat.idCategory)
        )
      ]

      dispatch({ type: actions.SET_CATEGORIES, payload: updated })
      console.log(categories);
      
      setHasMore(!response.result.last)
      setPage((prev) => prev + 1)
    } catch (error) {
      showError(`❌ ${getErrorMessage(error)}`)
    } finally {
       dispatch({ type: actions.SET_LOADING, payload:false })
    }
  }, [dispatch, hasMore, loading, page, showError, categories])

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories()
    }
  }, [fetchCategories, categories.length])

  const handleChange = (event) => {
    onChange?.({
      target: {
        name: 'idCategory',
        value: event.target.value
      }
    })
  }

  const handleScroll = (event) => {
    const bottom =
      event.target.scrollTop + event.target.clientHeight >= event.target.scrollHeight - 10

    if (bottom && hasMore && !loading) {
      fetchCategories()
    }
  }

  return (
    <Select
      displayEmpty
      fullWidth
      value={selectedCategoryId || ''}
      onChange={handleChange}
      label={label}
      color="secondary"
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
        <Typography variant="h6">🎸🎷Selecciona una Categoría 🥁🪘</Typography>
      </MenuItem>

      {categories.map((category) => (
        <MenuItem key={category.idCategory} value={category.idCategory}>
          {category.categoryName}
        </MenuItem>
      ))}

{categories.length === 0 && !loading && (
  <MenuItem disabled>
    <Typography variant="body2" sx={{ color: 'gray' }}>
      No hay categorías disponibles
    </Typography>
  </MenuItem>
)}
    </Select>
  )
}

CategorySelect.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  selectedCategoryId: PropTypes.string
}

export default CategorySelect