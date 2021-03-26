import React, { Component } from "react";
import BudgetForm from "./BudgetForm";
import { getCategories } from "../transactions/transactionsService";
import { getBudgetBalances } from "./budgetService";
import "./Budget.scss";
import BudgetList from "./BudgetList";
import PeriodTypeDropdown from "../components/PeriodTypeDropdown";
import { format } from "date-fns";
import Toast from "../components/Toast";
import FormDialog from "../components/FormDialog";
import Loading from "../components/Loading";

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
      isLoading: false,
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
    this.setState({ selectedBudget: item });
  };

  onClickEdit = () => {
    this.setState({ isOpen: true });
  };

  filterBudget = async (period) => {
    this.setState({ isLoading: true });
    const startDate = format(new Date(), "yyyy-MM-dd");
    const periodType = period.type.toLowerCase();
    const budgetBalances = await getBudgetBalances(periodType, startDate);
    this.setState({
      budgetBalances: budgetBalances.data,
      selectedPeriodType: period,
      isLoading: false,
    });
  };

  render() {
    const { selectedBudget, isLoading, categories } = this.state;
    const { isOpen, message } = this.state.toastMessage;

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
        {isLoading && <Loading isLoading={isLoading} />}
        {!isLoading && (
          <BudgetList
            data={this.state.budgetBalances}
            categories={categories}
            onClickBudget={this.onClickBudget}
            onClickEdit={this.onClickEdit}
            isLoading={isLoading}
            updateData={this.updateData}
            showToast={this.showToast}
          />
        )}

        <FormDialog
          isOpen={this.state.isOpen}
          onClose={this.closeModal}
          title={!selectedBudget ? "Add Budget" : "Edit Budget"}
        >
          <BudgetForm
            data={this.state.budgetBalances}
            categories={categories}
            closeModal={this.closeModal}
            updateData={this.updateData}
            selectedBudget={selectedBudget}
            showToast={this.showToast}
          />
        </FormDialog>

        <Toast message={message} open={isOpen} onClose={this.closeToast} />
      </div>
    );
  }
}

export default Budget;
