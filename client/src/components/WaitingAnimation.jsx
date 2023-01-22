import React from "react";
import "../Css/WaitingAnimation.css";

export default function WaitingAnimation(props) {
  return (
    <div
      className="waitingAnimationDiv rounded"
      style={{
        display: "none",
        
        ...props.style,
      }}
    >
      <div className="mainCircle">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
      </div>
    </div>
  );
}
