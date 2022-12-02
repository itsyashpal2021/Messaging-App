import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToFriendList,
  removeFromFriendRequestsRecieved,
} from "../../../state/slices";
import { postToNodeServer, Routes } from "../../../utils";

export function FriendRequests(props) {
  const [showRequests, setShowRequets] = useState(false);
  const dispatch = useDispatch();

  const socket = props.socket;

  const userData = useSelector((state) => state.userData);

  const username = userData.username;
  const friendRequests = useSelector(
    (state) => state.friendData.friendRequestsRecieved
  );

  const toggleShowRequests = (event) => {
    const target = document.getElementById("friendRequestLabel");
    if (showRequests) {
      target.classList.remove("fa-caret-down");
      target.classList.add("fa-caret-right");
    } else {
      target.classList.remove("fa-caret-right");
      target.classList.add("fa-caret-down");
    }
    setShowRequets(!showRequests);
  };

  const acceptFriendRequest = async (friendRequestUsername) => {
    const response = await postToNodeServer(
      Routes.ACCEPT_FRIEND_REQUEST_ROUTE,
      {
        username: username,
        friendRequestUsername: friendRequestUsername,
      }
    );
    if (response.status === 200) {
      const friend = {
        username: friendRequestUsername,
        firstName: response.firstName,
        lastName: response.lastName,
        lastMessage: "",
        lastMessageTime: 0,
      };
      dispatch(removeFromFriendRequestsRecieved(friendRequestUsername));
      dispatch(addToFriendList(friend));
      socket.emit("friend request accepted", {
        username: username,
        friendRequestUsername: friendRequestUsername,
        firstName: userData.firstName,
        lastName: userData.lastName,
      });
    }
  };

  const rejectFriendRequest = async (friendRequestUsername) => {
    const response = await postToNodeServer(
      Routes.REJECT_FRIEND_REQUEST_ROUTE,
      {
        username: username,
        friendRequestUsername: friendRequestUsername,
      }
    );
    if (response.status === 200 && socket) {
      dispatch(removeFromFriendRequestsRecieved(friendRequestUsername));
      socket.emit("friend request rejected", {
        username: username,
        friendRequestUsername: friendRequestUsername,
      });
    }
  };

  return (
    <div
      className="container-fluid p-2"
      style={{ backgroundColor: "rgb(29 44 70)" }}
    >
      <div
        className="d-flex align-items-center text-warning"
        onClick={toggleShowRequests}
        style={{ cursor: "pointer", width: "fit-content", userSelect: "none" }}
      >
        <i className="fa-solid fa-caret-right fs-4" id="friendRequestLabel" />
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
