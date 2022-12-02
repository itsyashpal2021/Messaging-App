import { SearchUser } from "../SearchUser";
import { FriendRequests } from "./FriendRequests";
import { FriendList } from "./FriendList";
import { useEffect } from "react";
import { Routes, postToNodeServer } from "../../../utils";
import { useDispatch, useSelector } from "react-redux";
import { setFriendData, updateLastMessage } from "../../../state/slices";

export function FriendSection(props) {
  const dispatch = useDispatch();
  const username = useSelector((state) => state.userData.username);
  const socket = props.socket;

  useEffect(() => {
    console.log("Friend section useeffect.");
    const getFriendData = async () => {
      try {
        const response = await postToNodeServer(Routes.FRIEND_DATA_ROUTE, {});
        dispatch(setFriendData(response));
        console.log("Friend Data updated");
      } catch (error) {
        console.error("Error while fetching friendData", error.message);
      }
    };
    getFriendData();
  }, [dispatch, username, socket]);

  useEffect(() => {
    //update last message in friendlist.
    if (socket) {
      socket.on("new message", (message) => {
        dispatch(
          updateLastMessage({
            username: message.from,
            lastMessage: message.message,
            lastMessageTime: message.time,
          })
        );
      });
    }
  }, [dispatch, socket]);

  return (
    <div
      className="container-fluid h-100 p-0 d-flex flex-column"
      style={{ backgroundColor: "#51557E", overflowY: "scroll" }}
    >
      <FriendRequests />
      <SearchUser />
      <FriendList />
    </div>
  );
}
