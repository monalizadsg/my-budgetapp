import React, { useState } from "react";
import { format } from "date-fns";
import groupBy from "lodash/groupBy";
import {
  Card,
  List,
  ListItem,
  Divider,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { deleteTransaction } from "./transactionsService";
import { withStyles } from "@material-ui/core/styles";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import "./TransactionList.scss";
import Empty from "../components/Empty";
import { formatAmount } from "../commons/utils";
import Modal from "../components/Modal";
import ConfirmDialogContent from "../components/ConfirmDialogContent";

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

const TransactionList = (props) => {
  const [menuAction, setMenuAction] = useState(null);
  const [isLoading, setIsLoading] = useState(props.isLoading);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const { data, totalIncome, totalExpense } = props;

  const handleClick = (event, item) => {
    setMenuAction(event.currentTarget);
    props.onClickTransaction(item);
    setSelectedTransaction(item);
  };

  const handleClose = () => {
    setMenuAction(null);
    setSelectedTransaction(null);
    props.onClickTransaction(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedTransaction(null);
    setIsLoading(false);
  };

  const handleEdit = () => {
    setMenuAction(null);
    props.onClickEdit();
  };

  const handleDelete = () => {
    setMenuAction(null);
    setIsDeleteModalOpen(true);
  };

  const onDeleteTransaction = async () => {
    setIsLoading(true);

    const transactionId = selectedTransaction.id;
    await deleteTransaction(transactionId);
    props.updateData();
    props.showToast("Transaction is successfully deleted!");
    closeDeleteModal();
  };

  const computeTotal = (dataByDate) => {
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

  const renderTotal = (totalIncome, totalExpense) => {
    return (
      <div className='transaction-total'>
        <div className='total income'>INCOME: {formatAmount(totalIncome)}</div>
        <div className='total expense'>
          EXPENSE: {formatAmount(totalExpense)}
        </div>
        <div className='total balance'>
          BALANCE: {formatAmount(totalIncome - totalExpense)}
        </div>
      </div>
    );
  };

  const renderTransactionsList = () => {
    if (!data) {
      return;
    }

    const dataByDate = groupBy(data, "date");

    const result = Object.entries(dataByDate).map(([key, value], index) => {
      // console.log({ key, value });
      const now = format(new Date(), "yyyy-MM-dd");
      const date = key === now ? "Today" : format(new Date(key), "dd MMM yyyy");
      const totalAmount = computeTotal(value);

      return (
        <React.Fragment key={index}>
          <div className='transaction-list'>
            <div className='card-header'>
              <div className='item-date'>{date}</div>
              <div className='item-total'>
                <div>{formatAmount(totalAmount)}</div>
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
                  <List className='list' key={item.id}>
                    <ListItem className='list-item'>
                      <div className='left-col'>
                        <div className='item'>
                          <h4 className='item-title'>{item.description}</h4>
                          <p className='item-subcategory'>
                            {item.category.name}
                          </p>
                        </div>
                        <div className='item' style={amountStyle}>
                          {formatAmount(amountItem)}
                        </div>
                      </div>

                      <div className='right-col'>
                        <MoreVertIcon
                          fontSize='small'
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
                        </StyledMenu>
                      </div>
                    </ListItem>
                  </List>
                  {index < value.length - 1 ? <Divider /> : null}
                </Card>
              );
            })}
            s{" "}
            <Modal
              openModal={isDeleteModalOpen}
              onCloseModal={closeDeleteModal}
            >
              <ConfirmDialogContent
                isLoading={isLoading}
                onDelete={onDeleteTransaction}
                onClose={closeDeleteModal}
              >
                <div>
                  <p>Description: {selectedTransaction?.description}</p>
                  <p>Amount: {selectedTransaction?.amount}</p>
                  <p>Date: {selectedTransaction?.date}</p>
                </div>
              </ConfirmDialogContent>
            </Modal>
          </div>
        </React.Fragment>
      );
    });

    return result;
  };

  return (
    <>
      {data.length > 0 ? (
        <>
          {renderTotal(totalIncome, totalExpense)}
          {renderTransactionsList()}
        </>
      ) : (
        <Empty />
      )}
    </>
  );
};

export default TransactionList;
