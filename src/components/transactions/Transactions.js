import React, { Component } from "react";
import "./Transactions.scss";

class Transactions extends Component {
  render() {
    return (
      <div className='transaction-container'>
        <div className='header'>
          <h2>Transactions</h2>
          <button>+ Add Transactions</button>
        </div>
      </div>
    );
  }
}

export default Transactions;
