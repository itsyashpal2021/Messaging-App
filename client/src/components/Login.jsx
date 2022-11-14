import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getFormValues, postToNodeServer, Routes } from "../utils.js";

export function LoginForm(props) {
  let navigate = useNavigate();
  const [labelVisible, setLabelVisible] = useState(false);

  const onSubmit = (event) => {
    //prevent refresh
    event.preventDefault();
    const formValues = getFormValues(event);

    postToNodeServer(Routes.LOGIN_ROUTE, formValues).then((response) => {
      switch (response.status) {
        case 401:
          setLabelVisible(true);
          break;
        case 200:
          setLabelVisible(false);
          navigate(Routes.USER_ROUTE);
          break;
        default:
          console.log("Recieved Response:", response);
          break;
      }
    });
  };

  return (
    <div className="container-xl">
      <form onSubmit={onSubmit}>
        <div className="container-fluid py-5">
          <div className="row justify-content-center">
            <div className="col-md-5 col-10 my-2">
              <label htmlFor="emailInput" className="form-label fs-5 d-block">
                Email Id
              </label>
              <input
                type="email"
                className="form-control-lg w-100"
                id="emailInput"
                name="email"
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
