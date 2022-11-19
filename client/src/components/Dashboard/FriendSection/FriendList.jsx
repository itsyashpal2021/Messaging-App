import { useDispatch, useSelector } from "react-redux";
import { setActiveChat } from "../../../state/activeChatSlice";

export function FriendList(props) {
  const friendList = useSelector((state) => state.user.friendList);
  const activeChat = useSelector((state) => state.activeChat);
  const dispatch = useDispatch();

  return (
    <div
      className="container-fluid p-0 h-100"
      style={{ overflowY: "scroll", backgroundColor: "rgb(66 69 98)" }}
    >
      {friendList.map((friend) => {
        return (
          <div
            key={friend.username}
            className="friendDiv container-fluid py-2 px-3"
            style={{
              display: "flex",
              userSelect: "none",
              backgroundColor:
                activeChat.username !== undefined &&
                activeChat.username === friend.username
                  ? "rgb(47 50 75)"
                  : "inherit",
            }}
            onMouseEnter={(event) => {
              if (
                activeChat.username === undefined ||
                activeChat.username !== friend.username
              )
                event.target.style.backgroundColor = "rgb(57 60 85)";
            }}
            onMouseLeave={(event) => {
              event.target.style.backgroundColor =
                activeChat.username !== undefined &&
                activeChat.username === friend.username
                  ? "rgb(47 50 75)"
                  : "inherit";
            }}
            onClick={() => {
              dispatch(setActiveChat(friend));
            }}
          >
            <div
              className="profile-picture me-2 fs-3"
              style={{
                width: "50px",
                height: "50px",
                borderColor: "aqua",
                color: "aqua",
              }}
            >
              <i className="fa-solid fa-user" />
            </div>
            <span className="fs-3 text-white bg-transparent">
              {friend.firstName} {friend.lastName}
            </span>
          </div>
        );
      })}
    </div>
  );
}
