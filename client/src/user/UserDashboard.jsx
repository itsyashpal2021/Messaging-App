import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUserData } from "../utils";
import { Loading } from "./Loading";
import { UserProfile } from "./UserProfile";
import { FriendSection } from "./FriendSection";
import { useEffect } from "react";

export function UserDashboard(props) {
  const userData = useSelector((state) => state.user);
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
    <div className="container-fluid row m-0 p-0" style={{ minHeight: "100vh" }}>
      <div className="col-12 col-md-4 col-lg-5 col-xxl-4 d-flex flex-column p-0">
        <UserProfile />
        <FriendSection />
      </div>
      <div
        className="col-12 col-md-8 col-lg-7 col-xxl-8 p-0"
        style={{ backgroundColor: "white" }}
      >
        <h1>Chat</h1>
      </div>
    </div>
  );
}
