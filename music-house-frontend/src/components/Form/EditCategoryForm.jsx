import { useState, useEffect, useCallback } from 'react'
import { Box } from '@mui/material'
import { CategoryForm } from './CategoryForm'
import { getCategoryById, updateCategory } from '../../api/categories'
import { Loader } from '../common/loader/Loader'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import useAlert from '../../hook/useAlert'
import { useAppStates } from '../utils/global.context'
import { actions } from '../utils/actions'
import { getErrorMessage } from '../../api/getErrorMessage'

export const EditCategoryForm = ({ id }) => {
  const [initialFormData, setInitialFormData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { state, dispatch } = useAppStates()
  const navigate = useNavigate()
  const { showSuccess, showError } = useAlert()

  const getCategory = useCallback(async () => {
    setLoading(true)

    try {
      const category = await getCategoryById(id)

      if (category?.result) {
        setTimeout(() => {
          setInitialFormData({
            idCategory: category.result.idCategory,
            categoryName: category.result.categoryName,
            description: category.result.description
          })
          setLoading(false)
        }, 100)
      } else {
        setInitialFormData(null)
        setLoading(false)
      }
    } catch (error) {
       setInitialFormData(null)
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    getCategory()
  }, [getCategory])

  const onSubmit = async (formData) => {
    if (!formData) return
    dispatch({ type: actions.SET_LOADING, payload: true })

    try {
      const response = await updateCategory(formData)

      if (response?.message) {
        setTimeout(() => {
          showSuccess(`✅ ${response.message}`)
          navigate('/categories')
        }, 1100)
      }
    } catch (error) {
      showError(`❌ ${getErrorMessage(error)}`)
    } finally {
      setTimeout(() => {
        dispatch({ type: actions.SET_LOADING, payload: false })
      }, 1000)
    }
  }

  if (loading) {
    return <Loader title="Un momento por favor" />
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
       
        <CategoryForm
          initialFormData={initialFormData}
          onSubmit={onSubmit}
          loading={state.loading}
        />
    
    </Box>
  )
}

EditCategoryForm.propTypes = {
  id: PropTypes.string.isRequired
}
