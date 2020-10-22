import React, { Component } from "react";
import "./TransactionForm.scss";
import { format } from "date-fns";
import {
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../../services/transactionsService";
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
  DialogContentText,
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
    isEditing: false,
    openConfirmDialog: false,
  };

  componentDidMount() {
    this.getSelectedTransaction();
  }

  getSelectedTransaction() {
    const { selectedTransaction } = this.props;
    if (selectedTransaction) {
      this.setState({
        description: selectedTransaction.description,
        amount: selectedTransaction.amount,
        category: selectedTransaction.category.id,
        date: selectedTransaction.date,
        isEditing: true,
      });
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const { selectedTransaction } = this.props;
    let postData = {};

    const validation = this.validateForm();
    if (!validation) {
      return;
    }

    if (selectedTransaction === null) {
      postData = {
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
    } else {
      const transactionId = selectedTransaction.id;
      postData = {
        id: transactionId,
        userId: 1,
        description: this.state.description,
        amount: parseFloat(this.state.amount),
        categoryId: parseInt(this.state.category),
        date: this.state.date,
        location: "",
        payeeName: "Jaya Grocer",
      };

      await updateTransaction(postData, transactionId);
      this.props.closeModal();
      this.props.updateData();
    }
  };

  showConfirmDialog = () => {
    this.setState({ openConfirmDialog: true });
  };

  closeConfirmDialog = () => {
    this.setState({ openConfirmDialog: false });
    this.props.closeModal();
  };

  handleDelete = async () => {
    const transactionId = this.props.selectedTransaction.id;
    await deleteTransaction(transactionId);
    this.props.updateData();
    this.props.closeModal();
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
    const {
      description,
      amount,
      category,
      date,
      errors,
      isEditing,
      openConfirmDialog,
    } = this.state;

    const transaction = {
      description: description,
      amount: amount,
      date: date,
    };
    return (
      <>
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
              {!isEditing ? (
                <>
                  <Button onClick={closeModal} color='primary'>
                    Cancel
                  </Button>
                  <Button onClick={this.handleSubmit} color='primary'>
                    Add
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={this.showConfirmDialog} color='primary'>
                    Delete
                  </Button>
                  <Button onClick={this.handleSubmit} color='primary'>
                    Save
                  </Button>
                </>
              )}
            </div>
          </form>
        </div>
        <ConfirmDialog
          isOpen={openConfirmDialog}
          onClose={this.closeConfirmDialog}
          selectedTransaction={transaction}
          onDelete={this.handleDelete}
        />
      </>
    );
  }
}

const ConfirmDialog = ({ isOpen, onClose, selectedTransaction, onDelete }) => {
  const selected = selectedTransaction;
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle id='alert-dialog-title'>
        Are you sure you want to delete this transaction?
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <div>
            <p>Description: {selected.description}</p>
            <p>Amount: {selected.amount}</p>
            <p>Date: {selected.date}</p>
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          No
        </Button>
        <Button onClick={onDelete} color='primary' autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionForm;
