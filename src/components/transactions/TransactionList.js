import React, { Component } from "react";
import { format } from "date-fns";
import groupBy from "lodash/groupBy";
import { Card, List, ListItem } from "@material-ui/core";
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
    });
    return computedTotal;
  };

  render() {
    const { data, onClickTransaction } = this.props;
    const dataByDate = groupBy(data, "date");
    const result = Object.entries(dataByDate).map(([key, value], index) => {
      // console.log({ key, value });
      const now = format(new Date(), "yyyy-MM-dd");
      const date = key === now ? "Today" : format(new Date(key), "MM/dd/yyyy");
      const totalAmount = this.computeTotal(value);

      return (
        <React.Fragment key={index}>
          <div className='card'>
            <div className='card-header'>
              <div className='item-date'>{date}</div>
              <div className='item-total'>{totalAmount}</div>
            </div>

            {value.map((item) => {
              const categoryType = item.category.type;
              const amountStyle = {
                color: categoryType === "INCOME" ? "#1dc29f" : "#fe3b2c",
                fontWeight: "500",
              };
              return (
                <Card className='card-item'>
                  <List
                    className='list'
                    key={item.id}
                    onClick={() => onClickTransaction(item)}
                  >
                    <ListItem className='list-item'>
                      <div className='item'>
                        <h4 className='item-title'>{item.description}</h4>
                        <p className='item-subcategory'>{item.category.name}</p>
                      </div>
                      <div className='item' style={amountStyle}>
                        {item.amount}
                      </div>
                    </ListItem>
                  </List>
                </Card>
              );
            })}
          </div>
        </React.Fragment>
      );
    });
    return <div>{result}</div>;
  }
}

export default TransactionList;
