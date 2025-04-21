import {
  Box,
  Grid,
  Tooltip,
  Checkbox,
  FormHelperText,
  CircularProgress,
  FormControl,
  TextField
} from '@mui/material'
import { useAppStates } from '@/components/utils/global.context'

import ImageUrlsEdit from '@/components/common/imageUrls/ImageUrlsEdit'

import {
  ContainerBottom,
  CustomButton,
  ParagraphResponsive,
  TitleResponsive
} from '@/components/styles/ResponsiveComponents'
import ArrowBack from '@/components/utils/ArrowBack'
import LoadingText from '@/components/common/loadingText/LoadingText'
import PropTypes from 'prop-types'
import SelectInfinete from '@/components/common/selectInfinite/SelectInfinite'
import { getCategories, getCategoryById } from '@/api/categories'
import { getTheme, getThemeById } from '@/api/theme'
import ImageUploadMultiple from './ImageUploadMultiple'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import SmsFailedIcon from '@mui/icons-material/SmsFailed'
import { validationSchema } from '@/validations/instrument'
import { inputStyles } from '@/components/styles/styleglobal'
import TooltipMy from '@/components/common/toolTip/ToolTipMy'

const InstrumentForm = ({
  initialFormData,
  onSubmit,
  loading,
  isEditing = false
}) => {
  const { state } = useAppStates()
  const title = isEditing ? 'Editar Instrumento' : 'Crear Instrumento'
  const titleDelLoader = isEditing ? 'Editando' : 'Creando Instrumento'

  return (
    <Formik
      initialValues={initialFormData}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {({ values, errors, touched, setFieldValue }) => (
        <fieldset
          disabled={loading}
          style={{ border: 'none', padding: 0, margin: 0 }}
        >
          <Box
            component={Form}
            sx={{
              minWidth: '1100px',
              p: 4,
              borderRadius: 4,
              boxShadow: "var(--box-shadow)",
              display: 'flex',
              flexDirection: 'column',
              marginBottom:10
            }}
          >
            <Grid container spacing={4}>
              <Grid
                item
                xs={12}
                md={6}
                display="flex"
                flexDirection="column"
                gap={6}
              >
                <FormControl>
                  <Field
                    as={TextField}
                    name="name"
                    label="Nombre"
                    sx={inputStyles}
                    error={touched.name && Boolean(errors.name)}
                    helperText={<ErrorMessage name="name" />}
                  />
                </FormControl>

                <FormControl>
                  <Field
                    as={TextField}
                    name="description"
                    label="Descripción"
                    multiline
                    minRows={3}
                    maxRows={10}
                    sx={inputStyles}
                    error={touched.description && Boolean(errors.description)}
                    helperText={<ErrorMessage name="description" />}
                  />
                </FormControl>

                <FormControl>
                  <Field
                    as={TextField}
                    name="measures"
                    label="Medidas"
                    sx={inputStyles}
                    error={touched.measures && Boolean(errors.measures)}
                    helperText={<ErrorMessage name="measures" />}
                  />
                </FormControl>

                <FormControl>
                  <Field
                    as={TextField}
                    name="weight"
                    label="Peso"
                    sx={inputStyles}
                    error={touched.weight && Boolean(errors.weight)}
                    helperText={<ErrorMessage name="weight" />}
                  />
                </FormControl>

                <FormHelperText>
                  ℹ️ Menos de 1 kg se muestra en gramos. 1.4 → 1 kilo 400
                  gramos.
                </FormHelperText>
              </Grid>

              <Grid
                item
                xs={12}
                md={6}
                display="flex"
                flexDirection="column"
                gap={2}
              >
                <Box sx={{ display: 'flex' }}>
                  <SelectInfinete
                    label="🎸🎷Selecciona una Categoría 🥁🪘"
                    name="idCategory"
                    selectedValue={values.idCategory}
                    onChange={(e) =>
                      setFieldValue('idCategory', e.target.value)
                    }
                    fetchDataFn={getCategories}
                    fetchSingleItemFn={getCategoryById}
                    getId={(cat) => cat.idCategory}
                    getLabel={(cat) => cat.categoryName}
                    pageSize={2}
                  />

                  <TooltipMy
                    message="⚠️ Recuerda seleccionar una categoría antes de continuar."
                    textColor="whithe"
                    backgroundColor="orange"
                    fontSize="12px"
                    width="350px"
                  >
                    <SmsFailedIcon sx={{ color: 'orange' }} />
                  </TooltipMy>
                </Box>

                <Box sx={{ display: 'flex' }}>
                  <SelectInfinete
                    label="🎭 Selecciona una temática"
                    name="idTheme"
                    selectedValue={values.idTheme}
                    onChange={(e) =>
                       setFieldValue('idTheme', e.target.value)}
                    fetchDataFn={getTheme}
                    fetchSingleItemFn={getThemeById}
                    getId={(item) => item.idTheme}
                    getLabel={(item) => item.themeName}
                    pageSize={2}
                  />
                  <TooltipMy
                    message="⚠️ No olvides elegir una temática para tu instrumento."
                    textColor="whithe"
                    backgroundColor="orange"
                    fontSize="12px"
                    width="350px"
                  >
                    <SmsFailedIcon sx={{ color: 'orange' }} />
                  </TooltipMy>
                </Box>

                <FormControl>
                  <Field
                    as={TextField}
                    name="rentalPrice"
                    label="Precio"
                    fullWidth
                    sx={inputStyles}
                    error={touched.rentalPrice && Boolean(errors.rentalPrice)}
                    helperText={<ErrorMessage name="rentalPrice" />}
                  />
                </FormControl>

                <ImageUrlsEdit idInstrument={values.idInstrument} />
              </Grid>
            </Grid>

            <Box
              sx={{
                border: '1px dashed #aaa',
                borderRadius: 2,
                padding: 2,
                backgroundColor: '#fff'
              }}
            >
              <ImageUploadMultiple
                initialImages={values.imageUrls || []}
                onImagesChange={(files) => setFieldValue('imageUrls', files)}
              />
              <ErrorMessage name="imageUrls">
                {(msg) => (
                  <ParagraphResponsive color="var(--color-error)" mt={1}>
                    {msg}
                  </ParagraphResponsive>
                )}
              </ErrorMessage>
            </Box>

            <Box sx={{ width: '100%' }}>
              <TitleResponsive gutterBottom>Características</TitleResponsive>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: 2
                }}
              >
                {state?.characteristics?.map((charac) => (
                  <Box
                    key={charac.id}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}
                  >
                    <Tooltip title={charac.name}>
                      <img
                        src={charac.image}
                        alt={charac.name}
                        style={{
                          width: '90px',
                          height: '90px',
                          objectFit: 'cover',
                          border: '2px solid #ccc',
                          borderRadius: '8px',
                          padding: '4px',
                          backgroundColor: '#fff',
                          boxShadow: 'var(--box-shadow)',
                          cursor: 'pointer',
                          transition: 'transform 0.2s'
                        }}
                      />
                    </Tooltip>
                    <Checkbox
                      checked={values.characteristics?.[charac.id] || false}
                      color="secondary"
                      onChange={() => {
                        setFieldValue('characteristics', {
                          ...values.characteristics,
                          [charac.id]: !values.characteristics?.[charac.id]
                        })
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>

            <ArrowBack />

            <ContainerBottom>
              <CustomButton type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <LoadingText text={titleDelLoader} />
                    <CircularProgress
                      size={25}
                      sx={{ color: 'var(--color-azul)', ml: 1 }}
                    />
                  </>
                ) : (
                  title
                )}
              </CustomButton>
            </ContainerBottom>
          </Box>
        </fieldset>
      )}
    </Formik>
  )
}

InstrumentForm.propTypes = {
  initialFormData: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  isEditing: PropTypes.bool
}

export default InstrumentForm
