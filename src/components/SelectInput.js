import React from "react";
import {
  FormControl,
  Select,
  InputLabel,
  FormHelperText,
} from "@material-ui/core";

const SelectInput = ({ name, label, value, error, onChange, children }) => {
  return (
    <FormControl variant='outlined' error={!!error}>
      <InputLabel id={name}>{label}</InputLabel>
      <Select
        labelId={name}
        label={label}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
      >
        {children}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default SelectInput;
