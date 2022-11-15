import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { postToNodeServer, Routes } from "../utils";
import { Loading } from "./Loading";
import { UserProfile } from "./UserProfile";
import { FriendList } from "./FriendList";

export function UserDashboard(props) {
  let navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (loaded === true) return;
    postToNodeServer(Routes.USER_ROUTE, {}).then((response) => {
      if (response.status === 401) {
        setLoaded(false);
        navigate(Routes.LOGIN_ROUTE);
      } else if (response.status === 200) {
        setLoaded(true);
        response.json().then((response) => {
          setUserData(response);
        });
      }
    });
  });
  return loaded === false ? (
    <Loading />
  ) : (
    <div className="container-fluid row m-0 p-0" style={{ minHeight: "100vh" }}>
      <div className="col-12 col-md-4 col-lg-5 col-xxl-4 d-flex flex-column p-0">
        <UserProfile userData={userData} />
        <FriendList />
      </div>
      <div
        className="col-12 col-md-8 col-lg-7 col-xxl-8 p-0"
        style={{ backgroundColor: "#dbdbc0" }}
      >
        <h1>Chat</h1>
      </div>
    </div>
  );
}
