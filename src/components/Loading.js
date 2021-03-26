import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

const Loading = (props) => {
  return (
    <div
      style={{
        zIndex: "1000",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {props.isLoading && (
        <CircularProgress
          color={props.color ? props.color : "primary"}
          size={props.size}
        />
      )}
    </div>
  );
};

export default Loading;
