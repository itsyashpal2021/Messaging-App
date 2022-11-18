import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { postToNodeServer, Routes, updateUserData } from "../utils";

export function FriendRequests(props) {
  const [showRequests, setShowRequets] = useState(false);

  const username = useSelector((state) => state.user.username);
  const friendRequests = useSelector(
    (state) => state.user.friendRequestsRecieved
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const acceptFriendRequest = (friendRequestUsername) => {
    postToNodeServer(Routes.ACCEPT_FRIEND_REQUEST_ROUTE, {
      username: username,
      friendRequestUsername: friendRequestUsername,
    }).then((response) => {
      if (response.status === 200) {
        updateUserData(dispatch, navigate);
      } else {
        console.log("Error accepting friend request", response);
      }
    });
  };

  const rejectFriendRequest = (friendRequestUsername) => {
    postToNodeServer(Routes.REJECT_FRIEND_REQUEST_ROUTE, {
      username: username,
      friendRequestUsername: friendRequestUsername,
    }).then((response) => {
      if (response.status === 200) {
        updateUserData(dispatch, navigate);
      } else {
        console.log("Error rejecting friend request", response);
      }
    });
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
        <div
          className="align-self-start ms-1 mt-1"
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "100%",
            backgroundColor: "red",
            display: friendRequests.length === 0 ? "none" : "inline",
          }}
        />
      </div>
      <div
        style={{
          height: showRequests === false ? "0px" : "auto",
          overflow: "hidden",
        }}
      >
        {friendRequests.map((username) => {
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
                onClick={() => acceptFriendRequest(username)}
              >
                Accept
              </button>
              <button
                className="btn btn-danger"
                style={{ height: "fit-content" }}
                onClick={() => rejectFriendRequest(username)}
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
