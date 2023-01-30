import React from "react";
export default function ProfilePic(props) {
  return (
    <div
      className={`d-flex justify-content-center align-items-center rounded-circle ${props.className}`}
      style={{
        width: props.size,
        height: props.size,
        border: "2px solid",
        position: "relative",
        ...props.style,
      }}
      id={props.id}
      onClick={props.onClick}
    >
      {props.src ? (
        <img
          src={props.src}
          draggable={false}
          alt="Loading..."
          className="h-100 w-100 rounded-circle"
          style={{ objectFit: "cover" }}
        />
      ) : (
        <i className={`fa-solid fa-user`} />
      )}
      <div
        className="position-absolute"
        style={{
          display: props.isOnline ? "block" : "none",
          width: "15px",
          height: "15px",
          bottom: 0,
          right: 0,
          borderRadius: "50%",
          backgroundColor: "#10d010",
        }}
      ></div>
    </div>
  );
}
