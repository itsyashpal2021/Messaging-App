import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../../utils";
import { Loading } from "../Loading";
import { UserProfile } from "./UserProfile";
import { FriendSection } from "./FriendSection/FriendSection";
import { Chat } from "./ChatSection/Chat";
import { useEffect } from "react";

export function UserDashboard(props) {
  const username = useSelector((state) => state.userData.username);

  let navigate = useNavigate();
  const dispatch = useDispatch();

  //update user data
  useEffect(() => {
    getUserData(dispatch, navigate);
  }, [dispatch, navigate]);

  return username === undefined ? (
    <Loading />
  ) : (
    <div className="container-fluid row m-0 p-0 h-100">
      <div className="col-12 col-md-5 col-xxl-4 p-0 h-100">
        <div className="d-flex flex-column h-100 container-fluid p-0">
          <UserProfile />
          <FriendSection />
        </div>
      </div>
      <Chat />
    </div>
  );
}
