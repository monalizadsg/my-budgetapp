import React, { Component } from "react";
import BudgetForm from "./BudgetForm";
import { getCategories } from "../../services/transactionsService";
import { getBudgets } from "../../services/budgetService";
import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import "./Budget.scss";
import BudgetList from "./BudgetList";

class Budget extends Component {
  state = {
    budgets: [],
    categories: [],
    isOpen: false,
  };

  async componentDidMount() {
    const categories = await getCategories();
    const budgets = await getBudgets();
    this.setState({
      budgets: budgets.data,
      categories,
    });
  }

  openModal = () => {
    this.setState({ isOpen: true });
  };

  closeModal = () => {
    this.setState({ isOpen: false });
  };

  render() {
    return (
      <div className='budget-container'>
        <div className='header'>
          <h2>Budget</h2>
          <button onClick={this.openModal}>+ Add</button>
        </div>
        <BudgetList data={this.state.budgets} />
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
