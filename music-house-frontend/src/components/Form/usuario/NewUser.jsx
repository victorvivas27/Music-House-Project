
import { UserForm } from './UserForm'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hook/useAuth'
import useAlert from '@/hook/useAlert'
import { UsersApi } from '@/api/users'
import { getErrorMessage } from '@/api/getErrorMessage'
import { actions } from '@/components/utils/actions'
import { useAppStates } from '@/components/utils/global.context'

const NewUser = ({ onSwitch }) => {
  const initialFormData = {
    name: '',
    picture: '',
    lastName: '',
    email: '',
    password: '',
    repeatPassword: '',
    telegramChatId: '',
    addresses: [{ street: '', number: '', city: '', state: '', country: '' }],
    phones: [{ phoneNumber: '', countryCode: '' }],
    roles: [],
    idRol: ''
  }

  const { setAuthData } = useAuth()
  const navigate = useNavigate()
  const { showSuccess, showError } = useAlert()
  const { isUserAdmin } = useAuth()
  const { dispatch, state } = useAppStates()

  const handleSubmit = async (formData) => {
    dispatch({ type: actions.SET_LOADING, payload: true })

    try {
      const formDataToSend = new FormData()
      const { picture, ...userWithoutPicture } = formData
      delete userWithoutPicture.repeatPassword
      formDataToSend.append('user', JSON.stringify(userWithoutPicture))

      if (picture instanceof File) {
        formDataToSend.append('file', picture)
      }

      const response = await UsersApi.registerUser(formDataToSend)

      if (response?.result?.token) {
        showSuccess(`✅${response.message}`)

        setTimeout(() => {
          if (isUserAdmin) {
            navigate(-1)
          } else {
            setAuthData({ token: response.result.token })
            navigate('/')
          }
        }, 1000)
      }
    } catch (error) {
      showError(`❌ ${getErrorMessage(error)}`)
    } finally {
      setTimeout(() => {
        dispatch({ type: actions.SET_LOADING, payload: false })
      }, 1000)
    }
  }

  return (
    <>
      <UserForm
        onSwitch={onSwitch}
        initialFormData={initialFormData}
        onSubmit={handleSubmit}
        loading={state.loading}
      />
    </>
  )
}

export default NewUser

NewUser.propTypes = {
  onSwitch: PropTypes.func
}
