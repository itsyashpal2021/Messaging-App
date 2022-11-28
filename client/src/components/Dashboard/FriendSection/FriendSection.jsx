import { SearchUser } from "../SearchUser";
import { FriendRequests } from "./FriendRequests";
import { FriendList } from "./FriendList";
import { useEffect } from "react";
import { Routes, postToNodeServer } from "../../../utils";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { setFriendData, setFriendList } from "../../../state/slices";

var socket;

export function FriendSection(props) {
  const dispatch = useDispatch();
  const username = useSelector((state) => state.userData.username);
  let friendList = useSelector((state) => state.friendData.friendList);

  useEffect(() => {
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

    socket = io();
    socket.emit("setup", username);
    socket.on("connected", () =>
      console.log("friend section connected to socket.io")
    );
  }, [dispatch, username]);

  useEffect(() => {
    if (socket && friendList.length !== 0) {
      //update last message in friend list when a new message comes
      socket.once("new message", (message) => {
        const friendUserName = message.from;

        //create a deep copy including nested objects
        const newFriendList = JSON.parse(JSON.stringify(friendList));

        const objIndex = newFriendList.findIndex(
          (friend) => friend.username === friendUserName
        );

        if (objIndex === -1) {
          console.error("Friend not found in friend List");
          return;
        }

        newFriendList[objIndex].lastMessage = message.message;
        newFriendList[objIndex].lastMessageTime = message.time;

        newFriendList.sort(function (a, b) {
          if (a.lastMessageTime < b.lastMessageTime) return 1;
          else if (a.lastMessageTime > b.lastMessageTime) return -1;
          return 0;
        });

        dispatch(setFriendList(newFriendList));
      });
    }
  }, [friendList, dispatch]);

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
