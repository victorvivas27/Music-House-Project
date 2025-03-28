import { useCallback } from 'react'
import { CategoryForm } from './CategoryForm'
import { createCategory } from '../../api/categories'

import { useAppStates } from '../utils/global.context'
import { actions } from '../utils/actions'
import useAlert from '../../hook/useAlert'
import { useNavigate } from 'react-router-dom'
import { getErrorMessage } from '../../api/getErrorMessage'

export const NewCategoryForm = () => {
  const { state, dispatch } = useAppStates()
  const { showSuccess, showError } = useAlert()
  const navigate = useNavigate()

  const initialFormData = {
    idCategory: '',
    categoryName: '',
    description: ''
  }

  const onSubmit = useCallback(
    async (formData) => {
      if (!formData) return

      dispatch({ type: actions.SET_LOADING, payload: true })

      try {
        const response = await createCategory({
          categoryName: formData.categoryName,
          description: formData.description
        })

        if (response?.message) {
          setTimeout(() => {
            showSuccess(`✅ ${response.message}`)
            navigate('/categories')
          }, 1100)

          dispatch({
            type: actions.CATEGORY_CREATED,
            payload: { created: true }
          })
        }
      } catch (error) {
        showError(`❌ ${getErrorMessage(error)}`)
      } finally {
        setTimeout(() => {
          dispatch({ type: actions.SET_LOADING, payload: false })
        }, 1000)
      }
    },
    [dispatch, showSuccess, navigate, showError]
  )

  return (
    <>
      <CategoryForm
        initialFormData={initialFormData}
        onSubmit={onSubmit}
        loading={state.loading}
      />
    </>
  )
}
