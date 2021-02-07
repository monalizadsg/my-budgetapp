import React, { Component } from "react";
import { createTransaction, updateTransaction } from "./transactionsService";
import DatePickerInput from "../components/DatePickerInput";
import SelectInput from "../components/SelectInput";
import FormActions from "../components/FormActions";
import TextInput from "../components/TextInput";
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
      this.props.onSaveSuccess(result.data);
    } catch (error) {
      // TODO: display error to the user (pop-up)
      console.log(error);
    }
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
      isLoading,
    } = this.state;

    return (
      <>
        <div className='transaction-form-wrapper'>
          <form noValidate>
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
      </>
    );
  }
}

export default TransactionForm;
