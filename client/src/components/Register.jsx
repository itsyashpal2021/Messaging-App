import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFormValues, postToNodeServer, Routes } from "../utils";

export function RegisterForm(props) {
  let navigate = useNavigate();
  const [labelVisible, setLabelVisible] = useState(false);
  const [labelText, setLabelText] = useState("");

  const onSubmit = (event) => {
    //prevent refresh
    event.preventDefault();
    const formValues = getFormValues(event);

    //if passwords do not match
    if (formValues.password !== formValues.confirmPassword) {
      setLabelVisible(true);
      setLabelText("Passwords do not match.");
      return;
    }
    delete formValues.confirmPassword;

    postToNodeServer(Routes.REGISTER_ROUTE, formValues)
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "SUCCESS") {
          setLabelVisible(false);
          navigate(Routes.USER_ROUTE);
        } else {
          setLabelVisible(true);
          setLabelText(response.message);
        }
      });
  };

  return (
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
            <div className="col-md-5"></div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-5 col-10 my-2">
              <label
                htmlFor="firstNameInput"
                className="form-label fs-5 d-block"
              >
                First Name
              </label>
              <input
                type="text"
                className="form-control-lg w-100"
                id="firstNameInput"
                name="firstName"
                required
              />
            </div>
            <div className="col-md-5 col-10 my-2">
              <label
                htmlFor="lastNameInput"
                className="form-label fs-5 d-block"
              >
                Last Name
              </label>
              <input
                type="text"
                className="form-control-lg w-100"
                id="lastNameInput"
                name="lastName"
              />
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-5 col-10 my-2">
              <label htmlFor="emailInput" className="form-label fs-5 d-block">
                Email Address
              </label>
              <input
                type="email"
                className="form-control-lg w-100"
                id="emailInput"
                name="email"
                required
              />
            </div>
            <div className="col-md-5 col-10 my-2">
              <label className="form-label fs-5 d-block">Gender</label>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="gender"
                  id="genderMaleInput"
                  value="Male"
                  required
                />
                <label
                  className="form-check-label fs-5"
                  htmlFor="genderMaleInput"
                >
                  Male
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="gender"
                  id="genderFemaleInput"
                  value="Female"
                />
                <label
                  className="form-check-label fs-5"
                  htmlFor="genderFemaleInput"
                >
                  Female
                </label>
              </div>
            </div>
          </div>
          <div className="row justify-content-center ">
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
            <div className="col-md-5 col-10 my-2">
              <label
                htmlFor="confirmPasswordInput"
                className="form-label fs-5 d-block"
              >
                Confirm Password
              </label>
              <input
                type="password"
                className="form-control-lg w-100"
                id="confirmPasswordInput"
                name="confirmPassword"
                required
              />
            </div>
            <label
              className="col-10 fs-6"
              style={{
                display: labelVisible === false ? "none" : "block",
                color: "red",
              }}
            >
              {labelText}
            </label>
          </div>
          <div className="row justify-content-center mt-4">
            <button type="submit" className="btn btn-success col-6 fs-5">
              Register
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
