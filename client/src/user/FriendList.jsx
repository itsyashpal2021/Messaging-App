import { useState } from "react";
import { postToNodeServer, Routes } from "../utils";
import "../Css/SearchUser.css";
import { SearchResults } from "./SearchUser";

export function FriendList(props) {
  const [searchResult, setSearchResult] = useState([]);
  const onSearch = (event) => {
    const searchedUser = event.target.value;
    if (searchedUser === "") {
      setSearchResult([]);
      return;
    }
    postToNodeServer(Routes.SEARCH_USER_ROUTE, { username: searchedUser })
      .then((response) => response.json())
      .then((response) => {
        setSearchResult(response.users);
      });
  };

  const addFriend = (event, username) => {
    const btn = event.target;
    btn.classList.remove("fa-user");
    btn.classList.add("fa-check");
    btn.style.color = "green";
  };

  return (
    <div
      className="container-fluid h-100 p-2"
      style={{ backgroundColor: "#51557E" }}
    >
      <div>
        <input
          type="search"
          className="form-control-lg w-100"
          placeholder="Search an user"
          onChange={onSearch}
        />
      </div>
      <SearchResults searchResult={searchResult} addFriend={addFriend} />
    </div>
  );
}
