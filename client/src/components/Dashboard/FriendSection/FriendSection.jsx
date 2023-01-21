import { SearchUser } from "../SearchUser";
import { FriendRequests } from "./FriendRequests";
import { FriendList } from "./FriendList";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  addMessage,
  addToFriendList,
  addToFriendRequestsRecieved,
  clearChat,
  newChat,
  removeFromFriendList,
  removeFromFriendRequestsSent,
} from "../../../state/slices";

export function FriendSection(props) {
  const dispatch = useDispatch();
  const socket = props.socket;

  useEffect(() => {
    if (socket) {
      //new message arrival
      socket.on("new message", (message) => {
        dispatch(
          addMessage({
            friend: message.from,
            message: message,
          })
        );
      });

      //new friend request
      socket.on("new friend request", (request) => {
        dispatch(addToFriendRequestsRecieved(request));
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
        dispatch(newChat(friend.username));
      });

      //unfriended
      socket.on("unfriended", (username) => {
        dispatch(removeFromFriendList(username));
        dispatch(clearChat(username));
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
