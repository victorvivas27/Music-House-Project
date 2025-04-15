import { useEffect, useState } from 'react'
import {
  Typography,
  FormControlLabel,
  CircularProgress,
  Box,
  Checkbox,
  styled
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
import { flexColumnContainer } from '@/components/styles/styleglobal'
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
      validateOnChange={true}
      validateOnBlur={true}
      validateOnMount={false}
      onSubmit={onSubmit}
      context={{ isUserAdmin }}
      
    >
      {({ values, errors, touched, setFieldValue, handleSubmit }) => (
        <form
          onSubmit={handleSubmit}
          style={{ 
            border: '1px solid blue',
          marginBottom:20,
          width:"90vw"
          }}
        >
          <fieldset
            disabled={loading}
            style={{
               border: 'none', 
               padding: 0, 
               margin: 0 ,
              display:"flex",
              flexDirection:"column",
              justifyContent:"center" ,
              alignItems:"center" 
            }}
          >
            <TitleResponsive> {title}</TitleResponsive>
            <AvatarUploader
              preview={preview}
              setPreview={setPreview}
              setFieldValue={setFieldValue}
              showError={showError}
            />

            <BasicInfoFields
              values={values}
              touched={touched}
              errors={errors}
            />

            <AddressFields
              addresses={values.addresses}
              touched={touched.addresses}
              errors={errors.addresses}
              setFieldValue={setFieldValue}
            />

            <PhoneFields
              phones={values.phones}
              touched={touched.phones}
              errors={errors.phones}
              setFieldValue={setFieldValue}
            />
            {initialFormData?.idUser && (
              <UserRolesSection
                roles={values.roles}
                isUserAdmin={isUserAdmin}
                setFieldValue={setFieldValue}
                showError={showError}
              />
            )}

            {showPasswordFields && (
              <PasswordFields
                values={values}
                touched={touched}
                errors={errors}
                setFieldValue={setFieldValue}
              />
            )}
            <TelegramField values={values} touched={touched} errors={errors} />
            {!initialFormData.idUser && !isUserAdmin && (
              <Box sx={flexColumnContainer}>
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
                  sx={{
                    color: 'var(--texto-primario)',
                    marginTop: '30px',
                    marginRight: '0'
                  }}
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
              </Box>
            )}

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
                    sx={{
                      fontWeight: '600',
                      color: 'var(--color-azul)'
                    }}
                  >
                    Ya tengo una cuenta
                    <ContactSupportRoundedIcon />
                  </ParagraphResponsive>
                </Link>
              )}
            </ContainerBottom>
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
