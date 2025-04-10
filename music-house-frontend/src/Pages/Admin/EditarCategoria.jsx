import { useNavigate, useParams } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import { useHeaderVisibility } from '@/components/utils/context/HeaderVisibilityGlobal'
import { CreateWrapper, TitleResponsive } from '@/components/styles/ResponsiveComponents'
import { CategoryForm } from '@/components/Form/category/CategoryForm'
import { useEffect, useState } from 'react'
import { getCategoryById, updateCategory } from '@/api/categories'
import { useAppStates } from '@/components/utils/global.context'
import useAlert from '@/hook/useAlert'
import { actions } from '@/components/utils/actions'
import { getErrorMessage } from '@/api/getErrorMessage'
import { Loader } from '@/components/common/loader/Loader'
export const EditarCategoria = () => {
  const { isHeaderVisible } = useHeaderVisibility()
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, dispatch } = useAppStates()
  const { showSuccess, showError } = useAlert()
  const [initialFormData, setInitialFormData] = useState(null)
  
 

  useEffect(() => {
    const fetchCategory = async () => {
      dispatch({ type: actions.SET_LOADING, payload: true })
      try {
        const category = await getCategoryById(id)
        if (category?.result) {
          setInitialFormData({
            idCategory: category.result.idCategory,
            categoryName: category.result.categoryName,
            description: category.result.description
          })
        }
      } catch (err) {
        showError(`❌ ${err.message}`)
      } finally {
        dispatch({ type: actions.SET_LOADING, payload: false })
      }
    }

    fetchCategory()
  }, [dispatch, id, showError])

  const onSubmit = async (formData) => {
    if (!formData) return

    dispatch({ type: actions.SET_LOADING, payload: true })
    try {
      const response = await updateCategory(formData)

      if (response?.message) {
        showSuccess(`✅ ${response.message}`)
        navigate('/categories')
      }
    } catch (error) {
      showError(`❌ ${getErrorMessage(error)}`)
    } finally {
      dispatch({ type: actions.SET_LOADING, payload: false })
    }
  }

  if (state.loading) return <Loader title="Un momento por favor..." />

  return (
    <main>
      <CreateWrapper isHeaderVisible={isHeaderVisible}>
        <TitleResponsive>Editar Categoría</TitleResponsive>
        <CategoryForm
          initialFormData={initialFormData}
          onSubmit={onSubmit}
          loading={state.loading}
        />
      </CreateWrapper>

      {/* Responsive Warning */}
      <Box
        sx={{
          display: { xs: 'flex', lg: 'none' },
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100vh'
        }}
      >
        <Typography
          variant="h6"
          textAlign="center"
          sx={{ paddingTop: 30, fontWeight: 'bold' }}
        >
          Funcionalidad no disponible en esta resolución
        </Typography>
      </Box>
    </main>
  )
}
