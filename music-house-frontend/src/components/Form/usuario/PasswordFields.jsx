import { flexRowContainer, fontSizeResponsi, inputStyles, inputWidth } from "@/components/styles/styleglobal"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { Box, FormControl, IconButton, InputAdornment, TextField } from "@mui/material"
import { ErrorMessage, Field } from "formik"
import PropTypes from "prop-types"
import { useState } from "react"

export const PasswordFields = ({
    values,
    touched,
    errors,
    setFieldValue
  }) => {
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordRepeat, setShowPasswordRepeat] = useState(false)
  
    return (
      <Box sx={{
              border:"solid 1px red",
             ...inputWidth,
             ...flexRowContainer
              }}>
        {/* Campo de contraseña */}
        <FormControl sx={{ ...inputStyles, mt: 2  }}>
          <Field
            as={TextField}
            name="password"
            label="🔒 Contraseña"
            type={showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={(e) => setFieldValue('password', e.target.value)}
            error={touched.password && Boolean(errors.password)}
            helperText={<ErrorMessage name="password" />}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? (
                      <VisibilityOff
                        sx={{ color: 'var(--color-exito)', ...fontSizeResponsi }}
                      />
                    ) : (
                      <Visibility
                        sx={{ color: 'var(--color-secundario)', ...fontSizeResponsi }}
                      />
                    )}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </FormControl>
  
        {/* Campo de repetir contraseña */}
        <FormControl sx={{ ...inputStyles, mt: 2 }}>
          <Field
            as={TextField}
            name="repeatPassword"
            label="🔓 Repetir Contraseña"
            type={showPasswordRepeat ? 'text' : 'password'}
            value={values.repeatPassword}
            onChange={(e) => setFieldValue('repeatPassword', e.target.value)}
            error={touched.repeatPassword && Boolean(errors.repeatPassword)}
            helperText={<ErrorMessage name="repeatPassword" />}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPasswordRepeat(!showPasswordRepeat)}
                    edge="end"
                  >
                    {showPasswordRepeat ? (
                      <VisibilityOff
                        sx={{ color: 'var(--color-exito)', ...fontSizeResponsi }}
                      />
                    ) : (
                      <Visibility
                        sx={{ color: 'var(--color-secundario)', ...fontSizeResponsi }}
                      />
                    )}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </FormControl>
      </Box>
    )
  }
  PasswordFields.propTypes = {
    values: PropTypes.object.isRequired,
    touched: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    setFieldValue: PropTypes.func.isRequired
  }