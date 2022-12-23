import React from "react";
export default function ProfilePic(props) {
  let size, fontClass;
  switch (props.size) {
    case "large":
      size = "65px";
      fontClass = "fs-1";
      break;

    case "small":
      size = "50px";
      fontClass = "fs-3";
      break;
    default:
      console.error("unexpected value of size.");
      break;
  }

  const color = props.color ? props.color : "white";
  const borderColor = props.borderColor ? props.borderColor : "white";
  const otherClasses = props.className ? props.className : "";
  const styles = { ...props.style };
  return (
    <div
      className={`d-flex justify-content-center align-items-center ${otherClasses}`}
      style={{
        width: size,
        height: size,
        border: "2px solid",
        borderRadius: "50%",
        borderColor: borderColor,
        color: color,
        ...styles,
      }}
      id={props.id ? props.id : null}
    >
      {props.src ? (
        <img
          src={props.src}
          alt="Loading..."
          className="h-100 w-100 rounded-circle"
        />
      ) : (
        <i className={`fa-solid fa-user ${fontClass}`} />
      )}
    </div>
  );
}
