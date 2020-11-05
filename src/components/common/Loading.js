import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

const Loading = (props) => {
  return (
    <div
      style={{
        zIndex: "1",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      {props.isLoading && <CircularProgress color='primary' />}
    </div>
  );
};

export default Loading;
