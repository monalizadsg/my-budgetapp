import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";

const FormDialog = ({ isOpen, onClose, title, children }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth='xs'
      disableBackdropClick
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};

export default FormDialog;
