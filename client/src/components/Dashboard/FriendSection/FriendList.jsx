import { useDispatch, useSelector } from "react-redux";
import "../../../Css/FriendList.css";
import { setActiveChat } from "../../../state/activeChatSlice";

export function FriendList(props) {
  const friendList = useSelector((state) => state.user.friendList);
  const dispatch = useDispatch();

  return (
    <div className="container-fluid p-0 h-100" id="friendListDiv">
      {friendList.map((friend) => {
        return (
          <div
            key={friend.username}
            className="friendDiv container-fluid py-2 px-3"
            onClick={() => dispatch(setActiveChat(friend))}
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
            <span className="fs-3 text-white">
              {friend.firstName} {friend.lastName}
            </span>
          </div>
        );
      })}
    </div>
  );
}
