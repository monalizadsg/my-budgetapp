import React from "react";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const TextInputWithIcon = ({
  label,
  name,
  showPassword,
  value,
  onChange,
  onClick,
  error,
}) => {
  return (
    <FormControl fullWidth variant='outlined' error={!!error}>
      <InputLabel>{label}</InputLabel>
      <OutlinedInput
        name={name}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        endAdornment={
          <InputAdornment position='end'>
            <IconButton
              aria-label='toggle password visibility'
              onClick={onClick}
              edge='end'
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
        labelWidth={name === "password" ? 70 : 130}
      />
      <FormHelperText id='component-error-text'>{error}</FormHelperText>
    </FormControl>
  );
};

export default TextInputWithIcon;
