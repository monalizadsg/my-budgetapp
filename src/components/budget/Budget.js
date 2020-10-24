import React, { Component } from "react";
import BudgetForm from "./BudgetForm";
import { getCategories } from "../../services/transactionsService";
import { getBudgets, getBudgetBalances } from "../../services/budgetService";
import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import "./Budget.scss";
import BudgetList from "./BudgetList";
import PeriodTypeDropdown from "../common/PeriodTypeDropdown";
import { format } from "date-fns";

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
  };

  async componentDidMount() {
    const { type, startDate } = this.state.selectedPeriodType;
    const categories = await getCategories();
    const budgetBalances = await getBudgetBalances(type, startDate);
    this.setState({
      budgetBalances: budgetBalances.data,
      categories,
    });
  }

  openModal = () => {
    this.setState({ isOpen: true });
  };

  closeModal = () => {
    this.setState({ isOpen: false });
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
    return (
      <div className='budget-container'>
        <div className='header'>
          <h2>Budget</h2>
          <PeriodTypeDropdown onFilter={this.filterBudget} />
          <button onClick={this.openModal}>+ Add</button>
        </div>
        <BudgetList data={this.state.budgetBalances} />
        <Dialog
          open={this.state.isOpen}
          onClose={this.closeModal}
          fullWidth
          maxWidth='xs'
          disableBackdropClick
        >
          <DialogTitle>Add Budget</DialogTitle>
          <DialogContent>
            <BudgetForm
              categories={this.state.categories}
              closeModal={this.closeModal}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default Budget;
