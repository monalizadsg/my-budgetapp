import React from "react";
import { Button } from "@material-ui/core";

const FormActions = ({ isEditing, onClose, isLoading, onSubmit }) => {
  return (
    <>
      <div className='form-actions'>
        <Button onClick={onClose} color='primary' disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={onSubmit} color='primary' disabled={isLoading}>
          {!isLoading
            ? !isEditing
              ? "Add"
              : "Save"
            : !isEditing
            ? "Adding"
            : "Saving"}
        </Button>
      </div>
    </>
  );
};

export default FormActions;
