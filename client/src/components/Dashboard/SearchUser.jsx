import "../../Css/SearchUser.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postToNodeServer, Routes } from "../../utils";
import { setActiveChat } from "../../state/activeChatSlice";

export function SearchUser(props) {
  const [searchResult, setSearchResult] = useState([]);
  const dispatch = useDispatch();

  const username = useSelector((state) => state.user.username);
  const friendUsernameList = new Set(
    useSelector((state) => state.user.friendList).map((friend) => {
      return friend.username;
    })
  );
  const friendRequestSent = new Set(
    useSelector((state) => state.user.friendRequestsSent)
  );

  const onSearch = async (event) => {
    const searchedUser = event.target.value;
    if (searchedUser === "") {
      setSearchResult([]);
      return;
    }
    const response = await postToNodeServer(Routes.SEARCH_USER_ROUTE, {
      searchedUser: searchedUser,
      currentUser: username,
    });
    if (response.status === 200) setSearchResult(response.users);
  };

  const addFriend = async (event, friendRequestUsername) => {
    const response = await postToNodeServer(Routes.FRIEND_REQUEST_ROUTE, {
      username: username,
      friendRequestUsername: friendRequestUsername,
    });
    if (response.status === 200) {
      const btn = event.target;
      btn.classList.remove("fa-user");
      btn.classList.add("fa-check");
      btn.classList.add("text-success");
    }
  };

  return (
    <div className="container-fluid p-2">
      <input
        type="search"
        className="form-control-lg w-100"
        placeholder="Search an user"
        onChange={onSearch}
      />

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
              <div
                className="profile-picture me-2 fs-3"
                style={{
                  width: "50px",
                  height: "50px",
                  borderColor: "black",
                }}
              >
                <i className="fa-solid fa-user" />
              </div>
              <div>
                <p className="fs-3 m-0">{user.username}</p>
                <p className="h6 m-0">
                  {user.firstName} {user.lastName}
                </p>
              </div>
              {friendRequestSent.has(user.username) === true ? (
                <i className="fa-solid fa-check text-success ms-auto fs-5" />
              ) : friendUsernameList.has(user.username) === true ? (
                <i
                  className="fa-solid fa-user-check ms-auto fs-5"
                  style={{ color: "#003080" }}
                />
              ) : (
                <i
                  className="fa-solid fa-user-plus ms-auto fs-5"
                  style={{ cursor: "pointer" }}
                  onClick={(event) => addFriend(event, user.username)}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
