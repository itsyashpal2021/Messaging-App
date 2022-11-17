import { useState } from "react";

export function FriendRequests(props) {
  const [showRequests, setShowRequets] = useState(false);

  const toggleShowRequests = (event) => {
    const target = event.target;
    if (showRequests) {
      target.classList.remove("fa-caret-down");
      target.classList.add("fa-caret-right");
    } else {
      target.classList.remove("fa-caret-right");
      target.classList.add("fa-caret-down");
    }
    setShowRequets(!showRequests);
  };

  return (
    <div
      className="container-fluid p-2"
      style={{ backgroundColor: "rgb(29 44 70)" }}
    >
      <div className="d-flex align-items-center text-warning">
        <i
          className="fa-solid fa-caret-right fs-4"
          onClick={toggleShowRequests}
          style={{ cursor: "pointer" }}
        />
        <span className="h6 ms-2 m-0">Friend Requests</span>
      </div>
      <div
        style={{
          height: showRequests === false ? "0px" : "auto",
          overflow: "hidden",
        }}
      >
        {props.requests.map((username) => {
          return (
            <div
              className="d-flex align-items-center my-2 container-fluid"
              key={username}
            >
              <div
                className="profile-picture me-2"
                style={{
                  borderColor: "#87c087",
                  color: "#87c087",
                  width: "40px",
                  height: "40px",
                }}
              >
                <i className="fa-solid fa-user fs-4" />
              </div>
              <p className="fs-3 text-white m-0">{username}</p>
              <button
                className="btn btn-primary ms-auto me-2"
                style={{ height: "fit-content" }}
              >
                Accept
              </button>
              <button
                className="btn btn-danger"
                style={{ height: "fit-content" }}
              >
                Reject
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
