import "../Css/SearchUser.css";
import { useState } from "react";
import { postToNodeServer, Routes } from "../utils";

export function SearchUser(props) {
  const [searchResult, setSearchResult] = useState([]);
  const [checked, setChecked] = useState(false);

  const onSearch = (event) => {
    const searchedUser = event.target.value;
    if (searchedUser === "") {
      setSearchResult([]);
      return;
    }
    postToNodeServer(Routes.SEARCH_USER_ROUTE, {
      searchedUser: searchedUser,
      currentUser: props.username,
    })
      .then((response) => response.json())
      .then((response) => {
        setSearchResult(response.users);
      });
  };

  const addFriend = (event, username) => {
    postToNodeServer("../friendRequest", {
      username: props.username,
      friendRequestUsername: username,
    }).then((response) => {
      if (response.status === 200) {
        const btn = event.target;
        btn.classList.remove("fa-user");
        btn.classList.add("fa-check");
        btn.classList.add("text-success");
      } else {
        console.log("error while sending friend request");
        console.log(response);
      }
    });
  };

  return (
    <div className="container-fluid p-2">
      <input
        type="search"
        className="form-control-lg w-100"
        placeholder="Search an user"
        onChange={onSearch}
      />
      <input
        type="checkbox"
        id="searchInFriendListCheckbox"
        onChange={() => setChecked(!checked)}
      />
      <label
        htmlFor="searchInFriendListCheckbox"
        className="h6 text-white ms-1"
      >
        Search In Friend List.
      </label>

      <div>
        {searchResult.map((user) => {
          return (
            <div key={user.username} className="searchResult my-1 p-2">
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
              <i
                className="fa-solid fa-user-plus addFriendButton fs-5"
                onClick={(event) => addFriend(event, user.username)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
