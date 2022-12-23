import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setActiveChat,
  setFriendData,
  setProfilePic,
} from "../../state/slices";
import { setUser } from "../../state/slices";
import { postToNodeServer, Routes } from "../../utils";
import ProfilePic from "./ProfilePic";

export function UserProfile(props) {
  let navigate = useNavigate();

  const userData = useSelector((state) => state.userData);
  const dispatch = useDispatch();

  const onLogout = async () => {
    const response = await postToNodeServer(Routes.LOGOUT_ROUTE, {});
    if (response.status === 200) {
      dispatch(setUser({}));
      dispatch(
        setFriendData({
          friendList: [],
          friendRequestsRecieved: [],
          friendRequestsSent: [],
        })
      );
      dispatch(setActiveChat({}));
      navigate(Routes.LOGIN_ROUTE);
    }
  };

  return (
    <div
      className="container-fluid d-flex justify-content-between p-2"
      style={{ backgroundColor: "#1B2430", color: "white" }}
    >
      <div className="d-flex flex-wrap justify-content-center align-items-center">
        <div
          className="me-2 position-relative"
          onMouseOver={() => {
            document.getElementById("profilePic").style.visibility = "hidden";
            document.getElementById("editProfilePicDiv").style.visibility =
              "visible";
          }}
          onMouseOut={() => {
            document.getElementById("profilePic").style.visibility = "visible";
            document.getElementById("editProfilePicDiv").style.visibility =
              "hidden";
          }}
        >
          <ProfilePic size="large" id="profilePic" src={userData.profilePic} />
          <input
            type="file"
            id="profilePicInput"
            className="visually-hidden"
            accept="image/*"
            onChange={async (event) => {
              const imgFile = event.target.files[0];
              const formData = new FormData();
              formData.append("profilePic", imgFile);

              const res = await fetch(Routes.UPLOAD_PROFILE_PIC, {
                method: "POST",
                body: formData,
              });

              if (res.status == 200) {
                const responseJson = await res.json();
                const src = responseJson.src;
                dispatch(setProfilePic(src));
              } else {
                console.error("Can not update profile picture:", res);
              }
            }}
          />
          <div
            id="editProfilePicDiv"
            className="h-100 w-100 d-flex justify-content-center align-items-center"
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              border: "1px solid grey",
              borderRadius: "50%",
              backgroundColor: "rgb(0,0,0,0.6)",
              zIndex: 2,
              visibility: "hidden",
            }}
            onClick={() => {
              document.getElementById("profilePicInput").click();
            }}
          >
            <i className="fa-solid fa-pen text-warning fs-3" />
          </div>
        </div>
        <div>
          <p className="m-0 fs-1 text-center">{userData.username}</p>
          <p className="m-0 h5 text-center">
            {userData.firstName} {userData.lastName}
          </p>
          <p className="m-0 text-primary text-center">{userData.email}</p>
        </div>
      </div>
      <i
        className="fa-solid fa-right-from-bracket fs-4 text-danger align-self-center"
        onClick={onLogout}
        style={{ cursor: "pointer" }}
      />
    </div>
  );
}
