import React from "react";
import { TextField } from "@material-ui/core";

const TextInput = ({
  type,
  name,
  label,
  value,
  onChange,
  error,
  fullWidth,
}) => {
  return (
    <TextField
      type={type ? type : "text"}
      id={name}
      name={name}
      size='medium'
      label={label}
      variant='outlined'
      value={value}
      onChange={onChange}
      error={!!error}
      helperText={error}
      fullWidth={fullWidth}
    />
  );
};

export default TextInput;
