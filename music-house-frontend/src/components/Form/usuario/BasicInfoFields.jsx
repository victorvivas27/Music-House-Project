import { flexRowContainer, inputStyles, inputWidth } from "@/components/styles/styleglobal"
import { Box, FormControl, TextField } from "@mui/material"
import { ErrorMessage, Field } from "formik"
import PropTypes from "prop-types"

export const BasicInfoFields = ({ values, touched, errors }) => {
    return (
      <Box sx={{
              border:"solid 1px red",
             ...inputWidth,
             ...flexRowContainer
              }}>
        <FormControl sx={{...inputStyles, mt: 2 }}>
          <Field
            as={TextField}
            label="🏷️Nombre"
            name="name"
            value={values.name}
            error={touched.name && Boolean(errors.name)}
            helperText={<ErrorMessage name="name" />}
          />
        </FormControl>
  
        <FormControl sx={{...inputStyles, mt: 2 }}>
          <Field
            as={TextField}
            label="👤Apellido"
            name="lastName"
            value={values.lastName}
            error={touched.lastName && Boolean(errors.lastName)}
            helperText={<ErrorMessage name="lastName" />}
          />
        </FormControl>
  
        <FormControl sx={{...inputStyles, mt: 2 }}>
          <Field
            as={TextField}
            label="📧 Email"
            name="email"
            type="email"
            value={values.email}
            error={touched.email && Boolean(errors.email)}
            helperText={<ErrorMessage name="email" />}
          />
        </FormControl>
      </Box>
    )
  }
  
  BasicInfoFields.propTypes = {
    values: PropTypes.object.isRequired,
    touched: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
  }