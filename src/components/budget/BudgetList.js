import React, { Component } from "react";
import {
  Card,
  List,
  ListItem,
  LinearProgress,
  withStyles,
} from "@material-ui/core";
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

class BudgetList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderHeader = () => {
    const period = this.props.data[0]?.periodType;
    const startDate = this.props.data[0]?.startDate;
    const endDate = this.props.data[0]?.endDate;

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

  render() {
    const { data, onClickBudget } = this.props;
    const result = data.map((item) => {
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
                    <div className='left'>Icons</div>
                    <div className='right'>
                      <div className='progress-bar'>
                        <BorderLinearProgress
                          variant='determinate'
                          value={80}
                        />
                      </div>
                      <div className='amount-left'>left ~ 50</div>
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
            {this.renderHeader()}
            {result}
          </>
        ) : (
          <div className='empty-card'>No record found</div>
        )}
      </div>
    );
  }
}

export default BudgetList;
