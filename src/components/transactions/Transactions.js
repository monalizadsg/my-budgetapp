import React, { Component } from "react";
import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";
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
    currentPage: 0,
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

  updateData = async () => {
    const { pageSize, currentPage } = this.state;
    const data = await getTransactions(currentPage, pageSize);
    const { transactions } = data;
    this.setState({
      data: transactions,
    });
  };

  openModal = () => {
    this.setState({ isOpen: true });
  };

  closeModal = () => {
    this.setState({ isOpen: false });
  };
  render() {
    const { categories, data } = this.state;
    return (
      <div className='transaction-container'>
        <div className='header'>
          <h2>Transactions</h2>
          <button onClick={this.openModal}>+ Add Transactions</button>
        </div>
        <div className='list'>
          <TransactionList data={data} />
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
              updateData={this.updateData}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default Transactions;
