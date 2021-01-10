import React, { Component } from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subWeeks,
  subMonths,
} from "date-fns";
import {
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import "./DateRangeDropdown.scss";
import DatePickerInput from "./DatePickerInput";

const menuProps = {
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

class DateRangeDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      dateRanges: [
        {
          id: 1,
          label: "This week",
          startDate: format(startOfWeek(new Date()), "yyyy-MM-dd"),
          endDate: format(endOfWeek(new Date()), "yyyy-MM-dd"),
        },
        {
          id: 2,
          label: "Last week",
          startDate: format(startOfWeek(subWeeks(new Date(), 1)), "yyyy-MM-dd"),
          endDate: format(endOfWeek(subWeeks(new Date(), 1)), "yyyy-MM-dd"),
        },
        {
          id: 3,
          label: "This month",
          startDate: format(startOfMonth(new Date()), "yyyy-MM-dd"),
          endDate: format(endOfMonth(new Date()), "yyyy-MM-dd"),
        },
        {
          id: 4,
          label: "Last month",
          startDate: format(
            startOfMonth(subMonths(new Date(), 1)),
            "yyyy-MM-dd"
          ),
          endDate: format(endOfMonth(subMonths(new Date(), 1)), "yyyy-MM-dd"),
        },
        {
          id: 5,
          label: "Custom",
          startDate: this.props.startDate,
          endDate: this.props.endDate,
        },
      ],
    };
  }

  onChangeDateRange = (e) => {
    const rangeId = Number(e.target.value);
    const range = this.state.dateRanges.find((range) => range.id === rangeId);
    if (range.id !== 5) {
      this.props.onFilter(range);
    }
  };

  onGetCustomDates = () => {
    const range = this.state.dateRanges.find((range) => range.id === 5);
    this.props.onFilter(range);
    this.closeDialog();
  };

  showDialog = () => {
    this.setState({ isOpen: true });
  };

  closeDialog = () => {
    this.setState({ isOpen: false });
  };

  handleStartDateChange = (date) => {
    const dateRanges = [...this.state.dateRanges];
    const range = dateRanges.find((range) => range.id === 5);
    range.startDate = format(date, "yyyy-MM-dd");
    this.setState({ dateRanges });
  };

  handleEndDateChange = (date) => {
    const dateRanges = [...this.state.dateRanges];
    const range = dateRanges.find((range) => range.id === 5);
    range.endDate = format(date, "yyyy-MM-dd");
    this.setState({ dateRanges });
  };

  render() {
    const { isOpen, dateRanges } = this.state;
    return (
      <>
        <FormControl
          variant='outlined'
          style={{ minWidth: "180px" }}
          size='small'
        >
          <InputLabel htmlFor='dateRange'>Date range</InputLabel>
          <Select
            label='Date Range'
            name='dateRange'
            id='dateRange'
            defaultValue={1}
            MenuProps={menuProps}
            placeholder='Select date range'
            onChange={this.onChangeDateRange}
          >
            {dateRanges.map((dateRange) => {
              return (
                <MenuItem
                  key={dateRange.id}
                  value={dateRange.id}
                  onClick={dateRange.id === 5 ? this.showDialog : null}
                >
                  {dateRange.label}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <CustomDateRangeDialog
          isOpen={isOpen}
          onClose={this.closeDialog}
          onStartDateChange={this.handleStartDateChange}
          onEndDateChange={this.handleEndDateChange}
          startDate={dateRanges[4].startDate}
          endDate={dateRanges[4].endDate}
          onChangeCustomDateRange={this.onGetCustomDates}
        />
      </>
    );
  }
}

const CustomDateRangeDialog = ({
  isOpen,
  onClose,
  onStartDateChange,
  onEndDateChange,
  startDate,
  endDate,
  onChangeCustomDateRange,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle id='alert-dialog-title' dividers='true'>
        Custom
      </DialogTitle>
      <DialogContent>
        <DatePickerInput
          label='Start Date'
          value={startDate}
          onDateChange={onStartDateChange}
        />
        <DatePickerInput
          label='End Date'
          value={endDate}
          onDateChange={onEndDateChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Cancel
        </Button>
        <Button onClick={onChangeCustomDateRange} color='primary' autoFocus>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DateRangeDropdown;
