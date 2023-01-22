import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/Login.css";
import { getFormValues, postToNodeServer, Routes } from "../utils";
import WaitingAnimation from "./WaitingAnimation";

export default function ResetPasswordForm() {
  const [otp, setOtp] = useState(undefined);
  const [email, setEmail] = useState(undefined);
  const [showErrorLabel, setShowErrorLabel] = useState(false);
  const [labelText, setLabelText] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.querySelector("form").reset();
  }, [otp, email]);
  return (
    <form
      className="container-fluid h-100 p-0"
      onSubmit={async (event) => {
        event.preventDefault();
        setShowErrorLabel(false);

        if (!otp || !email)
          event.target.querySelector(".waitingAnimationDiv").style.display =
            "block";

        const formValues = getFormValues(event);

        if (!email) {
          const response = await postToNodeServer(
            Routes.SEND_OTP_ROUTE,
            formValues,
            true
          );

          event.target.querySelector(".waitingAnimationDiv").style.display =
            "none";

          if (response.status === 200) {
            setEmail(formValues.email);
            setOtp(response.otp);
          } else {
            setLabelText(response.message);
            setShowErrorLabel(true);
          }
        } else if (otp) {
          const enteredOtp = Number(formValues.otp);
          if (enteredOtp === otp) {
            setOtp(undefined);
          } else {
            setShowErrorLabel(true);
            setLabelText("Incorrect Otp");
          }
        } else {
          if (formValues.password !== formValues.confirmPassword) {
            setShowErrorLabel(true);
            setLabelText("Passwords do not macth.");
          } else {
            const response = await postToNodeServer(
              Routes.CHANGE_PASSWORD_ROUTE,
              { password: formValues.password, email: email }
            );
            if (response.status === 200) {
              window.alert("Password Changed.");
              navigate("/login");
            }
          }
          event.target.querySelector(".waitingAnimationDiv").style.display =
            "none";
        }
      }}
    >
      <h1 className="user-select-none text-warning">Reset Password !</h1>
      <div
        className="col-md-8 col-lg-5 col-xxl-4 col-sm-10 col-11 p-4"
        id="formDiv"
      >
        {email === undefined ? (
          <>
            <label htmlFor="emailInput" className="form-label fs-5 d-block">
              Email
            </label>
            <input
              type="email"
              className="form-control-lg w-100"
              name="email"
              id="emailInput"
              required
            />
            <label
              className="fs-6 my-1"
              style={{
                display: showErrorLabel ? "block" : "none",
                color: "red",
              }}
            >
              {labelText}
            </label>
            <button
              type="submit"
              className="btn btn-primary d-block w-100 fs-5 position-relative border-0 mt-2"
            >
              send otp
              <WaitingAnimation />
            </button>
          </>
        ) : otp === undefined ? (
          <>
            <label htmlFor="passwordInput" className="form-label fs-5 d-block">
              New Password
            </label>
            <input
              type="password"
              id="passwordInput"
              name="password"
              className="form-control-lg w-100"
              required
            />
            <label
              htmlFor="confirmPasswordInput"
              className="form-label fs-5 d-block mt-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPasswordInput"
              name="confirmPassword"
              className="form-control-lg w-100"
              required
            />
            <label
              className="fs-6 my-1"
              style={{
                display: showErrorLabel ? "block" : "none",
                color: "red",
              }}
            >
              {labelText}
            </label>
            <button
              type="submit"
              className="btn btn-primary d-block w-100 fs-5 position-relative border-0 mt-3"
            >
              Change Password
              <WaitingAnimation />
            </button>
          </>
        ) : (
          <>
            <h5>An OTP has been sent to {email}</h5>
            <p>Please check your Inbox and Spam folders.</p>
            <label htmlFor="otpInput" className="form-label fs-5 d-block">
              Enter OTP:
            </label>
            <input
              type="number"
              id="otpInput"
              name="otp"
              className="form-control-lg w-100"
              min="1000"
              max="9999"
              required
            />
            <label
              className="fs-6 my-1"
              style={{
                display: showErrorLabel ? "block" : "none",
                color: "red",
              }}
            >
              {labelText}
            </label>
            <button
              type="submit"
              className="btn btn-primary d-block w-100 fs-5 mt-2"
            >
              Verify
            </button>
          </>
        )}
      </div>
    </form>
  );
}
