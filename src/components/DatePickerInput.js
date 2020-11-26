import React from "react";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const DatePickerInput = ({ label, value, onDateChange, error }) => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        autoOk
        variant='inline'
        size='medium'
        inputVariant='outlined'
        label={label}
        format='yyyy/MM/dd'
        value={value}
        InputAdornmentProps={{ position: "end" }}
        onChange={(date) => onDateChange(date)}
        error={!!error}
        helperText={error}
      />
    </MuiPickersUtilsProvider>
  );
};

export default DatePickerInput;
