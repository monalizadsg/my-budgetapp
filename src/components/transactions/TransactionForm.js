import React, { Component } from "react";
import "./TransactionForm.scss";
import {
  TextField,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

const TransactionForm = () => {
  return (
    <div className='transaction-form-wrapper'>
      <form noValidate autoComplete='off'>
        <TextField
          id='description'
          name='description'
          size='small'
          label='Description'
          variant='outlined'
        />
        <TextField
          type='number'
          id='amount'
          name='amount'
          size='small'
          label='Amount'
          variant='outlined'
        />
        <FormControl
          variant='outlined'
          style={{ minWidth: "200px" }}
          size='small'
        >
          <InputLabel htmlFor='category'>Category</InputLabel>
          <Select
            // value={state.age}
            // onChange={handleChange}
            label='Category'
            name='category'
            id='category'
            // inputProps={{
            //   name: "category",
            //   id: "category",
            // }}
          >
            <MenuItem value='' disabled />
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            autoOk
            variant='inline'
            size='small'
            inputVariant='outlined'
            label='Date'
            format='MM/dd/yyyy'
            // value={selectedDate}
            InputAdornmentProps={{ position: "start" }}
            // onChange={(date) => handleDateChange(date)}
          />
        </MuiPickersUtilsProvider>
      </form>
    </div>
  );
};

export default TransactionForm;
