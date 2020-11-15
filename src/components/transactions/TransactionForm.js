import React, { Component } from "react";
import {
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../../services/transactionsService";
import DatePickerInput from "../common/DatePickerInput";
import ConfirmDialog from "./../common/ConfirmDialog";
import SelectInput from "./../common/SelectInput";
import FormActions from "./../common/FormActions";
import TextInput from "../common/TextInput";
import { MenuItem } from "@material-ui/core";
import { format } from "date-fns";
import "./TransactionForm.scss";

class TransactionForm extends Component {
  state = {
    description: "",
    amount: "",
    category: "",
    date: format(new Date(), "yyyy-MM-dd"),
    errors: {},
    isEditing: false,
    openConfirmDialog: false,
    isLoading: false,
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

    const validation = this.validateForm();
    if (!validation) {
      return;
    }

    this.setState({ isLoading: true });

    const postData = {
      userId: 1,
      description: this.state.description,
      amount: parseFloat(this.state.amount),
      categoryId: parseInt(this.state.category),
      date: this.state.date,
      location: "",
      payeeName: "Jaya Grocer",
    };

    let upsertPromise = null;
    if (selectedTransaction?.id) {
      upsertPromise = updateTransaction(postData, selectedTransaction?.id);
    } else {
      upsertPromise = createTransaction(postData);
    }

    try {
      const result = await upsertPromise;
      this.props.onSaveSuccess(result);
    } catch (error) {
      // TODO: display error to the user (pop-up)
      console.log(error);
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
    this.setState({ isLoading: true });

    const transactionId = this.props.selectedTransaction.id;
    await deleteTransaction(transactionId);
    this.props.updateData();
    this.props.closeModal();
    this.props.showToast("Transaction is successfully deleted!");
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
      isLoading,
    } = this.state;

    const transaction = {
      description: description,
      amount: amount,
      date: date,
    };
    return (
      <>
        <div className='transaction-form-wrapper'>
          <form noValidate autoComplete>
            <TextInput
              name='description'
              label='Description'
              value={description}
              onChange={this.handleInputChange}
              error={errors.description}
            />
            <TextInput
              type='number'
              name='amount'
              label='Amount'
              value={amount}
              onChange={this.handleInputChange}
              error={errors.amount}
            />
            <SelectInput
              name='category'
              label='Category'
              value={category}
              error={errors.category}
              onChange={this.handleInputChange}
              // menuData={categories}
            >
              {categories &&
                categories.map((menu, index) => {
                  return (
                    <MenuItem key={index} value={menu.id}>
                      {menu.name}
                    </MenuItem>
                  );
                })}
            </SelectInput>
            <DatePickerInput
              label='Date'
              value={date}
              onDateChange={this.handleDateChange}
              error={errors.date}
            />
            <FormActions
              isEditing={isEditing}
              onClose={closeModal}
              isLoading={isLoading}
              onSubmit={this.handleSubmit}
              onShowDialog={this.showConfirmDialog}
            />
          </form>
        </div>

        <ConfirmDialog
          isOpen={openConfirmDialog}
          onClose={this.closeConfirmDialog}
          onDelete={this.handleDelete}
          isLoading={isLoading}
        >
          <div>
            <p>Description: {transaction.description}</p>
            <p>Amount: {transaction.amount}</p>
            <p>Date: {transaction.date}</p>
          </div>
        </ConfirmDialog>
      </>
    );
  }
}

export default TransactionForm;
