import React from "react";
import {
  Card,
  List,
  ListItem,
  LinearProgress,
  withStyles,
} from "@material-ui/core";
import Empty from "./../components/Empty";
import "./BudgetList.scss";

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 10,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: "#f1f1f1",
  },
  bar: {
    borderRadius: 5,
    backgroundColor: "#4ebba4",
  },
}))(LinearProgress);

const BudgetList = (props) => {
  const renderHeader = () => {
    const period = props.data[0]?.periodType;
    const startDate = props.data[0]?.startDate;
    const endDate = props.data[0]?.endDate;
    return (
      <div className='budget-list'>
        <div className='budget-list-card'>
          <div className='card-header'>
            <div>{period} Budgets</div>
            <div className='item-date'>
              {startDate} to {endDate}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getTotalExpense = (maxValue, leftValue) => {
    const MIN = 0;
    const MAX = maxValue;
    const normalize = (value) => ((value - MIN) * 100) / (MAX - MIN);
    const totalExpense =
      leftValue > 0 ? normalize(maxValue - leftValue) : normalize(maxValue);

    return totalExpense;
  };

  const { data, onClickBudget } = props;
  const result = data.map((item) => {
    const totalExpense = getTotalExpense(item.amountLimit, item.amountLeft);
    const isLimitReach = item.amountLeft <= 0;
    return (
      <div key={item.id} className='budget-list'>
        <div className='budget-list-card'>
          <Card className='card-item'>
            <List
              className='list'
              key={item.id}
              onClick={() => onClickBudget(item)}
            >
              <ListItem className='list-item'>
                <div className='details'>
                  <div className='item-title'>{item.category.name}</div>
                  <div className='item-amount'>
                    <h4 className='budget-total'>{item.amountLimit}</h4>
                  </div>
                </div>
                <div className='sub-details'>
                  <div className='left'></div>
                  <div className='right'>
                    <div className='progress-bar'>
                      <BorderLinearProgress
                        variant='determinate'
                        value={totalExpense}
                        className={isLimitReach ? "reach-progress-limit" : ""}
                      />
                    </div>
                    <div
                      className={`amount-left ${
                        isLimitReach ? "overspent" : ""
                      }`}
                    >
                      {item.amountLeft < 0 ? "Overspent: " : "Left: "}
                      {item.amountLeft}
                    </div>
                  </div>
                </div>
              </ListItem>
            </List>
          </Card>
        </div>
      </div>
    );
  });

  return (
    <div>
      {data.length > 0 ? (
        <>
          {renderHeader()}
          {result}
        </>
      ) : (
        <Empty />
      )}
    </div>
  );
};

export default BudgetList;
