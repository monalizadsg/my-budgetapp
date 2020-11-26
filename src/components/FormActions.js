import React from "react";
import { Button } from "@material-ui/core";
import Loading from "./Loading";

const FormActions = ({
  isEditing,
  onClose,
  isLoading,
  onShowDialog,
  onSubmit,
}) => {
  return (
    <>
      <div className='form-actions'>
        {!isEditing ? (
          <Button onClick={onClose} color='primary' disabled={isLoading}>
            Cancel
          </Button>
        ) : (
          <Button onClick={onShowDialog} color='primary' disabled={isLoading}>
            Delete
          </Button>
        )}
        <Button onClick={onSubmit} color='primary' disabled={isLoading}>
          {!isEditing ? "Add" : "Save"}
          <Loading isLoading={isLoading} size={18} />
        </Button>
      </div>
    </>
  );
};

export default FormActions;
