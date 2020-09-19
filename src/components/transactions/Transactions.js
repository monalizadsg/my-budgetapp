import React, { Component } from "react";
import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import TransactionForm from "./TransactionForm";
import {
  getTransactions,
  getCategories,
} from "../../services/transactionsService";
import "./Transactions.scss";

class Transactions extends Component {
  state = {
    isOpen: false,
    data: [],
    categories: [],
    totalPages: 0,
    currentPage: 1,
    pageSize: 5,
  };

  async componentDidMount() {
    const { pageSize, currentPage } = this.state;
    const data = await getTransactions(currentPage, pageSize);
    const categories = await getCategories();
    this.setState({
      data: data.transactions,
      totalPages: data.totalPages,
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
    const { categories } = this.state;
    return (
      <div className='transaction-container'>
        <div className='header'>
          <h2>Transactions</h2>
          <button onClick={this.openModal}>+ Add Transactions</button>
        </div>
        <Dialog
          open={this.state.isOpen}
          onClose={this.closeModal}
          fullWidth
          maxWidth='xs'
          disableBackdropClick
        >
          <DialogTitle>Transaction</DialogTitle>
          <DialogContent>
            <TransactionForm
              categories={categories}
              onSave={this.handleClickOnAdd}
              closeModal={this.closeModal}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default Transactions;
