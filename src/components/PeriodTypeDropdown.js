import React, { Component } from "react";
import { format, startOfMonth, startOfWeek, startOfYear } from "date-fns";
import { FormControl, Select, InputLabel, MenuItem } from "@material-ui/core";
import "./DateRangeDropdown.scss";

const menuProps = {
  classes: {
    paper: {
      borderRadius: 12,
      marginTop: 8,
    },
    list: {
      paddingTop: 0,
      paddingBottom: 0,
      background: "white",
      "& li": {
        fontWeight: 200,
        paddingTop: 12,
        paddingBottom: 12,
      },
    },
  },
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "left",
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "left",
  },
  getContentAnchorEl: null,
};

class PeriodTypeDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      period: [
        {
          id: 1,
          type: "Weekly",
          startDate: format(startOfWeek(new Date()), "yyyy-MM-dd"),
        },
        {
          id: 2,
          type: "Monthly",
          startDate: format(startOfMonth(new Date()), "yyyy-MM-dd"),
        },
        {
          id: 3,
          type: "Yearly",
          startDate: format(startOfYear(new Date()), "yyyy-MM-dd"),
        },
      ],
    };
  }

  onChangePeriodType = (e) => {
    const periodId = Number(e.target.value);
    const period = this.state.period.find((e) => e.id === periodId);
    this.props.onFilter(period);
  };

  render() {
    const { period } = this.state;
    return (
      <>
        <FormControl
          variant='outlined'
          style={{ minWidth: "180px" }}
          size='small'
        >
          <InputLabel htmlFor='category'>Period</InputLabel>
          <Select
            label='Period'
            name='period'
            id='period'
            defaultValue={1}
            MenuProps={menuProps}
            placeholder='Select period type'
            onChange={this.onChangePeriodType}
          >
            {period.map((e) => {
              return (
                <MenuItem key={e.id} value={e.id}>
                  {e.type}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </>
    );
  }
}

export default PeriodTypeDropdown;
