import React, { Component } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import CloseIcon from "@material-ui/icons/Close";

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
    currentPage: 1,
    pageSize: 5,
    selectedTransaction: null,
  };

  async componentDidMount() {
    const { pageSize, currentPage } = this.state;
    const page = currentPage - 1;
    const data = await getTransactions(page, pageSize);
    const categories = await getCategories();
    this.setState({
      data: data.transactions,
      totalPages: data.totalPages,
      categories,
    });
  }

  updateData = async () => {
    const { pageSize, currentPage } = this.state;
    const page = currentPage - 1;
    const data = await getTransactions(page, pageSize);
    const { transactions } = data;
    this.setState({
      data: transactions,
    });
  };

  openModal = () => {
    this.setState({ isOpen: true });
  };

  closeModal = () => {
    this.setState({ isOpen: false, selectedTransaction: null });
  };

  onClickTransaction = (transaction) => {
    this.setState({ selectedTransaction: transaction }, () => {
      this.setState({ isOpen: true });
    });
  };

  handlePageChange = (event, value) => {
    this.setState(
      {
        currentPage: value,
      },
      () => {
        this.updateData();
      }
    );
  };

  render() {
    const {
      categories,
      data,
      selectedTransaction,
      totalPages,
      currentPage,
    } = this.state;
    return (
      <div className='transaction-container'>
        <div className='header'>
          <h2>Transactions</h2>
          <button onClick={this.openModal}>+ Add Transactions</button>
        </div>
        <div>
          <TransactionList
            data={data}
            onClickTransaction={this.onClickTransaction}
          />
        </div>
        <div className='paginatiton'>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={this.handlePageChange}
            variant='outlined'
            shape='rounded'
          />
        </div>
        <Dialog
          open={this.state.isOpen}
          onClose={this.closeModal}
          fullWidth
          maxWidth='xs'
          disableBackdropClick
        >
          <DialogTitle>
            {!selectedTransaction ? (
              <Typography variant='h6'>Add Transaction</Typography>
            ) : (
              <>
                <Typography variant='h6'>Edit/Delete Transaction</Typography>{" "}
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
            <TransactionForm
              categories={categories}
              closeModal={this.closeModal}
              updateData={this.updateData}
              selectedTransaction={selectedTransaction}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default Transactions;
