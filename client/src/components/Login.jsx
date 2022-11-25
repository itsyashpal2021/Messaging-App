import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setActiveChat } from "../state/slices";
import { getFormValues, postToNodeServer, Routes } from "../utils.js";

export function LoginForm(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [labelVisible, setLabelVisible] = useState(false);
  const [sessionActive, setSessionActive] = useState(true);

  useEffect(
    () =>
      async function () {
        const response = await postToNodeServer(Routes.CHECK_SESSION_ROUTE, {});
        if (response.sessionActive) {
          navigate(Routes.USER_ROUTE);
        } else {
          setSessionActive(false);
        }
      },
    [navigate, sessionActive]
  );

  const onSubmit = async (event) => {
    event.preventDefault();
    const formValues = getFormValues(event);

    const response = await postToNodeServer(Routes.LOGIN_ROUTE, formValues);

    if (response.status === 401) {
      setLabelVisible(true);
    } else if (response.status === 200) {
      setLabelVisible(false);
      dispatch(setActiveChat({}));
      navigate(Routes.USER_ROUTE);
    }
  };

  return sessionActive ? (
    <></>
  ) : (
    <div className="container-xl">
      <form onSubmit={onSubmit}>
        <div className="container-fluid py-5">
          <div className="row justify-content-center">
            <div className="col-md-5 col-10 my-2">
              <label
                htmlFor="userNameInput"
                className="form-label fs-5 d-block"
              >
                Username
              </label>
              <input
                type="text"
                className="form-control-lg w-100"
                id="userNameInput"
                name="username"
                required
              />
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-5 col-10 my-2">
              <label
                htmlFor="passwordInput"
                className="form-label fs-5 d-block"
              >
                Password
              </label>
              <input
                type="password"
                className="form-control-lg w-100"
                id="passwordInput"
                name="password"
                required
              />
            </div>
            <div className="row justify-content-center mt-2">
              <div className="col-md-5 col-10 px-1">
                <label
                  className="col-10 fs-6"
                  style={{
                    display: labelVisible === false ? "none" : "block",
                    color: "red",
                  }}
                >
                  Invalid Login
                </label>
                <button
                  type="submit"
                  className="btn btn-primary d-block w-100 fs-5 my-2"
                >
                  Login
                </button>
                <Link to="/register" className="fs-6">
                  Register New User
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
