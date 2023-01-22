import { setUser, setFriendData, setMessages } from "./state/slices";

export const Routes = {
  REGISTER_ROUTE: "/register",
  CHECK_SESSION_ROUTE: "/checkSession",
  LOGIN_ROUTE: "/login",
  FORGOT_PASSWORD_ROUTE: "/forgotPassword",
  USER_ROUTE: "/user",
  FRIEND_DATA_ROUTE: "/friendData",
  LOGOUT_ROUTE: "/logout",
  SEARCH_USER_ROUTE: "/searchUser",
  FRIEND_REQUEST_ROUTE: "/friendRequest",
  ACCEPT_FRIEND_REQUEST_ROUTE: "/acceptFriendRequest",
  REJECT_FRIEND_REQUEST_ROUTE: "/rejectFriendRequest",
  GET_MESSAGES_ROUTE: "/getMessages",
  SEND_MESSAGE_ROUTE: "/sendMessage",
  UPLOAD_PROFILE_PIC: "/uploadProfilePic",
  REMOVE_PROFILE_PIC: "/removeProfilePic",
  UNFRIEND: "/unfriend",
  SEND_OTP_ROUTE: "/sendOtp",
  CHANGE_PASSWORD_ROUTE: "/changePassword",
};

export const getFormValues = (event) => {
  //extracting values of all inputs from form
  let form = event.target;
  let formData = new FormData(form);
  let formValues = Object.fromEntries(formData);
  return formValues;
};

export const postToNodeServer = async (
  route,
  bodyJson,
  errorhandled = false
) => {
  try {
    let response = await fetch(route, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyJson),
    });
    const status = response.status;
    if (status === 401) {
      return { status: 401 };
    }
    response = await response.json();
    if (status === 400 && errorhandled === false) throw response.message;
    return { ...response, status: status };
  } catch (error) {
    console.error("Error sending post to nodeserver", error);
  }
};

export const getUserData = async (dispatch, navigate) => {
  try {
    const response = await postToNodeServer(Routes.USER_ROUTE, {});
    if (response.status === 401) {
      dispatch(setUser({}));
      navigate(Routes.LOGIN_ROUTE);
    } else if (response.status === 200) {
      dispatch(setUser(response));
      console.log("User Data Updated");
    } else {
      console.log("Recieved invalid response", response);
    }
  } catch (error) {
    console.error("Error while fetching userData.", error.message);
  }
};

export const getFriendData = async (dispatch) => {
  try {
    const response = await postToNodeServer(Routes.FRIEND_DATA_ROUTE, {});
    dispatch(setFriendData(response));
    console.log("Friend Data updated");
  } catch (error) {
    console.error("Error while fetching friendData.", error.message);
  }
};

export const getMessages = async (dispatch) => {
  try {
    const response = await postToNodeServer(Routes.GET_MESSAGES_ROUTE, {});
    dispatch(setMessages(response.messages));
    console.log("Messages fetched.");
  } catch (error) {
    console.error("Error while fetching Messages.", error.message);
  }
};
