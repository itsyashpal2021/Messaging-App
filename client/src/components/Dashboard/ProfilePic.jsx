import React from "react";
export default function ProfilePic(props) {
  return (
    <div
      className={`d-flex justify-content-center align-items-center rounded-circle ${props.className}`}
      style={{
        width: props.size,
        height: props.size,
        border: "2px solid",
        ...props.style,
      }}
      id={props.id}
      onClick={props.onClick}
    >
      {props.src ? (
        <img
          src={props.src}
          alt="Loading..."
          className="h-100 w-100 rounded-circle"
          style={{ objectFit: "cover" }}
        />
      ) : (
        <i className={`fa-solid fa-user`} />
      )}
    </div>
  );
}
