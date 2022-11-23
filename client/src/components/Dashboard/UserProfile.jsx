import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../../Css/UserProfile.css";
import { setActiveChat } from "../../state/activeChatSlice";
import { setUser } from "../../state/userSlice";
import { postToNodeServer, Routes } from "../../utils";

export function UserProfile(props) {
  let navigate = useNavigate();
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const onLogout = async () => {
    const response = await postToNodeServer(Routes.LOGOUT_ROUTE, {});
    if (response.status === 200) {
      dispatch(setUser({}));
      dispatch(setActiveChat({}));
      navigate(Routes.LOGIN_ROUTE);
    }
  };

  return (
    <div
      className="container-fluid d-flex  flex-lg-row flex-column justify-content-between p-2"
      style={{ backgroundColor: "#1B2430", color: "white" }}
    >
      <div className="d-flex flex-wrap justify-content-center align-items-center">
        <div className="profile-picture me-2">
          <i className="fa-solid fa-user" />
        </div>
        <div>
          <p className="m-0 fs-1 text-center">{userData.username}</p>
          <p className="m-0 h5 text-center">
            {userData.firstName} {userData.lastName}
          </p>
          <p className="m-0 text-primary text-center">{userData.email}</p>
        </div>
      </div>
      <button
        className="btn btn-secondary align-self-center mt-2 mt-lg-0"
        onClick={onLogout}
      >
        Log Out
      </button>
    </div>
  );
}
UserProfile.propTypes = {
  userData: PropTypes.object,
};
