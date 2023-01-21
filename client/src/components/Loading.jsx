import React from "react";
import "../Css/Loading.css";

export function Loading(props) {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <span className="text-white text-bold mt-1">
        {props.userFetched
          ? props.friendDataFetched
            ? "Loading Messages"
            : "Loading Friends"
          : "Loading User"}
      </span>
    </div>
  );
}
