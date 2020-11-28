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

import { format, startOfWeek, endOfWeek } from "date-fns";

import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";
import DateRangeDropdown from "../components/DateRangeDropdown";
import { getTransactions, getCategories } from "./transactionsService";
import Loading from "../components/Loading";
import "./Transactions.scss";
import Toast from "../components/Toast";

class Transactions extends Component {
  state = {
    isOpen: false,
    data: [],
    categories: [],
    totalPages: 0,
    currentPage: 1,
    pageSize: 10,
    selectedDateRange: {
      id: 1,
      startDate: format(startOfWeek(new Date()), "yyyy-MM-dd"),
      endDate: format(endOfWeek(new Date()), "yyyy-MM-dd"),
    },
    selectedTransaction: null,
    isLoading: true,
    toastMessage: {
      isOpen: false,
      message: "",
    },
    totalIncome: 0,
    totalExpense: 0,
  };

  async componentDidMount() {
    const { startDate, endDate } = this.state.selectedDateRange;
    const data = await getTransactions(startDate, endDate);
    console.log(data);
    const categories = await getCategories();
    this.setState({
      data: data.transactions,
      totalPages: data.totalPages,
      categories,
      isLoading: false,
      totalIncome: data.totalIncome,
      totalExpense: data.totalExpense,
    });
  }

  updateData = async () => {
    const { pageSize, currentPage } = this.state;
    const { startDate, endDate } = this.state.selectedDateRange;
    const page = currentPage - 1;
    const data = await getTransactions(startDate, endDate, page, pageSize);
    const { transactions, totalPages } = data;
    this.setState({
      data: transactions,
      totalPages,
      totalIncome: data.totalIncome,
      totalExpense: data.totalExpense,
    });
  };

  handleUpdateSuccess = (result) => {
    // Todo: Backend; Return value must be aligned with paginated trnx
    // const newData = this.state.data.map((item) => {
    //   if (item.id === result.id) {
    //     return result;
    //   }
    //   return item;
    // });
    // this.setState({
    //   data: newData,
    // });
    this.updateData();
    this.closeModal();
    this.showToast("Transaction is successfully updated!");
  };

  handleCreateSuccess = (result) => {
    // Todo: Backend; Return value must be aligned with paginated trnx
    // const newData = [...this.state.data, result];
    // this.setState({
    //   data: newData,
    // });
    this.updateData();
    this.closeModal();
    this.showToast("Transaction is successfully added!");
  };

  showToast = (message) => {
    let data = { ...this.state.toastMessage };
    data.isOpen = true;
    data.message = message;
    this.setState({ toastMessage: data });
  };

  closeToast = () => {
    let toastMessage = { ...this.state.toastMessage };
    toastMessage.isOpen = false;
    this.setState({ toastMessage });
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

  filterData = async (range) => {
    const data = await getTransactions(range.startDate, range.endDate);
    this.setState({
      data: data.transactions,
      totalPages: data.totalPages,
      selectedDateRange: range,
      totalIncome: data.totalIncome,
      totalExpense: data.totalExpense,
    });
  };

  render() {
    const {
      categories,
      data,
      selectedTransaction,
      totalPages,
      currentPage,
      selectedDateRange,
      isLoading,
      totalIncome,
      totalExpense,
    } = this.state;

    const { isOpen, message } = this.state.toastMessage;

    if (isLoading) {
      return <Loading isLoading={isLoading} />;
    }

    return (
      <div className='transaction-container'>
        <div className='header'>
          <h2>Transactions</h2>
          <div>
            <DateRangeDropdown
              onFilter={this.filterData}
              startDate={selectedDateRange.startDate}
              endDate={selectedDateRange.endDate}
            />
            <button onClick={this.openModal} className='add-button'>
              + Add
            </button>
          </div>
        </div>
        <div>
          <TransactionList
            data={data}
            onClickTransaction={this.onClickTransaction}
            totalIncome={totalIncome}
            totalExpense={totalExpense}
          />
        </div>
        <div className='paginatiton'>
          {data.length > 0 && totalPages > 1 && (
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={this.handlePageChange}
              variant='outlined'
              shape='rounded'
            />
          )}
        </div>
        <Toast message={message} open={isOpen} onClose={this.closeToast} />
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
              onSaveSuccess={
                selectedTransaction
                  ? this.handleUpdateSuccess
                  : this.handleCreateSuccess
              }
              showToast={this.showToast}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default Transactions;
