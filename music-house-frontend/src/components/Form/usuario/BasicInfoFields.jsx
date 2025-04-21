import {  inputStyles} from "@/components/styles/styleglobal"
import {  FormControl, Grid, TextField } from "@mui/material"
import { ErrorMessage, Field } from "formik"
import PropTypes from "prop-types"

export const BasicInfoFields = ({ values, touched, errors }) => {
    return (
      <Grid container spacing={2} >
      <Grid item xs={12} md={6}>
        <FormControl sx={{...inputStyles}}>
          <Field
            as={TextField}
            label="🏷️Nombre"
            name="name"
            value={values.name}
            error={touched.name && Boolean(errors.name)}
            helperText={<ErrorMessage name="name" />}
          />
        </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
        <FormControl sx={{...inputStyles}}>
          <Field
            as={TextField}
            label="👤Apellido"
            name="lastName"
            value={values.lastName}
            error={touched.lastName && Boolean(errors.lastName)}
            helperText={<ErrorMessage name="lastName" />}
          />
        </FormControl>
        </Grid>

        <Grid item xs={12}>
        <FormControl sx={{...inputStyles }}>
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
        </Grid>
        </Grid>
    )
  }
  
  BasicInfoFields.propTypes = {
    values: PropTypes.object.isRequired,
    touched: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
  }