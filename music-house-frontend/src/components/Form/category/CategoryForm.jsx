import { Box, FormControl, TextField, CircularProgress } from '@mui/material'
import PropTypes from 'prop-types'
import {
  inputStyles
} from '@/components/styles/styleglobal'
import {
  ContainerBottom,
  CustomButton
} from '@/components/styles/ResponsiveComponents'
import ArrowBack from '@/components/utils/ArrowBack'
import LoadingText from '@/components/common/loadingText/LoadingText'
import { ErrorMessage, Field, Formik } from 'formik'
import { CategoryValidationSchema } from '@/validations/category'

export const CategoryForm = ({ initialFormData, onSubmit, loading }) => {
  const title = initialFormData.idCategory
    ? 'Editar Categoría'
    : 'Registrar Categoría'

  return (
    <Formik
      initialValues={initialFormData}
      validationSchema={CategoryValidationSchema}
      onSubmit={(values) => {
        onSubmit(values)
      }}
    >
      {({ errors, touched,handleSubmit }) => (
        <fieldset
          disabled={loading}
          style={{ border: 'none', padding: 0, margin: 0 }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '600px',
              p: 4,
              border: '1px solid #ccc',
              borderRadius: 4,
              boxShadow: 3,
              backgroundColor: '#fff',
              gap: 3
            }}
          >
            {/* Nombre */}
            <FormControl>
              <Field
                as={TextField}
                label="Nombre"
                name="categoryName"
                
                multiline
                minRows={1}
                maxRows={5}
                sx={{ ...inputStyles }}
                error={touched.categoryName && Boolean(errors.categoryName)}
                helperText={<ErrorMessage name="categoryName" />}
              />
            </FormControl>
            {/* Descripción */}
            <FormControl>
              <Field
                as={TextField}
                label="Descripción"
                name="description"
                fullWidth
                multiline
                minRows={3}
                maxRows={10}
                
                sx={{ ...inputStyles }}
                error={touched.description && Boolean(errors.description)}
                helperText={<ErrorMessage name="description" />}
              />
            </FormControl>
            {/* Botón */}
            <ContainerBottom>
              <ArrowBack />

              <CustomButton disabled={loading} type="submit">
                {loading ? (
                  <>
                    <LoadingText text={title} />
                    <CircularProgress
                      size={30}
                      sx={{ ml: 1, color: 'var(--color-azul)' }}
                    />
                  </>
                ) : (
                  'Enviar'
                )}
              </CustomButton>
            </ContainerBottom>
          </Box>
        </fieldset>
      )}
    </Formik>
  )
}

CategoryForm.propTypes = {
  initialFormData: PropTypes.shape({
    idCategory: PropTypes.string,
    categoryName: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
}
