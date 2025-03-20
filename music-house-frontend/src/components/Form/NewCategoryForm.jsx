import { useCallback } from 'react'
import { CategoryForm } from './CategoryForm'
import { createCategory } from '../../api/categories'

import { useAppStates } from '../utils/global.context'
import { actions } from '../utils/actions'
import useAlert from '../../hook/useAlert'

export const NewCategoryForm = () => {
  const { state, dispatch } = useAppStates()
  const { showSuccess, showError } = useAlert()

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
          }, 1100)

          dispatch({
            type: actions.CATEGORY_CREATED,
            payload: { created: true }
          })
        }
      } catch (error) {
        showError(
          `❌ ${error?.data?.message || '⚠️ No se pudo conectar con el servidor.'}`
        )
      } finally {
        setTimeout(() => {
          dispatch({ type: actions.SET_LOADING, payload: false })
        }, 1000)
      }
    },
    [dispatch, showSuccess, showError]
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
