import React, { Component } from "react";
import {
  MenuItem,
  // Button,
  // Dialog,
  // DialogActions,
  // DialogContent,
  // DialogTitle,
} from "@material-ui/core";
// import { format } from "date-fns";
import { createBudget, updateBudget, getBudgets } from "./budgetService";
// import DatePickerInput from "./../common/DatePickerInput";
import FormActions from "../components/FormActions";
import SelectInput from "../components/SelectInput";
import TextInput from "../components/TextInput";
import CategorySelectInput from "./../components/CategorySelectInput";
import "./BudgetForm.scss";

const periodRange = {
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
  // ONE_TIME: "One Time",
};

class BudgetForm extends Component {
  state = {
    amountLimit: "",
    category: "",
    periodType: "",
    errors: {},
    // isOpen: false,
    // customDate: {
    //   startDate: format(new Date(), "yyyy-MM-dd"),
    //   endDate: format(new Date(), "yyyy-MM-dd"),
    // },
    isEditing: false,
    isLoading: false,
    data: [],
  };

  async componentDidMount() {
    const budgets = await getBudgets();
    this.setState({ data: budgets.data });
    this.getSelectedBudget();
  }

  getSelectedBudget = () => {
    const { selectedBudget } = this.props;

    if (selectedBudget) {
      this.setState({
        category: selectedBudget.category.id,
        amountLimit: selectedBudget.amountLimit,
        periodType: selectedBudget.periodType,
        isEditing: true,
      });
    }
  };

  validateForm = () => {
    const { amountLimit, category, periodType, isEditing, data } = this.state;

    let errors = {};
    let isValid = true;

    //check if budget is already created by period when adding new budget
    if (!isEditing) {
      data.forEach((item) => {
        if (item.category.id === category && item.periodType === periodType) {
          errors.periodType = "Budget is already existed.";
          errors.category = "Budget is already existed.";
        }
      });
    }

    if (amountLimit === "") {
      errors.amountLimit = "This field is required";
    }
    if (category === "") {
      errors.category = "This field is required";
    }
    if (periodType === "") {
      errors.periodType = "This field is required";
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
    const { selectedBudget } = this.props;

    const validation = this.validateForm();
    if (!validation) {
      return;
    }

    this.setState({ isLoading: true });

    const budgetData = {
      categoryId: this.state.category,
      amountLimit: this.state.amountLimit,
      periodType: this.state.periodType,
    };

    let upsertPromise = null;
    if (selectedBudget?.id) {
      upsertPromise = updateBudget(budgetData, selectedBudget?.id);
      this.props.showToast("Budget transaction is updated!");
    } else {
      upsertPromise = createBudget(budgetData);
      this.props.showToast("Budget transaction is added!");
    }

    try {
      await upsertPromise;
      this.props.updateData();
      this.props.closeModal();
    } catch (error) {
      // TODO: display error to the user (pop-up)
      console.log(error);
    }
  };

  // handleStartDateChange = (date) => {
  //   const customDate = { ...this.state.customDate };
  //   customDate.startDate = format(date, "yyyy-MM-dd");
  //   this.setState({ customDate });
  // };

  // handleEndDateChange = (date) => {
  //   const customDate = { ...this.state.customDate };
  //   customDate.endDate = format(date, "yyyy-MM-dd");
  //   this.setState({ customDate });
  // };

  handleInputChange = ({ target: input }) => {
    const { name, value } = input;
    this.setState({
      [name]: value,
    });
  };

  render() {
    const {
      amountLimit,
      category,
      errors,
      periodType,
      // customDate,
      // isOpen,
      isEditing,
      isLoading,
    } = this.state;
    const { categories, closeModal } = this.props;

    return (
      <div className='budget-form-wrapper'>
        <form noValidate autoComplete='off'>
          <CategorySelectInput
            categories={categories}
            category={category}
            onChange={this.handleInputChange}
            error={errors.category}
          />
          <TextInput
            type='number'
            name='amountLimit'
            label='AmountLimit'
            value={amountLimit}
            onChange={this.handleInputChange}
            error={errors.amountLimit}
          />
          <SelectInput
            name='periodType'
            label='PeriodType'
            value={periodType}
            error={errors.periodType}
            onChange={this.handleInputChange}
            disabled={isEditing}
          >
            {Object.entries(periodRange).map(([key, value], index) => {
              // console.log(key, value);
              return (
                <MenuItem
                  key={index}
                  value={key}
                  // onClick={key === "ONE_TIME" ? this.showDialog : null}
                >
                  {value}
                </MenuItem>
              );
            })}
          </SelectInput>

          <FormActions
            isEditing={isEditing}
            onClose={closeModal}
            isLoading={isLoading}
            onSubmit={this.handleSubmit}
          />
        </form>
        {/* <CustomDateRangeDialog
          isOpen={isOpen}
          onClose={this.closeDialog}
          onStartDateChange={this.handleStartDateChange}
          onEndDateChange={this.handleEndDateChange}
          startDate={customDate.startDate}
          endDate={customDate.endDate}
          // onChangeCustomDateRange={this.onGetCustomDates}
        /> */}
      </div>
    );
  }
}

// const CustomDateRangeDialog = ({
//   isOpen,
//   onClose,
//   onStartDateChange,
//   onEndDateChange,
//   startDate,
//   endDate,
//   onChangeCustomDateRange,
// }) => {
//   return (
//     <Dialog open={isOpen} onClose={onClose}>
//       <DialogTitle id='alert-dialog-title' dividers>
//         Custom
//       </DialogTitle>
//       <DialogContent>
//         <DatePickerInput
//           label='Start Date'
//           value={startDate}
//           onDateChange={onStartDateChange}
//           // error={errors.date}
//         />
//         <DatePickerInput
//           label='End Date'
//           value={endDate}
//           onDateChange={onEndDateChange}
//           // error={errors.date}
//         />
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color='primary'>
//           Cancel
//         </Button>
//         <Button onClick={null} color='primary'>
//           Done
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

export default BudgetForm;
