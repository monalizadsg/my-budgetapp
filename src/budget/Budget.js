import React, { Component } from "react";
import BudgetForm from "./BudgetForm";
import { getCategories } from "../transactions/transactionsService";
import { getBudgetBalances } from "./budgetService";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import "./Budget.scss";
import BudgetList from "./BudgetList";
import PeriodTypeDropdown from "../components/PeriodTypeDropdown";
import { format } from "date-fns";
import Loading from "../components/Loading";
import Toast from "../components/Toast";

class Budget extends Component {
  state = {
    budgetBalances: [],
    categories: [],
    isOpen: false,
    selectedPeriodType: {
      id: 1,
      type: "Weekly",
      startDate: format(new Date(), "yyyy-MM-dd"),
    },
    selectedBudget: null,
    isLoading: true,
    toastMessage: {
      isOpen: false,
      message: "",
    },
  };

  async componentDidMount() {
    const { type, startDate } = this.state.selectedPeriodType;
    const categories = await getCategories();
    const budgetBalances = await getBudgetBalances(type, startDate);
    this.setState({
      budgetBalances: budgetBalances.data,
      categories,
      isLoading: false,
    });
  }

  updateData = async () => {
    const { type, startDate } = this.state.selectedPeriodType;
    const budgetBalances = await getBudgetBalances(type, startDate);
    this.setState({
      budgetBalances: budgetBalances.data,
    });
  };

  openModal = () => {
    this.setState({ isOpen: true });
  };

  closeModal = () => {
    this.setState({ isOpen: false, selectedBudget: null });
  };

  showToast = (message) => {
    let toastMessage = { ...this.state.toastMessage };
    toastMessage.isOpen = true;
    toastMessage.message = message;
    this.setState({ toastMessage });
  };

  closeToast = () => {
    let toastMessage = { ...this.state.toastMessage };
    toastMessage.isOpen = false;
    toastMessage.message = "";
    this.setState({ toastMessage });
  };

  onClickBudget = (item) => {
    this.setState({ selectedBudget: item }, () => {
      this.setState({ isOpen: true });
    });
  };

  filterBudget = async (period) => {
    const startDate = format(new Date(), "yyyy-MM-dd");
    const periodType = period.type.toLowerCase();
    const budgetBalances = await getBudgetBalances(periodType, startDate);
    this.setState({
      budgetBalances: budgetBalances.data,
      selectedPeriodType: period,
    });
  };

  render() {
    const { selectedBudget, isLoading } = this.state;
    const { isOpen, message } = this.state.toastMessage;

    if (isLoading) {
      return <Loading isLoading={isLoading} />;
    }

    return (
      <div className='budget-container'>
        <div className='header'>
          <h2>Budget</h2>
          <div>
            <PeriodTypeDropdown onFilter={this.filterBudget} />
            <button className='add-button' onClick={this.openModal}>
              + Add
            </button>
          </div>
        </div>
        <BudgetList
          data={this.state.budgetBalances}
          onClickBudget={this.onClickBudget}
        />
        <Dialog
          open={this.state.isOpen}
          onClose={this.closeModal}
          fullWidth
          maxWidth='xs'
          disableBackdropClick
        >
          <DialogTitle>
            {!selectedBudget ? (
              <Typography variant='h6'>Add Budget</Typography>
            ) : (
              <>
                <Typography variant='h6'>Edit/Delete Budget</Typography>
                <IconButton
                  edge='end'
                  color='inherit'
                  onClick={this.closeModal}
                  aria-label='close'
                >
                  <CloseIcon />
                </IconButton>
              </>
            )}
          </DialogTitle>
          <DialogContent>
            <BudgetForm
              categories={this.state.categories}
              closeModal={this.closeModal}
              updateData={this.updateData}
              selectedBudget={selectedBudget}
              // onSaveSuccess={
              //   selectedTransaction
              //     ? this.handleUpdateSuccess
              //     : this.handleCreateSuccess
              // }
              showToast={this.showToast}
            />
          </DialogContent>
        </Dialog>

        <Toast message={message} open={isOpen} onClose={this.closeToast} />
      </div>
    );
  }
}

export default Budget;
