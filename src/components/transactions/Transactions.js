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
import DateRangeDropdown from "./../common/DateRangeDropdown";
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
    pageSize: 10,
    selectedDateRange: {
      id: 1,
      startDate: format(startOfWeek(new Date()), "yyyy-MM-dd"),
      endDate: format(endOfWeek(new Date()), "yyyy-MM-dd"),
    },
    selectedTransaction: null,
  };

  async componentDidMount() {
    const { startDate, endDate } = this.state.selectedDateRange;
    const data = await getTransactions(startDate, endDate);
    const categories = await getCategories();
    this.setState({
      data: data.transactions,
      totalPages: data.totalPages,
      categories,
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

  filterData = async (range) => {
    const data = await getTransactions(range.startDate, range.endDate);
    this.setState({
      data: data.transactions,
      totalPages: data.totalPages,
      selectedDateRange: range,
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
    } = this.state;
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
            <button onClick={this.openModal}>+ Add</button>
          </div>
        </div>
        <div>
          <TransactionList
            data={data}
            onClickTransaction={this.onClickTransaction}
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
