import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { postToNodeServer, Routes } from "../utils";
export function UserDashboard(props) {
  let navigate = useNavigate();

  useEffect(() => {
    postToNodeServer(Routes.USER_ROUTE, {}).then((response) => {
      if (response.status === 401) navigate(Routes.LOGIN_ROUTE);
    });
  });
  return <h1>Hello there</h1>;
}
