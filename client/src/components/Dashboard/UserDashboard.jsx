import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../../utils";
import { Loading } from "../Loading";
import { UserProfile } from "./UserProfile";
import { FriendSection } from "./FriendSection/FriendSection";
import { Chat } from "./ChatSection/Chat";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { useState } from "react";
export function UserDashboard(props) {
  const username = useSelector((state) => state.userData.username);
  const [socket, setSocket] = useState();

  let navigate = useNavigate();
  const dispatch = useDispatch();

  //update user data
  useEffect(() => {
    console.log("Userdashboard useeffect.");
    if (username === undefined) {
      getUserData(dispatch, navigate);
    } else {
      setSocket(io());
    }
  }, [dispatch, navigate, username]);

  useEffect(() => {
    if (socket) {
      socket.emit("setup", username);
      socket.on("connected", () => {
        console.log("user section connected to socket.io");
        console.log(socket);
      });
    }
  }, [socket, username]);

  return username === undefined ? (
    <Loading />
  ) : (
    <div className="container-fluid row m-0 p-0 h-100">
      <div className="col-12 col-md-5 col-xxl-4 p-0 h-100">
        <div className="d-flex flex-column h-100 container-fluid p-0">
          <UserProfile />
          <FriendSection socket={socket} />
        </div>
      </div>
      <Chat socket={socket} />
    </div>
  );
}
