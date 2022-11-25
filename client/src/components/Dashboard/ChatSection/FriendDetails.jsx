import { useDispatch, useSelector } from "react-redux";
import { setActiveChat } from "../../../state/slices";

export function FriendDetails(props) {
  const friend = useSelector((state) => state.activeChat);
  const dispatch = useDispatch();

  return (
    <div
      className="container-fluid p-sm-3 p-2 text-white d-flex align-items-center"
      style={{ backgroundColor: "#181e22" }}
    >
      <i
        className="fa-solid fa-arrow-left fs-3 me-3"
        style={{ display: window.innerWidth <= 767 ? "inline" : "none" }}
        onClick={() => dispatch(setActiveChat({}))}
      />
      <div
        className="profile-picture me-2"
        style={{ width: "45px", height: "45px" }}
      >
        <i className="fas fa-user fs-3" />
      </div>
      <div>
        <p className="fs-2 m-0 lh-1">
          {friend.firstName} {friend.lastName}
        </p>
        <span className="fw-lighter">{friend.username}</span>
      </div>
      <i className="fa-regular fa-envelope fs-3 ms-auto" />
    </div>
  );
}
