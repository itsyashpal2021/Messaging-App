import { SearchUser } from "../SearchUser";
import { FriendRequests } from "./FriendRequests";
import { FriendList } from "./FriendList";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  addToFriendList,
  addToFriendRequestsRecieved,
  removeFromFriendRequestsSent,
  updateLastMessage,
} from "../../../state/slices";

export function FriendSection(props) {
  const dispatch = useDispatch();
  const socket = props.socket;

  useEffect(() => {
    if (socket) {
      //update last message in friendlist.
      socket.on("new message", (message) => {
        dispatch(
          updateLastMessage({
            username: message.from,
            lastMessage: message.message,
            lastMessageTime: message.time,
          })
        );
      });

      //new friend request
      socket.on("new friend request", (username) => {
        dispatch(addToFriendRequestsRecieved(username));
      });

      //friend request rejected
      socket.on("friend request rejected", (username) => {
        dispatch(removeFromFriendRequestsSent(username));
      });

      //friend request accepted
      socket.on("friend request accepted", (friend) => {
        dispatch(removeFromFriendRequestsSent(friend.username));
        dispatch(
          addToFriendList({ ...friend, lastMessage: "", lastMessageTime: 0 })
        );
      });
    }
  }, [dispatch, socket]);

  return (
    <div
      className="container-fluid h-100 p-0 d-flex flex-column"
      style={{ backgroundColor: "#51557E", overflowY: "hidden" }}
    >
      <FriendRequests {...props} />
      <SearchUser {...props} />
      <FriendList />
    </div>
  );
}
