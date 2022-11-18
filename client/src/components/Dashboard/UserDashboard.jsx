import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUserData } from "../../utils";
import { Loading } from "../Loading";
import { UserProfile } from "./UserProfile";
import { FriendSection } from "./FriendSection/FriendSection";
import { Chat } from "./ChatSection/Chat";
import { useEffect } from "react";

export function UserDashboard(props) {
  const userData = useSelector((state) => state.user);
  const activeChat = useSelector((state) => state.activeChat.username);

  let navigate = useNavigate();
  const dispatch = useDispatch();

  //update user data every 10 seconds
  useEffect(() => {
    updateUserData(dispatch, navigate);
    const interval = setInterval(() => {
      updateUserData(dispatch, navigate);
    }, 10000);
    return () => clearInterval(interval);
  }, [dispatch, navigate]);

  return userData.username === undefined ? (
    <Loading />
  ) : (
    <div className="container-fluid row m-0 p-0 h-100">
      <div className="col-12 col-md-5 col-xxl-4 d-flex flex-column p-0">
        <UserProfile />
        <FriendSection />
      </div>
      <div
        className="col-12 col-md-7  col-xxl-8 p-0"
        style={{
          display:
            window.innerWidth <= 767 && activeChat === undefined
              ? "none"
              : "block",
          position: window.innerWidth <= 767 ? "fixed" : "static",
          top: "0",
          bottom: "0",
        }}
      >
        <Chat />
      </div>
    </div>
  );
}
