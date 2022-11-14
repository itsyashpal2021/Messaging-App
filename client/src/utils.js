export const Routes = {
  LOGIN_ROUTE: "/login",
  REGISTER_ROUTE: "/register",
  USER_ROUTE: "/user",
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
