import { inputStyles } from '@/components/styles/styleglobal'
import { countryCodes } from '@/components/utils/codepaises/CountryCodes'
import {
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material'
import PropTypes from 'prop-types'

export const PhoneFields = ({ phones, touched, errors, setFieldValue }) => {
  return (
    <Grid container spacing={2}>
      {phones.map((phone, index) => (
        <Grid container spacing={2} key={index}>
          {/* Select para código de país */}
          <Grid item xs={12} md={4}>
            <FormControl sx={{ ...inputStyles, mt: 2 }}>
              <Select
                displayEmpty
                value={phone.countryCode}
                onChange={(e) => {
                  const newCode = e.target.value
                  const currentNumber = phones[index].phoneNumber.replace(
                    phones[index].countryCode,
                    ''
                  )
                  const updatedFullNumber = `${newCode}${currentNumber}`

                  setFieldValue(`phones[${index}].countryCode`, newCode)
                  setFieldValue(
                    `phones[${index}].phoneNumber`,
                    updatedFullNumber
                  )
                }}
              >
                <MenuItem value="" disabled>
                  <Typography>🔢Código País</Typography>
                </MenuItem>

                {countryCodes.map((country) => (
                  <MenuItem
                    key={country.code}
                    value={country.code}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'var(--color-primario)',
                        color: 'var(--texto-inverso-black)'
                      }
                    }}
                  >
                    {country.country} ({country.code})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* Campo del número de teléfono */}
          <Grid item xs={12} md={8}>
            <TextField
              sx={{ ...inputStyles, mt: 2 }}
              placeholder="Teléfono"
              name={`phones[${index}].phoneNumber`}
              value={phones[index].phoneNumber.replace(phone.countryCode, '')}
              onChange={(e) => {
                const input = e.target.value.replace(/[^0-9]/g, '')
                const fullNumber = `${phones[index].countryCode}${input}`
                setFieldValue(`phones[${index}].phoneNumber`, fullNumber)
              }}
              error={
                touched?.[index]?.phoneNumber &&
                Boolean(errors?.[index]?.phoneNumber)
              }
              helperText={
                touched?.[index]?.phoneNumber && errors?.[index]?.phoneNumber
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {phone.countryCode || '📞'}
                  </InputAdornment>
                )
              }}
            />
          </Grid>
        </Grid>
      ))}
    </Grid>
  )
}
PhoneFields.propTypes = {
  phones: PropTypes.arrayOf(
    PropTypes.shape({
      countryCode: PropTypes.string,
      phoneNumber: PropTypes.string
    })
  ).isRequired,
  touched: PropTypes.array,
  errors: PropTypes.array,
  setFieldValue: PropTypes.func.isRequired
}
