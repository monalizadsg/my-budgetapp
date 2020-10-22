import React, { Component } from "react";
import {
  TextField,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Button,
  FormHelperText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { format } from "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import teal from "@material-ui/core/colors/teal";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import "./BudgetForm.scss";

import { createBudget } from "../../services/budgetService";

const defaultMaterialTheme = createMuiTheme({
  palette: {
    primary: {
      main: teal[500],
    },
  },
});

const periodRange = {
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
  ONE_TIME: "One Time",
};

class BudgetForm extends Component {
  state = {
    amount: "",
    category: "",
    errors: {},
    period: "",
    isOpen: false,
    customDate: {
      startDate: format(new Date(), "yyyy-MM-dd"),
      endDate: format(new Date(), "yyyy-MM-dd"),
    },
  };

  validateForm = () => {
    const { amount, category, period } = this.state;
    let errors = {};
    let isValid = true;

    if (amount === "") {
      errors.amount = "This field is required";
    }
    if (category === "") {
      errors.category = "This field is required";
    }
    if (period === "") {
      errors.period = "This field is required";
    }

    if (Object.keys(errors).length > 0) {
      isValid = false;
    }

    this.setState({
      errors,
    });

    return isValid;
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const validation = this.validateForm();
    if (!validation) {
      return;
    }

    const budgetData = {
      categoryId: this.state.category,
      amountLimit: this.state.amount,
      periodType: this.state.period,
    };

    await createBudget(budgetData);
    this.props.closeModal();
    console.log(budgetData);
  };

  showDialog = () => {
    this.setState({ isOpen: true });
  };

  closeDialog = () => {
    this.setState({ isOpen: false });
  };

  handleStartDateChange = (date) => {
    const customDate = { ...this.state.customDate };
    customDate.startDate = format(date, "yyyy-MM-dd");
    this.setState({ customDate });
  };

  handleEndDateChange = (date) => {
    const customDate = { ...this.state.customDate };
    customDate.endDate = format(date, "yyyy-MM-dd");
    this.setState({ customDate });
  };

  handleInputChange = ({ target: input }) => {
    const { name, value } = input;
    this.setState({
      [name]: value,
    });
  };

  render() {
    const { amount, category, errors, period, customDate, isOpen } = this.state;
    const { categories, closeModal } = this.props;
    return (
      <div className='budget-form-wrapper'>
        <form noValidate autoComplete='off'>
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
          <FormControl
            variant='outlined'
            style={{ minWidth: "200px" }}
            size='medium'
            error={errors.period}
          >
            <InputLabel htmlFor='category'>Period</InputLabel>
            <Select
              label='Period'
              name='period'
              id='period'
              value={period}
              onChange={this.handleInputChange}
            >
              {Object.entries(periodRange).map(([key, value], index) => {
                // console.log(key, value);
                return (
                  <MenuItem
                    key={index}
                    value={key}
                    onClick={key === "ONE_TIME" ? this.showDialog : null}
                  >
                    {value}
                  </MenuItem>
                );
              })}
            </Select>
            {errors.period && <FormHelperText>{errors.period}</FormHelperText>}
          </FormControl>
          <div className='form-actions'>
            <Button onClick={closeModal} color='primary'>
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} color='primary'>
              Add
            </Button>
          </div>
        </form>
        <CustomDateRangeDialog
          isOpen={isOpen}
          onClose={this.closeDialog}
          onStartDateChange={this.handleStartDateChange}
          onEndDateChange={this.handleEndDateChange}
          startDate={customDate.startDate}
          endDate={customDate.endDate}
          // onChangeCustomDateRange={this.onGetCustomDates}
        />
      </div>
    );
  }
}

const CustomDateRangeDialog = ({
  isOpen,
  onClose,
  onStartDateChange,
  onEndDateChange,
  startDate,
  endDate,
  onChangeCustomDateRange,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle id='alert-dialog-title' dividers>
        Custom
      </DialogTitle>
      <DialogContent>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <ThemeProvider theme={defaultMaterialTheme}>
            <KeyboardDatePicker
              autoOk
              variant='inline'
              size='medium'
              inputVariant='outlined'
              label='Start Date'
              format='yyyy/MM/dd'
              value={startDate}
              InputAdornmentProps={{ position: "start" }}
              onChange={onStartDateChange}
              // error={errors.date}
              // helperText={errors.date}
            />
          </ThemeProvider>
        </MuiPickersUtilsProvider>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <ThemeProvider theme={defaultMaterialTheme}>
            <KeyboardDatePicker
              autoOk
              variant='inline'
              size='medium'
              inputVariant='outlined'
              label='End Date'
              format='yyyy/MM/dd'
              value={endDate}
              InputAdornmentProps={{ position: "start" }}
              onChange={onEndDateChange}
              // error={errors.date}
              // helperText={errors.date}
            />
          </ThemeProvider>
        </MuiPickersUtilsProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Cancel
        </Button>
        <Button onClick={null} color='primary' autoFocus>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BudgetForm;
