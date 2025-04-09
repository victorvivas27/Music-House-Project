
import { Box, CircularProgress, TextField, FormControl } from '@mui/material'
import PropTypes from 'prop-types'
import ArrowBack from '../../utils/ArrowBack'
import { inputStyles } from '../../styles/styleglobal'
import ImageUpload from '../../common/imageUrls/ImageUpload '
import LoadingText from '../../common/loadingText/LoadingText'
import {
  ContainerBottom,
  CustomButton,
  ParagraphResponsive
} from '../../styles/ResponsiveComponents'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { ThemeValidationSchema } from '@/validations/theme'


export const ThemeForm = ({ initialFormData, onSubmit, loading }) => {
  const title = initialFormData.idTheme
    ? 'Editar Temática'
    : 'Registrar Temática'

  return (
    <Formik
      initialValues={initialFormData}
      validationSchema={ThemeValidationSchema}
      onSubmit={(values) => {
        onSubmit(values)
      }}
    >
      {({  errors, touched, setFieldValue }) => (
        <fieldset
          disabled={loading}
          style={{ border: 'none', padding: 0, margin: 0 }}
        >
          <Box
            component={Form}
            sx={{
              width: '700px',
              margin: '0 auto',
              p: 4,
              border: '1px solid #ccc',
              borderRadius: 4,
              boxShadow: 3,
              backgroundColor: '#fff',
              display: 'flex',
              flexDirection: 'column',
              gap: 3
            }}
          >
            {/* Nombre */}
            <FormControl>
              <Field
                as={TextField}
                label="Nombre"
                name="themeName"
                fullWidth
                multiline
                minRows={1}
                maxRows={5}
                sx={{ ...inputStyles }}
                error={touched.themeName && Boolean(errors.themeName)}
                helperText={<ErrorMessage name="themeName" />}
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

            {/* Imagen */}
            <Box
              sx={{
                border: '1px dashed #aaa',
                borderRadius: 2,
                padding: 2,
                backgroundColor: '#fafafa'
              }}
            >
              <ImageUpload
                onImagesChange={(files) => {
                  const file = files?.[0] || null
                  setFieldValue('imageUrlTheme', file)
                }}
              />
              {touched.imageUrlTheme && errors.imageUrlTheme && (
                <ParagraphResponsive color="var(--color-error)" mt={1}>
                  {errors.imageUrlTheme}
                </ParagraphResponsive>
              )}
            </Box>

            {/* Botón */}
            <ContainerBottom>
              <ArrowBack />
              <CustomButton disabled={loading} type="submit">
                {loading ? (
                  <>
                    <LoadingText text={title} />
                    <CircularProgress
                      size={24}
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

ThemeForm.propTypes = {
  initialFormData: PropTypes.shape({
    idTheme: PropTypes.string,
    themeName: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    imageUrlTheme: PropTypes.any
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
}
