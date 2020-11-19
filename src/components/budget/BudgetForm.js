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
import {
  createBudget,
  updateBudget,
  deleteBudget,
} from "../../services/budgetService";
// import DatePickerInput from "./../common/DatePickerInput";
import ConfirmDialog from "../common/ConfirmDialog";
import FormActions from "./../common/FormActions";
import SelectInput from "../common/SelectInput";
import TextInput from "../common/TextInput";
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
    // category: "",
    category: "",
    periodType: "",
    errors: {},
    isOpen: false,
    // customDate: {
    //   startDate: format(new Date(), "yyyy-MM-dd"),
    //   endDate: format(new Date(), "yyyy-MM-dd"),
    // },
    isEditing: false,
    openConfirmDialog: false,
    isLoading: false,
  };

  componentDidMount() {
    this.getSelectedBudget();
  }

  getSelectedBudget() {
    const { selectedBudget } = this.props;
    if (selectedBudget) {
      this.setState({
        // category: selectedBudget.category.id,
        category: selectedBudget.category.id,
        amountLimit: selectedBudget.amountLimit,
        periodType: selectedBudget.periodType,
        isEditing: true,
      });
    }
  }

  showConfirmDialog = () => {
    this.setState({ openConfirmDialog: true });
  };

  closeConfirmDialog = () => {
    this.setState({ openConfirmDialog: false });
    this.props.closeModal();
  };

  validateForm = () => {
    const { amountLimit, category, periodType } = this.state;
    let errors = {};
    let isValid = true;

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
    } else {
      upsertPromise = createBudget(budgetData);
    }

    try {
      await upsertPromise;
      this.props.updateData();
      this.props.closeModal();
      this.props.showToast("Budget transaction is successful!");
    } catch (error) {
      // TODO: display error to the user (pop-up)
      console.log(error);
    }

    // this.setState({ isLoading: false });
  };

  // showDialog = () => {
  //   this.setState({ isOpen: true });
  // };

  // closeDialog = () => {
  //   this.setState({ isOpen: false });
  // };

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

  handleDelete = async () => {
    this.setState({ isLoading: true });

    const budgetId = this.props.selectedBudget.id;
    await deleteBudget(budgetId);
    this.props.updateData();
    this.props.closeModal();
    this.props.showToast("Budget is successfully deleted!");
  };

  render() {
    const {
      amountLimit,
      category,
      errors,
      periodType,
      customDate,
      isOpen,
      isEditing,
      isLoading,
    } = this.state;
    const { categories, closeModal } = this.props;

    const mappedCategory = categories.filter((item) => item.id === category);
    const budget = {
      category: mappedCategory[0]?.name,
      amountLimit: amountLimit,
      periodType: periodType,
    };

    return (
      <div className='budget-form-wrapper'>
        <form noValidate autoComplete='off'>
          <SelectInput
            label='Category'
            name='category'
            value={category}
            onChange={this.handleInputChange}
            error={errors.category}
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
            onShowDialog={this.showConfirmDialog}
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
        <ConfirmDialog
          isOpen={this.state.openConfirmDialog}
          onClose={this.closeConfirmDialog}
          onDelete={this.handleDelete}
          isLoading={isLoading}
        >
          <div>
            <p>Category: {budget.category}</p>
            <p>Amount: {budget.amountLimit}</p>
            <p>Period: {budget.periodType}</p>
          </div>
        </ConfirmDialog>
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
//           label='End Date'
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
