import "../../Css/SearchUser.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postToNodeServer, Routes } from "../../utils";
import { addToFriendRequestsSent, setActiveChat } from "../../state/slices";
import ProfilePic from "./ProfilePic";
import WaitingAnimation from "../WaitingAnimation";

let controller = new AbortController();

export function SearchUser(props) {
  const [searchResult, setSearchResult] = useState([]);
  const dispatch = useDispatch();

  const username = useSelector((state) => state.userData.username);
  const profilePic = useSelector((state) => state.userData.profilePic);
  const friendUsernameList = new Set(
    useSelector((state) => state.friendData.friendList).map((friend) => {
      return friend.username;
    })
  );
  const friendRequestSent = new Set(
    useSelector((state) => state.friendData.friendRequestsSent)
  );
  const friendRequestRecieved = new Set(
    useSelector((state) => state.friendData.friendRequestsRecieved)
  );

  const socket = props.socket;

  const onSearch = async (event) => {
    try {
      const searchedUser = event.target.value;
      document.getElementById("noResultDiv").style.display = "none";

      controller.abort();
      controller = new AbortController();

      if (searchedUser === "") {
        setSearchResult([]);
        document.getElementById("searchingAnimationDiv").style.display = "none";

        return;
      }
      document.getElementById("searchingAnimationDiv").style.display = "flex";

      let response = await fetch(Routes.SEARCH_USER_ROUTE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          searchedUser: searchedUser,
          currentUser: username,
        }),
        signal: controller.signal,
      });

      if (response.status === 200) {
        response = await response.json();

        if (response.users.length === 0) {
          document.getElementById("noResultDiv").style.display = "block";
        }

        setSearchResult([...response.users]);
        document.getElementById("searchingAnimationDiv").style.display = "none";
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error while searching the user.", error);
      }
    }
  };

  const addFriend = async (event, friendRequestUsername) => {
    event.target.querySelector(".waitingAnimationDiv").style.display = "block";

    const response = await postToNodeServer(Routes.FRIEND_REQUEST_ROUTE, {
      username: username,
      friendRequestUsername: friendRequestUsername,
    });

    event.target.querySelector(".waitingAnimationDiv").style.display = "none";
    if (response.status === 200) {
      const btn = event.target;
      btn.classList.remove("fa-user");
      btn.classList.add("fa-check");
      btn.classList.add("text-success");
      dispatch(addToFriendRequestsSent(friendRequestUsername));
      if (socket) {
        socket.emit("add friend", {
          username: username,
          friendRequestUsername: friendRequestUsername,
          profilePic: profilePic,
        });
      }
    }
  };

  return (
    <div className="container-fluid p-2">
      <input
        type="search"
        className="form-control-lg w-100"
        placeholder="Search an user"
        onChange={onSearch}
        style={{ border: "none", fontWeight: "600" }}
        onFocus={(event) => {
          event.target.style.outline = "none";
        }}
      />
      <div
        id="searchingAnimationDiv"
        className="p-2"
        style={{
          display: "none",
        }}
      >
        <i className="fa-solid fa-users fs-1 " />
        <div id="spinner">
          <i className="fa-solid fa-magnifying-glass fw-bold fs-3" />
        </div>
        <span className="fw-bolder fs-6 user-select-none">
          Searching Users...
        </span>
      </div>
      <div>
        {searchResult.map((user) => {
          return (
            <div
              key={user.username}
              className="searchResult my-1 p-2"
              onClick={() => {
                if (friendUsernameList.has(user.username)) {
                  dispatch(setActiveChat(user));
                }
              }}
            >
              <ProfilePic
                size="60px"
                className="me-2 fs-3"
                style={{
                  flexGrow: 0,
                  flexShrink: 0,
                  border: user.profilePic ? "none" : "2px solid black",
                }}
                src={user.profilePic}
              />
              <div>
                <p className="fs-3 m-0">{user.username}</p>
                <p className="h6 m-0">
                  {user.firstName} {user.lastName}
                </p>
              </div>
              {friendRequestSent.has(user.username) ||
              friendRequestRecieved.has(user.username) ? (
                <i className="fa-solid fa-check text-success ms-auto fs-5 p-1" />
              ) : friendUsernameList.has(user.username) === true ? (
                <i
                  className="fa-solid fa-user-check ms-auto fs-5 p-1"
                  style={{ color: "#003080" }}
                />
              ) : (
                <i
                  className="fa-solid fa-user-plus ms-auto fs-5 p-1 position-relative"
                  style={{ cursor: "pointer" }}
                  onClick={(event) => {
                    addFriend(event, user.username);
                  }}
                >
                  <WaitingAnimation
                  />
                </i>
              )}
            </div>
          );
        })}
      </div>
      <div
        className="text-center pt-1"
        id="noResultDiv"
        style={{ display: "none" }}
      >
        <span className="text-white-50 h6">No Result Found!</span>
      </div>
    </div>
  );
}
