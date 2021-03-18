import React from "react";
import { Dialog, DialogTitle, DialogContent } from "@material-ui/core";
import FormActions from "./FormActions";

const Modal = ({ openModal, onCloseModal, title, children, actions }) => {
  return (
    <Dialog open={openModal} onClose={onCloseModal} fullWidth>
      <DialogTitle>{title && title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      {actions && <FormActions />}
    </Dialog>
  );
};

export default Modal;
