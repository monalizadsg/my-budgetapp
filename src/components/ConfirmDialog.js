import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
} from "@material-ui/core";

const ConfirmDialog = ({ isOpen, onClose, onDelete, children, isLoading }) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle id='alert-dialog-title'>
        Are you sure you want to delete this transaction?
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{children}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary' disabled={isLoading}>
          No
        </Button>
        <Button onClick={onDelete} color='primary' disabled={isLoading}>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
