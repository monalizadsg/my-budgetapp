import React, { useState } from "react";
import {
  Card,
  LinearProgress,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  List,
  ListItem,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { deleteBudget, getBudgetTransactions } from "./budgetService";
import Empty from "./../components/Empty";
import { formatAmount } from "../commons/utils";
import { format } from "date-fns";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import "./BudgetList.scss";
import ConfirmDialogContent from "../components/ConfirmDialogContent";
import CloseIcon from "@material-ui/icons/Close";
import Modal from "../components/Modal";

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

const BudgetList = (props) => {
  const [menuAction, setMenuAction] = useState(null);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [isLoading, setIsLoading] = useState(props.isLoading);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false);
  const [budgetTransactions, setBudgetTransactions] = useState([]);

  const handleClick = (event, item) => {
    setMenuAction(event.currentTarget);
    setSelectedBudget(item);
    props.onClickBudget(item);
  };

  const handleClose = () => {
    setMenuAction(null);
    setSelectedBudget(null);
    props.onClickBudget(null);
  };

  const closeDeleteModal = () => {
    setSelectedBudget(null);
    setIsDeleteModalOpen(false);
    setIsLoading(false);
  };

  const closeTransactionsModal = () => {
    setSelectedBudget(null);
    setIsTransactionsModalOpen(false);
  };

  const handleEdit = () => {
    setMenuAction(null);
    props.onClickEdit();
  };

  const displayTransactions = async () => {
    const startDate = format(new Date(), "yyyy-MM-dd");
    const budgetId = selectedBudget?.id;
    const budgetTransactions = await getBudgetTransactions(budgetId, startDate);
    setBudgetTransactions(budgetTransactions.data);
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

    props.updateData();
    props.showToast("Budget is successfully deleted!");
    closeDeleteModal();
  };

  const handleDelete = () => {
    setMenuAction(null);
    setIsDeleteModalOpen(true);
  };

  const renderHeader = () => {
    const period = props.data[0]?.periodType;
    const startDate = props.data[0]?.startDate;
    const endDate = props.data[0]?.endDate;
    return (
      <div className='budget-list-header'>
        <div>{period} Budgets</div>
        <div className='item-date'>
          {startDate} to {endDate}
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

  const renderBudgetList = () => {
    return (
      <>
        <div className='budget-list-card'>
          {props.data.map((item) => {
            const totalExpense = getTotalExpense(
              item.amountLimit,
              item.amountLeft
            );
            const isLimitReach = item.amountLeft <= 0;
            return (
              <Card key={item.id} className='card-item'>
                <div className='list-item'>
                  <div className='left-col'>
                    <div className='details'>
                      <div className='item-title'>{item.category.name}</div>
                      <div className='item-amount'>
                        <h4 className='budget-total'>
                          {formatAmount(item.amountLimit)}
                        </h4>
                      </div>
                    </div>
                    <div className='sub-details'>
                      <div className='left'></div>
                      <div className='right'>
                        <div className='progress-bar'>
                          <BorderLinearProgress
                            variant='determinate'
                            value={totalExpense}
                            className={
                              isLimitReach ? "reach-progress-limit" : ""
                            }
                          />
                        </div>
                        <div
                          className={`amount-left ${
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
            {budgetTransactions && (
              <>
                <div className='amount-wrapper'>
                  <div className='amount-limit'>
                    Amount Limit: {formatAmount(selectedBudget?.amountLimit)}
                  </div>
                  <div className='total-expense'>
                    Total Expense:{" "}
                    {formatAmount(
                      selectedBudget?.amountLimit - selectedBudget?.amountLeft
                    )}
                  </div>
                </div>
                <div className='date-range'>
                  {`${props.data[0]?.startDate} to  ${props.data[0]?.endDate}`}
                </div>
              </>
            )}
            <List className='list'>
              {budgetTransactions.length > 0 ? (
                budgetTransactions.map((item) => (
                  <ListItem className='list-item' key={item.id}>
                    <div className='date'>{item.date}</div>
                    <div className='desc'>{item.description}</div>
                    <div className='amount'>{formatAmount(item.amount)}</div>
                  </ListItem>
                ))
              ) : (
                <div className='no-data'>No transactions yet.</div>
              )}
            </List>
          </div>
        </Modal>
      </>
    );
  };

  return (
    <>
      <div className='budget-list'>
        {props.data.length > 0 ? (
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
