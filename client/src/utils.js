import { setUser } from "./state/userSlice";

export const Routes = {
  REGISTER_ROUTE: "/register",
  LOGIN_ROUTE: "/login",
  USER_ROUTE: "/user",
  LOGOUT_ROUTE: "/logout",
  SEARCH_USER_ROUTE: "/searchUser",
  FRIEND_REQUEST_ROUTE: "/friendRequest",
  ACCEPT_FRIEND_REQUEST_ROUTE: "/acceptFriendRequest",
  REJECT_FRIEND_REQUEST_ROUTE: "/rejectFriendRequest",
  GET_MESSAGES_ROUTE: "/getMessages",
  SEND_MESSAGE_ROUTE: "/sendMessage",
};

export const getFormValues = (event) => {
  //extracting values of inputs from form
  let form = event.target;
  let formData = new FormData(form);
  let formValues = Object.fromEntries(formData);
  return formValues;
};

export const postToNodeServer = (route, bodyJson) => {
  return fetch(route, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bodyJson),
  });
};

export const updateUserData = (dispatch, navigate) => {
  postToNodeServer(Routes.USER_ROUTE, {}).then((response) => {
    if (response.status === 401) {
      dispatch(setUser({}));
      navigate(Routes.LOGIN_ROUTE);
    } else if (response.status === 200) {
      response.json().then((response) => {
        dispatch(setUser(response));
        console.log("User Data Updated");
      });
    }
  });
};
