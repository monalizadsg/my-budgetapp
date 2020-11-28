import React from "react";
import { Typography } from "@material-ui/core";
import empty from "../images/empty.svg";

const Empty = () => {
  return (
    <div className='empty-card'>
      <Typography variant='h5' style={{ marginBottom: "10px" }}>
        No record found
      </Typography>
      <img src={empty} width='500px' alt='empty data' className='image' />
    </div>
  );
};

export default Empty;
