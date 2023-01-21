import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getFriendData, getMessages, getUserData } from "../../utils";
import { Loading } from "../Loading";
import { UserProfile } from "./UserProfile";
import { FriendSection } from "./FriendSection/FriendSection";
import { Chat } from "./ChatSection/Chat";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { useState } from "react";

export function UserDashboard(props) {
  const username = useSelector((state) => state.userData.username);
  const friendData = useSelector((state) => state.friendData);
  const chatData = useSelector((state) => state.chatData);

  const [socket, setSocket] = useState();

  let navigate = useNavigate();
  const dispatch = useDispatch();

  if (username) document.title = `${username} | Talkato`;

  useEffect(() => {
    const load = async () => {
      await getUserData(dispatch, navigate);
      await getFriendData(dispatch);
      await getMessages(dispatch);
      setSocket(io());
    };
    load();
  }, [dispatch, navigate]);

  useEffect(() => {
    if (socket && username) {
      socket.emit("setup", username);
      socket.on("connected", () => {
        console.log("user section connected to socket.io");
      });
    }
  }, [socket, username]);

  return !(username && friendData.friendList && chatData.messages) ? (
    <Loading
      userFetched={username !== undefined}
      friendDataFetched={friendData.friendList !== undefined}
    />
  ) : (
    <div className="container-fluid row m-0 p-0 h-100">
      <div className="col-12 col-md-5 col-xxl-4 p-0 h-100">
        <div className="d-flex flex-column h-100 container-fluid p-0">
          <UserProfile socket={socket} />
          <FriendSection socket={socket} />
        </div>
      </div>
      <Chat socket={socket} />
    </div>
  );
}
