import React, { useState, useEffect } from "react";
import {
  Card,
  LinearProgress,
  Menu,
  MenuItem,
  IconButton,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { deleteBudget, getBudgetTransactions } from "./budgetService";
import Empty from "./../components/Empty";
import { formatAmount } from "../commons/utils";
import {
  format,
  subWeeks,
  subMonths,
  subYears,
  addWeeks,
  addMonths,
  addYears,
} from "date-fns";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import "./BudgetList.scss";
import ConfirmDialogContent from "../components/ConfirmDialogContent";
import CloseIcon from "@material-ui/icons/Close";
import Modal from "../components/Modal";
import TransactionsTable from "./TransactionsTable";
import Loading from "./../components/Loading";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

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

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const BudgetList = ({
  data,
  onClickBudget,
  onClickEdit,
  loading,
  updateData,
  showToast,
  onClickDateRangeArrow,
}) => {
  const [menuAction, setMenuAction] = useState(null);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [isLoading, setIsLoading] = useState(loading);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false);
  const [budgetTransactions, setBudgetTransactions] = useState([]);
  const [dateRange, setDateRange] = useState({
    period: data[0]?.periodType,
    startDate: data[0]?.startDate,
    endDate: data[0]?.endDate,
  });

  useEffect(() => {
    onClickDateRangeArrow(dateRange.startDate);
  }, [onClickDateRangeArrow, dateRange]);

  const handleClick = (event, item) => {
    setMenuAction(event.currentTarget);
    setSelectedBudget(item);
    onClickBudget(item);
  };

  const handleClose = () => {
    setMenuAction(null);
    setSelectedBudget(null);
    onClickBudget(null);
  };

  const closeDeleteModal = () => {
    setSelectedBudget(null);
    setIsDeleteModalOpen(false);
    setIsLoading(false);
    onClickBudget(null);
  };

  const closeTransactionsModal = () => {
    setSelectedBudget(null);
    setIsTransactionsModalOpen(false);
    onClickBudget(null);
  };

  const handleEdit = () => {
    setMenuAction(null);
    onClickEdit();
  };

  const displayTransactions = async () => {
    setIsLoading(true);
    const startDate = format(new Date(dateRange.startDate), "yyyy-MM-dd");
    const budgetId = selectedBudget?.id;
    const budgetTransactions = await getBudgetTransactions(budgetId, startDate);
    setBudgetTransactions(budgetTransactions.data);
    setIsLoading(false);
  };

  const handleDisplayTransactions = async () => {
    setMenuAction(null);
    setIsTransactionsModalOpen(true);
    displayTransactions();
  };

  const onDeleteBudget = async () => {
    setIsLoading(true);
    const budgetId = selectedBudget?.id;
    await deleteBudget(budgetId);

    updateData();
    showToast("Budget is successfully deleted!");
    closeDeleteModal();
  };

  const handleDelete = () => {
    setMenuAction(null);
    setIsDeleteModalOpen(true);
  };

  const changeDateRange = (prevDate) => {
    const period = dateRange.period;
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    let newDateRange = {};
    if (period === "WEEKLY") {
      newDateRange.startDate =
        prevDate === "previous-date"
          ? subWeeks(startDate, 1)
          : addWeeks(startDate, 1);
      newDateRange.endDate =
        prevDate === "previous-date"
          ? subWeeks(endDate, 1)
          : addWeeks(endDate, 1);
    }
    if (period === "MONTHLY") {
      newDateRange.startDate =
        prevDate === "previous-date"
          ? subMonths(startDate, 1)
          : addMonths(startDate, 1);
      newDateRange.endDate =
        prevDate === "previous-date"
          ? subMonths(endDate, 1)
          : addMonths(endDate, 1);
    }
    if (period === "YEARLY") {
      newDateRange.startDate =
        prevDate === "previous-date"
          ? subYears(startDate, 1)
          : addYears(startDate, 1);
      newDateRange.endDate =
        prevDate === "previous-date"
          ? subYears(endDate, 1)
          : addYears(endDate, 1);
    }

    setDateRange({
      ...dateRange,
      ...newDateRange,
    });
  };

  const renderHeader = () => {
    const period = dateRange.period;
    const startDate = format(new Date(dateRange.startDate), "dd MMM yyyy");
    const endDate = format(new Date(dateRange.endDate), "dd MMM yyyy");
    const notGreaterThanToday = new Date() > new Date(endDate);
    return (
      <div className='budget-list-header'>
        <div>{period} Budgets</div>
        <div className='item-date'>
          <ArrowBackIosIcon
            className='arrow-icon'
            onClick={() => changeDateRange("previous-date")}
          />
          {startDate} - {endDate}
          {notGreaterThanToday && (
            <ArrowForwardIosIcon
              className='arrow-icon'
              onClick={changeDateRange}
            />
          )}
        </div>
      </div>
    );
  };

  const renderTotalBudget = () => {
    let totalAmountLimit = 0;
    let totalAmountLeft = 0;

    for (const item of data) {
      totalAmountLimit += item.amountLimit;
      totalAmountLeft += item.amountLeft;
    }

    const totalExpense = getTotalExpense(totalAmountLimit, totalAmountLeft);
    const isLimitReach = totalAmountLeft <= 0;

    return (
      <Card className='card-item total'>
        <div className='left-col-details'>
          <div className='left-col-details-title'>
            Total {dateRange.period} Budget
          </div>
          <div className='left-col-details-amount'>
            <h4>{formatAmount(totalAmountLimit)}</h4>
          </div>
        </div>
        <div className='sub-details total'>
          <div className='sub-details-progress-bar'>
            <BorderLinearProgress
              variant='determinate'
              value={totalExpense}
              className={isLimitReach ? "reach-progress-limit" : ""}
            />
          </div>
          <div
            className={`sub-details-amount-left ${
              isLimitReach ? "overspent" : ""
            }`}
          >
            {totalAmountLeft < 0 ? "Overspent: " : "Left: "}
            {formatAmount(totalAmountLeft)}
          </div>
        </div>
      </Card>
    );
  };

  //use for progressbar calculation
  const getTotalExpense = (maxValue, leftValue) => {
    const MIN = 0;
    const MAX = maxValue;
    const normalize = (value) => ((value - MIN) * 100) / (MAX - MIN);
    const totalExpense =
      leftValue > 0 ? normalize(maxValue - leftValue) : normalize(maxValue);

    return totalExpense;
  };

  const renderBudgetList = () => {
    return (
      <>
        <div className='budget-list-card'>
          {renderTotalBudget()}
          {data.map((item) => {
            const totalExpense = getTotalExpense(
              item.amountLimit,
              item.amountLeft
            );
            const isLimitReach = item.amountLeft <= 0;
            return (
              <Card key={item.id} className='card-item'>
                <div className='list-item'>
                  <div className='left-col'>
                    <div className='left-col-details'>
                      <div className='left-col-details-title'>
                        {item.category.name}
                      </div>
                      <div className='left-col-details-amount'>
                        <h4>{formatAmount(item.amountLimit)}</h4>
                      </div>
                    </div>
                    <div className='sub-details'>
                      <div className='sub-details-left'></div>
                      <div className='sub-details-right'>
                        <div className='sub-details-progress-bar'>
                          <BorderLinearProgress
                            variant='determinate'
                            value={totalExpense}
                            className={
                              isLimitReach ? "reach-progress-limit" : ""
                            }
                          />
                        </div>
                        <div
                          className={`sub-details-amount-left ${
                            isLimitReach ? "overspent" : ""
                          }`}
                        >
                          {item.amountLeft < 0 ? "Overspent: " : "Left: "}
                          {formatAmount(item.amountLeft)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='right-col'>
                    <MoreVertIcon
                      className='more-icon'
                      onClick={(event) => handleClick(event, item)}
                    />
                    <StyledMenu
                      anchorEl={menuAction}
                      keepMounted
                      open={Boolean(menuAction)}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={handleEdit}>Edit</MenuItem>
                      <MenuItem onClick={handleDelete}>Delete</MenuItem>
                      <MenuItem onClick={handleDisplayTransactions}>
                        Transactions
                      </MenuItem>
                    </StyledMenu>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Modal openModal={isDeleteModalOpen} onCloseModal={closeDeleteModal}>
          <ConfirmDialogContent
            isLoading={isLoading}
            onDelete={onDeleteBudget}
            onClose={closeDeleteModal}
          >
            <div>
              <Typography>Category: {selectedBudget?.category.name}</Typography>
              <Typography>Amount: {selectedBudget?.amountLimit}</Typography>
              <Typography>Period: {selectedBudget?.periodType}</Typography>
            </div>
          </ConfirmDialogContent>
        </Modal>

        <Modal
          openModal={isTransactionsModalOpen}
          onCloseModal={closeTransactionsModal}
          title={
            <>
              {selectedBudget?.category.name}
              <IconButton
                edge='end'
                color='inherit'
                onClick={closeTransactionsModal}
                aria-label='close'
              >
                <CloseIcon />
              </IconButton>
            </>
          }
        >
          <div className='budget-transactions-modal-content'>
            {isLoading && <Loading isLoading={isLoading} />}
            {!isLoading && budgetTransactions && (
              <div className='table'>
                {budgetTransactions.length > 0 ? (
                  <>
                    <div className='date-range'>
                      {`${data[0]?.startDate} to  ${data[0]?.endDate}`}
                    </div>
                    <TransactionsTable
                      rows={budgetTransactions}
                      budget={selectedBudget}
                    />
                  </>
                ) : (
                  <div className='no-data'>No transactions yet.</div>
                )}
              </div>
            )}
          </div>
        </Modal>
      </>
    );
  };

  return (
    <>
      <div className='budget-list'>
        {data.length > 0 ? (
          <>
            {renderHeader()}
            {renderBudgetList()}
          </>
        ) : (
          <Empty />
        )}
      </div>
    </>
  );
};

export default BudgetList;
