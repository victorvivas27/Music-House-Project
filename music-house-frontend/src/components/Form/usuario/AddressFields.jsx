import { flexRowContainer, inputStyles, inputWidth } from "@/components/styles/styleglobal"
import { Box, FormControl, TextField } from "@mui/material"
import { Field } from "formik"

export const AddressFields = ({ addresses, touched, errors, setFieldValue }) => {
    return addresses.map((address, index) => (
      <Box
        key={index}
      sx={{
              border:"solid 1px red",
             ...inputWidth,
             ...flexRowContainer
              }}>
      
        {/* Calle */}
        
          <FormControl sx={{ ...inputStyles, mt: 2 }}>
            <Field
              as={TextField}
              label="🏠Calle"
              name={`addresses[${index}].street`}
              value={address.street}
              error={touched?.[index]?.street && Boolean(errors?.[index]?.street)}
              helperText={touched?.[index]?.street && errors?.[index]?.street}
              onChange={(e) =>
                setFieldValue(`addresses[${index}].street`, e.target.value)
              }
            />
          </FormControl>
      
  
        {/* Número */}
        
          <FormControl sx={{ ...inputStyles, mt: 2 }}>
            <Field
              as={TextField}
              label="🔢Número"
              name={`addresses[${index}].number`}
              value={address.number}
              error={touched?.[index]?.number && Boolean(errors?.[index]?.number)}
              helperText={touched?.[index]?.number && errors?.[index]?.number}
              onChange={(e) =>
                setFieldValue(`addresses[${index}].number`, e.target.value)
              }
            />
          </FormControl>
       
  
        {/* Ciudad */}
       
          <FormControl sx={{ ...inputStyles, mt: 2 }}>
            <Field
              as={TextField}
              label="🌆Ciudad"
              name={`addresses[${index}].city`}
              value={address.city}
              error={touched?.[index]?.city && Boolean(errors?.[index]?.city)}
              helperText={touched?.[index]?.city && errors?.[index]?.city}
              onChange={(e) =>
                setFieldValue(`addresses[${index}].city`, e.target.value)
              }
            />
          </FormControl>
       
  
        {/* Estado */}
       
          <FormControl sx={{ ...inputStyles, mt: 2 }}>
            <Field
              as={TextField}
              label="🏛️Estado"
              name={`addresses[${index}].state`}
              value={address.state}
              error={touched?.[index]?.state && Boolean(errors?.[index]?.state)}
              helperText={touched?.[index]?.state && errors?.[index]?.state}
              onChange={(e) =>
                setFieldValue(`addresses[${index}].state`, e.target.value)
              }
            />
          </FormControl>
       
  
        {/* País */}
       
          <FormControl sx={{ ...inputStyles, mt: 2 }}>
            <Field
              as={TextField}
              label="🌍País"
              name={`addresses[${index}].country`}
              value={address.country}
              error={touched?.[index]?.country && Boolean(errors?.[index]?.country)}
              helperText={touched?.[index]?.country && errors?.[index]?.country}
              onChange={(e) =>
                setFieldValue(`addresses[${index}].country`, e.target.value)
              }
            />
          </FormControl>
       
      </Box>
    ))
  }