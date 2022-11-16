import "../Css/SearchUser.css";
export function SearchResults(props) {
  return (
    <div>
      {props.searchResult.map((user) => {
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
              onClick={(event) => props.addFriend(event, user.username)}
            />
          </div>
        );
      })}
    </div>
  );
}
