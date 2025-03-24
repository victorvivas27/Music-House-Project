import { Select, MenuItem, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { getCategories } from '../../api/categories'
import { Loader } from '../common/loader/Loader'
import PropTypes from 'prop-types'
//import useAlert from '../../hook/useAlert'

const CategorySelect = ({label, onChange,selectedCategoryId = undefined}) => {
  const [categories, setCategories] = useState([]) 
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')


  // ✅ Obtener categorias del backend
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await getCategories()
        setCategories(response.result || [])
      } catch (error) {
      
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategory()
  }, [])

  // ✅ Establecer la categoría seleccionada desde prop
  useEffect(() => {
    if (!selectedCategoryId || categories.length === 0) return

    const foundCategory = categories.find(
      (category) => category.idCategory === selectedCategoryId
    )
    if (foundCategory) {
      setSelectedCategory(foundCategory)
    }
  }, [selectedCategoryId, categories])

  // ✅ Comunicar cambio al padre
  useEffect(() => {
    if (loading || !selectedCategory) return
    if (typeof onChange === 'function') {
      onChange({
        target: {
          name: 'idCategory',
          value: selectedCategory.idCategory
        }
      })
    }
  }, [selectedCategory, loading, onChange])

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value)
  }

  if (loading) {
    return <Loader fullSize={false} />
  }

  return (
    <Select
      displayEmpty
      value={selectedCategory}
      onChange={handleCategoryChange}
      label={label}
      color="secondary"
    >
      <MenuItem value="" disabled>
        <Typography variant="h6">🎸🎷Selecciona una Categoría 🥁🪘</Typography>
      </MenuItem>

      {categories.map((category, index) => (
        <MenuItem key={`category-select-${index}`} value={category}>
          {category.categoryName}
        </MenuItem>
      ))}
    </Select>
  )
}

export default CategorySelect

CategorySelect.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  selectedCategoryId: PropTypes.string
}
