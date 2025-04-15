import { useEffect, useState } from 'react'
import {
  Typography,
  FormControlLabel,
  CircularProgress,
  Checkbox,
  styled,
  Grid
} from '@mui/material'
import Link from '@mui/material/Link'
import PropTypes from 'prop-types'
import ContactSupportRoundedIcon from '@mui/icons-material/ContactSupportRounded'
import { useAuth } from '@/hook/useAuth'
import useAlert from '@/hook/useAlert'
import {
  ContainerBottom,
  CustomButton,
  ParagraphResponsive,
  TitleResponsive
} from '@/components/styles/ResponsiveComponents'

import LoadingText from '@/components/common/loadingText/LoadingText'
import { ErrorMessage, Formik } from 'formik'
import { userValidationSchema } from '@/validations/userValidationSchema'
import { AddressFields } from './AddressFields'
import { PhoneFields } from './PhoneFields'
import { AvatarUploader } from './AvatarUploader'
import { PasswordFields } from './PasswordFields'
import { UserRolesSection } from './UserRolesSection'
import { BasicInfoFields } from './BasicInfoFields'
import { TelegramField } from './TelegramField'
const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
  color: 'black',
  '&.Mui-checked': {
    color: theme.palette.secondary.main
  },
  '& .MuiSvgIcon-root': {
    fontSize: 32
  }
}))

export const UserForm = ({
  onSwitch,
  initialFormData,
  onSubmit,
  loading,
  isSubmitting,
  user
}) => {
  const [preview, setPreview] = useState(null)
  const { isUserAdmin } = useAuth()
  const { showError } = useAlert()
  const idUser = user?.data?.idUser || null
  const isLoggedUser = idUser && idUser === Number(initialFormData?.idUser)
  const isNewUser = !initialFormData.idUser

  const showPasswordFields =
    (!isUserAdmin && isNewUser) || (isUserAdmin && isNewUser)

  const title = isLoggedUser
    ? 'Mi perfil'
    : initialFormData.idUser
      ? 'Editar cuenta usuario'
      : 'Crear una cuenta'

  const combinedLoading = loading || isSubmitting
  const buttonText =
    initialFormData.idUser || isUserAdmin ? 'Guardar' : 'Registrar'
  const buttonTextLoading =
    initialFormData.idUser || isUserAdmin ? 'Guardando' : 'Registrando'

  useEffect(() => {
    if (
      initialFormData.picture &&
      typeof initialFormData.picture === 'string'
    ) {
      setPreview(initialFormData.picture)
    }
  }, [initialFormData.picture])

  const formikInitialValues = {
    ...initialFormData,
    idUser: initialFormData.idUser || null,
    accept: !!initialFormData.idUser || isUserAdmin,
    roles: initialFormData.roles || [],
    addresses: initialFormData.addresses || [
      { street: '', number: '', city: '', state: '', country: '' }
    ],
    phones: initialFormData.phones || [{ countryCode: '', phoneNumber: '' }]
  }

  return (
    <Formik
      initialValues={formikInitialValues}
      validationSchema={userValidationSchema}
      validateOnChange
      validateOnBlur
      onSubmit={onSubmit}
      context={{ isUserAdmin }}
    >
      {({ values, errors, touched, setFieldValue, handleSubmit }) => (
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.13)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            borderRadius: '12px',
            marginBottom: '20px',
            boxShadow: 'var(--box-shadow)',
            padding: '24px',
            width: '100%',
            maxWidth: '1300px',
            marginInline: 'auto'
          }}
        >
          <fieldset
            disabled={loading}
            style={{ border: 'none', padding: 0, margin: 0 }}
          >
            <TitleResponsive sx={{ mb: 4 }}>{title}</TitleResponsive>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <AvatarUploader
                  preview={preview}
                  setPreview={setPreview}
                  setFieldValue={setFieldValue}
                  showError={showError}
                />
              </Grid>

              <Grid item xs={12}>
                <TitleResponsive>Información Personal</TitleResponsive>
                <BasicInfoFields
                  values={values}
                  touched={touched}
                  errors={errors}
                />
              </Grid>

              <Grid item xs={12}>
                <TitleResponsive>Dirección</TitleResponsive>
                <AddressFields
                  addresses={values.addresses}
                  touched={touched.addresses}
                  errors={errors.addresses}
                  setFieldValue={setFieldValue}
                />
              </Grid>

              <Grid item xs={12}>
                <TitleResponsive>Teléfono</TitleResponsive>
                <PhoneFields
                  phones={values.phones}
                  touched={touched.phones}
                  errors={errors.phones}
                  setFieldValue={setFieldValue}
                />
              </Grid>

              {initialFormData?.idUser && (
                <Grid item xs={12}>
                  <TitleResponsive>Roles del Usuario</TitleResponsive>
                  <UserRolesSection
                    roles={values.roles}
                    isUserAdmin={isUserAdmin}
                    setFieldValue={setFieldValue}
                    showError={showError}
                  />
                </Grid>
              )}

              {showPasswordFields && (
                <Grid item xs={12}>
                  <TitleResponsive>Contraseña</TitleResponsive>
                  <PasswordFields
                    values={values}
                    touched={touched}
                    errors={errors}
                    setFieldValue={setFieldValue}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <TitleResponsive>Telegram</TitleResponsive>
                <TelegramField
                  values={values}
                  touched={touched}
                  errors={errors}
                />
              </Grid>

              {!initialFormData.idUser && !isUserAdmin && (
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <CustomCheckbox
                        checked={values.accept}
                        onChange={(e) =>
                          setFieldValue('accept', e.target.checked)
                        }
                      />
                    }
                    label={
                      <ParagraphResponsive sx={{ fontWeight: 'bold' }}>
                        Acepto los términos y condiciones del servicio
                      </ParagraphResponsive>
                    }
                  />
                  <ErrorMessage name="accept">
                    {(msg) => (
                      <Typography
                        sx={{
                          marginTop: '5px',
                          color: 'var(--color-error)',
                          minHeight: '40px',
                          textAlign: 'center'
                        }}
                      >
                        {msg}
                      </Typography>
                    )}
                  </ErrorMessage>
                </Grid>
              )}

              <Grid item xs={12}>
                <ContainerBottom>
                  <CustomButton type="submit" disabled={loading}>
                    {combinedLoading ? (
                      <>
                        <LoadingText text={buttonTextLoading} />
                        <CircularProgress
                          size={30}
                          sx={{ color: 'var(--color-azul)' }}
                        />
                      </>
                    ) : (
                      buttonText
                    )}
                  </CustomButton>

                  {!initialFormData.idUser && !isUserAdmin && (
                    <Link
                      href=""
                      underline="always"
                      onClick={onSwitch}
                      sx={{
                        color: 'var(--texto-primario)',
                        marginTop: { xs: '40px', md: '20px' }
                      }}
                    >
                      <ParagraphResponsive
                        sx={{ fontWeight: '600', color: 'var(--color-azul)' }}
                      >
                        Ya tengo una cuenta <ContactSupportRoundedIcon />
                      </ParagraphResponsive>
                    </Link>
                  )}
                </ContainerBottom>
              </Grid>
            </Grid>
          </fieldset>
        </form>
      )}
    </Formik>
  )
}

UserForm.propTypes = {
  onSwitch: PropTypes.func,
  initialFormData: PropTypes.object,
  loading: PropTypes.bool,
  onSubmit: PropTypes.func,
  isSubmitting: PropTypes.bool,
  user: PropTypes.object
}
