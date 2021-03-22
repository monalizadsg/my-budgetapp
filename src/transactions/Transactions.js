import React, { Component } from "react";
import { format, startOfWeek, endOfWeek } from "date-fns";
import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";
import DateRangeDropdown from "../components/DateRangeDropdown";
import Pagination from "@material-ui/lab/Pagination";
import {
  getTransactions,
  getCategories,
  getTransactionsTotal,
} from "./transactionsService";
import "./Transactions.scss";
import Toast from "../components/Toast";
import FormDialog from "./../components/FormDialog";
import LoadingWithBackdrop from "../components/LoadingWithBackdrop";

const initialDateRange = {
  id: 1,
  startDate: format(startOfWeek(new Date()), "yyyy-MM-dd"),
  endDate: format(endOfWeek(new Date()), "yyyy-MM-dd"),
};

class Transactions extends Component {
  state = {
    isOpen: false,
    data: [],
    categories: [],
    totalPages: 0,
    currentPage: 1,
    pageSize: 10,
    selectedDateRange: initialDateRange,
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
    const categories = await getCategories();
    const { startDate, endDate } = this.state.selectedDateRange;
    const total = await this.fetchTotal(startDate, endDate);
    const { totalIncome, totalExpense } = total;
    this.setState({
      categories,
      totalIncome,
      totalExpense,
    });
    this.fetchData();
  }

  updateData = () => {
    this.fetchData();
  };

  fetchTotal = async (startDate, endDate) => {
    const totalIncome = await getTransactionsTotal(
      startDate,
      endDate,
      "INCOME"
    );
    const totalExpense = await getTransactionsTotal(
      startDate,
      endDate,
      "EXPENSE"
    );

    const total = { totalIncome, totalExpense };

    return total;
  };

  fetchData = async () => {
    const { pageSize, currentPage } = this.state;
    const page = currentPage - 1;
    const { startDate, endDate } = this.state.selectedDateRange;
    const data = await getTransactions(startDate, endDate, page, pageSize);
    const { transactions, totalPages } = data;
    this.setState({
      data: transactions,
      totalPages: totalPages,
      isLoading: false,
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
    toastMessage.message = "";
    this.setState({ toastMessage });
  };

  closeLoading = () => {
    this.setState({ isLoading: false });
  };

  openModal = () => {
    this.setState({ isOpen: true });
  };

  closeModal = () => {
    this.setState({ isOpen: false, selectedTransaction: null });
  };

  onClickTransaction = (transaction) => {
    this.setState({ selectedTransaction: transaction });
  };

  onClickEdit = () => {
    this.setState({ isOpen: true });
  };

  handlePageChange = (event, value) => {
    this.setState(
      {
        currentPage: value,
        isLoading: true,
      },
      () => {
        this.updateData();
      }
    );
  };

  filterData = async (range) => {
    this.setState({ isLoading: true });
    const data = await getTransactions(range.startDate, range.endDate);
    const total = await this.fetchTotal(range.startDate, range.endDate);
    const { transactions, totalPages } = data;
    this.setState({
      data: transactions,
      totalPages,
      selectedDateRange: range,
      totalIncome: total.totalIncome,
      totalExpense: total.totalExpense,
      isLoading: false,
    });
  };

  renderDate = () => {
    const { selectedDateRange } = this.state;
    const startDate = format(
      new Date(selectedDateRange.startDate),
      "dd MMMM yyyy"
    );
    const endDate = format(new Date(selectedDateRange.endDate), "dd MMMM yyyy");

    return (
      <div>
        {startDate} - {endDate}
      </div>
    );
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

    return (
      <div className='transaction-container'>
        {isLoading && (
          <LoadingWithBackdrop open={isLoading} onClose={this.closeLoading} />
        )}
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
        {!isLoading && (
          <>
            <div className='date'>{this.renderDate()}</div>
            <div>
              <TransactionList
                data={data}
                onClickTransaction={this.onClickTransaction}
                onClickEdit={this.onClickEdit}
                totalIncome={totalIncome}
                totalExpense={totalExpense}
                updateData={this.updateData}
                showToast={this.showToast}
              />
            </div>
            <div className='pagination'>
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
          </>
        )}
        <Toast message={message} open={isOpen} onClose={this.closeToast} />

        <FormDialog
          isOpen={this.state.isOpen}
          onClose={this.closeModal}
          title={!selectedTransaction ? "Add Transaction" : "Edit Transaction"}
        >
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
        </FormDialog>
      </div>
    );
  }
}

export default Transactions;
