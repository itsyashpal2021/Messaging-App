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

  let navigate = useNavigate();
  const dispatch = useDispatch();

  //update user data every 5 seconds
  useEffect(() => {
    updateUserData(dispatch, navigate);
    const interval = setInterval(() => {
      updateUserData(dispatch, navigate);
    }, 5000);
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
      <Chat />
    </div>
  );
}
