import React from "react";
import { Link, useNavigate } from "react-router-dom";

export function LoginForm(props) {
  let navigate = useNavigate();

  const onSubmit = (event) => {
    //prevent refresh
    event.preventDefault();

    //extracting values of inputs from form
    let form = event.target;
    let formData = new FormData(form);
    let formValues = Object.fromEntries(formData);

    //posting to express server
    //to do so we also need to add proxy in react-app node module
    fetch("../../login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formValues),
    }).then((response) => {
      //TODO: email not found and incorrect password case.
      navigate("/user");
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
