import React, { Component } from "react";
import { format } from "date-fns";
import groupBy from "lodash/groupBy";
import { Card, List, ListItem, Divider } from "@material-ui/core";
import "./TransactionList.scss";

class TransactionList extends Component {
  computeTotal = (dataByDate) => {
    let computedTotal = 0;
    let income = 0;
    let expense = 0;

    dataByDate.map((item) => {
      if (item.category.type === "INCOME") {
        income += item.amount;
        computedTotal = income - expense;
      } else if (item.category.type === "EXPENSE") {
        expense += item.amount;
        computedTotal = income - expense;
      }
      return computedTotal;
    });
    return computedTotal;
  };

  computeTotalIncome = (data) => {
    let totalIncome = 0;
    // let expense = 0;

    data.map((item) => {
      if (item.category.type === "INCOME") {
        totalIncome += item.amount;
      }
      return totalIncome;
    });

    return totalIncome;
  };

  computeTotalExpense = (data) => {
    let totalExpense = 0;
    // let expense = 0;

    data.map((item) => {
      if (item.category.type === "EXPENSE") {
        totalExpense += item.amount;
      }
      return totalExpense;
    });

    return totalExpense;
  };

  renderTotal = (data, amountFormatter) => {
    const totalIncome = this.computeTotalIncome(data);
    const totalExpense = this.computeTotalExpense(data);

    return (
      <div className='transaction-total'>
        <div className='total income'>
          INCOME: {amountFormatter.format(totalIncome)}
        </div>
        <div className='total expense'>
          EXPENSE: {amountFormatter.format(totalExpense)}
        </div>
        <div className='total balance'>
          BALANCE: {amountFormatter.format(totalIncome - totalExpense)}
        </div>
      </div>
    );
  };

  render() {
    const { data, onClickTransaction } = this.props;
    if (!data) {
      return;
    }

    const dataByDate = groupBy(data, "date");
    const amountFormatter = new Intl.NumberFormat("ms-MY", {
      style: "currency",
      currency: "MYR",
      minimumFractionDigits: 2,
    });

    const header = this.renderTotal(data, amountFormatter);

    const result = Object.entries(dataByDate).map(([key, value], index) => {
      // console.log({ key, value });
      const now = format(new Date(), "yyyy-MM-dd");
      const date = key === now ? "Today" : format(new Date(key), "dd MMM yyyy");
      const totalAmount = this.computeTotal(value);

      return (
        <React.Fragment key={index}>
          <div className='transaction-list'>
            <div className='transaction-list-card'>
              <div className='card-header'>
                <div className='item-date'>{date}</div>
                <div className='item-total'>
                  <div>{amountFormatter.format(totalAmount)}</div>
                </div>
              </div>

              {value.map((item, index) => {
                const categoryType = item.category.type;
                const amountStyle = {
                  color: categoryType === "INCOME" ? "#1dc29f" : "#fe3b2c",
                  fontWeight: "500",
                };
                const amountItem =
                  categoryType === "INCOME" ? item.amount : -item.amount;
                return (
                  <Card key={item.id} className='card-item'>
                    <List
                      className='list'
                      key={item.id}
                      onClick={() => onClickTransaction(item)}
                    >
                      <ListItem className='list-item'>
                        <div className='item'>
                          <h4 className='item-title'>{item.description}</h4>
                          <p className='item-subcategory'>
                            {item.category.name}
                          </p>
                        </div>
                        <div className='item' style={amountStyle}>
                          {amountFormatter.format(amountItem)}
                        </div>
                      </ListItem>
                    </List>
                    {index < value.length ? <Divider /> : null}
                  </Card>
                );
              })}
            </div>
          </div>
        </React.Fragment>
      );
    });
    return (
      <div>
        {data.length > 0 ? (
          <>
            {header}
            {result}
          </>
        ) : (
          <div className='empty-card'>No record found</div>
        )}
      </div>
    );
  }
}

export default TransactionList;
