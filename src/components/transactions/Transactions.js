import React, { Component } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import TransactionForm from "./TransactionForm";
import "./Transactions.scss";

class Transactions extends Component {
  state = {
    isOpen: false,
  };

  openModal = () => {
    this.setState({ isOpen: true });
  };

  closeModal = () => {
    this.setState({ isOpen: false });
  };
  render() {
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
            <TransactionForm />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeModal} color='primary'>
              Cancel
            </Button>
            <Button onClick={this.closeModal} color='primary'>
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default Transactions;
