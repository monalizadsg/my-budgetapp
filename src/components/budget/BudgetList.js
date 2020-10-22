import React, { Component } from "react";
import {
  Card,
  List,
  ListItem,
  LinearProgress,
  withStyles,
  Tooltip,
  Button,
} from "@material-ui/core";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import groupBy from "lodash/groupBy";
import "./BudgetList.scss";
import { startOfYear } from "date-fns";
import { endOfYear } from "date-fns/esm";

const periodRange = {
  WEEKLY: {
    id: 1,
    startDate: format(startOfWeek(new Date()), "yyyy/MM/dd"),
    endDate: format(endOfWeek(new Date()), "yyyy/MM/dd"),
  },
  MONTHLY: {
    id: 2,
    startDate: format(startOfMonth(new Date()), "yyyy/MM/dd"),
    endDate: format(endOfMonth(new Date()), "yyyy/MM/dd"),
  },
  YEARLY: {
    id: 3,
    startDate: format(startOfYear(new Date()), "yyyy/MM/dd"),
    endDate: format(endOfYear(new Date()), "yyyy/MM/dd"),
  },
};

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
    backgroundColor: "#f44336",
  },
}))(LinearProgress);

class BudgetList extends Component {
  state = {};
  render() {
    const { data, onClickTransaction } = this.props;
    const dataByPeriod = groupBy(data, "periodType");
    const result = Object.entries(dataByPeriod).map(([key, value], index) => {
      console.log({ key, value });
      let dateRange;
      switch (key) {
        case "WEEKLY":
          dateRange = `${periodRange.WEEKLY.startDate} - ${periodRange.WEEKLY.endDate}`;
          break;
        case "MONTHLY":
          dateRange = `${periodRange.MONTHLY.startDate} - ${periodRange.MONTHLY.endDate}`;
          break;
        case "YEARLY":
          dateRange = `${periodRange.YEARLY.startDate} - ${periodRange.YEARLY.endDate}`;
          break;
        default:
          return null;
      }

      return (
        <React.Fragment>
          <div className='budget-list'>
            <div className='budget-list-card'>
              <div className='card-header'>
                <div>{key} Budgets</div>
                <div className='item-date'>{dateRange}</div>
              </div>

              {value.map((item) => {
                return (
                  <Card className='card-item'>
                    <List className='list'>
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
                              {/* <Tooltip
                                className='tooltip'
                                title='today'
                                open='true'
                                arrow
                              > */}
                              <BorderLinearProgress
                                variant='determinate'
                                value={80}
                              />
                              {/* </Tooltip> */}
                            </div>
                            <div className='amount-left'>left ~ 50</div>
                          </div>
                        </div>
                      </ListItem>
                    </List>
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
          result
        ) : (
          <div className='empty-card'>No record found</div>
        )}
      </div>
    );
  }
}

export default BudgetList;
