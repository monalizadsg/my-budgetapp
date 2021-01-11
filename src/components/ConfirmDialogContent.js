import React from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";

const ConfirmDialogContent = ({ onClose, onDelete, children, isLoading }) => {
  return (
    <div>
      <DialogTitle id='alert-dialog-title'>
        Are you sure you want to delete this transaction?
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary' disabled={isLoading}>
          No
        </Button>
        <Button onClick={onDelete} color='primary' disabled={isLoading}>
          Yes
        </Button>
      </DialogActions>
    </div>
  );
};

export default ConfirmDialogContent;
