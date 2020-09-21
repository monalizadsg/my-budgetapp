import React, { Component } from "react";
import "./TransactionForm.scss";
import { format } from "date-fns";
import { createTransaction } from "../../services/transactionsService";
import {
  TextField,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Button,
  FormHelperText,
} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

class TransactionForm extends Component {
  state = {
    description: "",
    amount: "",
    category: "",
    date: format(new Date(), "yyyy-MM-dd"),
    errors: {},
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const validation = this.validateForm();
    if (!validation) {
      return;
    }

    const postData = {
      userId: 1,
      description: this.state.description,
      amount: parseFloat(this.state.amount),
      categoryId: parseInt(this.state.category),
      date: this.state.date,
      location: "",
      payeeName: "Jaya Grocer",
    };

    await createTransaction(postData);
    this.props.closeModal();
    this.props.updateData();
  };

  validateForm = () => {
    const { description, amount, category, date } = this.state;
    let errors = {};
    let isValid = true;

    if (description === "") {
      errors.description = "This field is required.";
    }
    if (amount === "") {
      errors.amount = "This field is required";
    }
    if (category === "") {
      errors.category = "This field is required";
    }
    if (date === "") {
      errors.date = "This field is required";
    }

    if (Object.keys(errors).length > 0) {
      isValid = false;
    }

    this.setState({
      errors,
    });

    return isValid;
  };

  handleInputChange = ({ target: input }) => {
    const { name, value } = input;
    this.setState({
      [name]: value,
    });
  };

  handleDateChange = (date) => {
    this.setState({ date: format(date, "yyyy-MM-dd") });
  };

  render() {
    const { categories, closeModal } = this.props;
    const { description, amount, category, date, errors } = this.state;
    return (
      <div className='transaction-form-wrapper'>
        <form noValidate autoComplete='off'>
          <TextField
            id='description'
            name='description'
            size='medium'
            label='Description'
            variant='outlined'
            value={description}
            onChange={this.handleInputChange}
            error={errors.description}
            helperText={errors.description}
          />
          <TextField
            type='number'
            id='amount'
            name='amount'
            size='medium'
            label='Amount'
            variant='outlined'
            value={amount}
            onChange={this.handleInputChange}
            error={errors.amount}
            helperText={errors.amount}
          />
          <FormControl
            variant='outlined'
            style={{ minWidth: "200px" }}
            size='medium'
            error={errors.category}
          >
            <InputLabel htmlFor='category'>Category</InputLabel>
            <Select
              label='Category'
              name='category'
              id='category'
              value={category}
              onChange={this.handleInputChange}
            >
              <MenuItem value='' disabled />
              {categories &&
                categories.map((category) => {
                  return (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  );
                })}
            </Select>
            {errors.category && (
              <FormHelperText>{errors.category}</FormHelperText>
            )}
          </FormControl>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              autoOk
              variant='inline'
              size='medium'
              inputVariant='outlined'
              label='Date'
              format='yyyy/MM/dd'
              value={date}
              InputAdornmentProps={{ position: "start" }}
              onChange={(date) => this.handleDateChange(date)}
              error={errors.date}
              helperText={errors.date}
            />
          </MuiPickersUtilsProvider>
          <div className='form-actions'>
            <Button onClick={closeModal} color='primary'>
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} color='primary'>
              Add
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

export default TransactionForm;
