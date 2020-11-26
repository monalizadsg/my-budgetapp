import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

const Loading = (props) => {
  return (
    <div
      style={{
        zIndex: "99",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      {props.isLoading && (
        <CircularProgress color='primary' size={props.size} />
      )}
    </div>
  );
};

export default Loading;
