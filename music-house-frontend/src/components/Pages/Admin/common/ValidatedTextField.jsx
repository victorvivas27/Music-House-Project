import { TextField, FormControl, FormHelperText } from "@mui/material";
import PropTypes from "prop-types";
import { inputStyles } from "../../../styles/styleglobal";

const ValidatedTextField = ({ name, label, value, onChange, error, inputRef,  ...props }) => {
    return (
      <FormControl  margin="normal" error={!!error} sx={{ ...inputStyles}}>
       <TextField
  label={label}
  name={name}
  value={value}
  onChange={onChange}
  inputRef={inputRef}
  error={!!error}                     // 🔥 esto activa el estado de error en el input
  helperText={error}                 // 🔥 esto muestra el mensaje debajo del input
  {...props}
  sx={{
    ...inputStyles,
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: error ? 'red' : '' },
      '&:hover fieldset': { borderColor: error ? 'red' : '' },
      '&.Mui-focused fieldset': { borderColor: error ? 'red' : '' },
    },
  }}
/>
        <FormHelperText>{error}</FormHelperText>
      </FormControl>
    );
  };
  
  ValidatedTextField.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    inputRef: PropTypes.oneOfType([
      PropTypes.func, 
      PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    ]),
    color: PropTypes.string,
  };
  
  export default ValidatedTextField;