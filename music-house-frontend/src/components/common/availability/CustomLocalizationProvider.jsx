import { styled } from '@mui/material/styles'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

export const CustomLocalizationProvider = styled(LocalizationProvider)(
  ({ theme }) => ({
    display: 'flex',
    paddingBottom: '1rem',
    width: '100%',
    justifyContent: 'center'
  })
)
