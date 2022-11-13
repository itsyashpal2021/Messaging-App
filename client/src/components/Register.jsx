import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function RegisterForm(props) {
  let navigate = useNavigate();
  const [passwordLabelVisible, setPasswordLabelVisible] = useState(false);

  const onSubmit = (event) => {
    //prevent refresh
    event.preventDefault();

    //extracting values of inputs from form
    let form = event.target;
    let formData = new FormData(form);
    let formValues = Object.fromEntries(formData);

    //if passwords do not
    if (formValues.password !== formValues.confirmPassword) {
      setPasswordLabelVisible(true);
      return;
    }

    setPasswordLabelVisible(false);

    //posting to express server
    //to do so we also need to add proxy in react-app node module
    fetch("../../post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formValues),
    }).then((response) => {
      //FIXME: logic for user already present in db
      navigate("/user");
    });
  };

  return (
    <div className="container-xl">
      <form onSubmit={onSubmit}>
        <div className="container-fluid py-5">
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
                  name="genderRadio"
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
                  name="genderRadio"
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
                display: passwordLabelVisible === false ? "none" : "block",
                color: "red",
              }}
            >
              Passwords Do Not Match
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
