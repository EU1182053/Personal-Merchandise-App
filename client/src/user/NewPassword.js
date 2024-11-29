import React, { useState } from "react";
import Base from "../core/Base";
import { Redirect } from "react-router-dom";
import '../styles.css'
import { resetPassword } from "../auth/helper";

const NewPassword = () => {
  const [values, setValues] = useState({
    password: "",
    newPassword: "",
    error: "",
    loading: false,
    gotTheToken: false,
    passwordMismatch: false, // State to track password mismatch
  });
  const { password, newPassword, error, loading, gotTheToken, passwordMismatch } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, passwordMismatch: false, [name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    
    // Check if the passwords match before submitting
    if (password !== newPassword) {
      setValues({ ...values, passwordMismatch: true });
      return;
    }

    setValues({ ...values, error: false, loading: true });
    const token = localStorage.getItem("resetToken"); // **Retrieve Token**

    resetPassword({ password, token })
      .then((data) => {
        if (data && data.message === "Your password has been updated.") {
          setValues({ ...values, loading: false, gotTheToken: true });
        } else {
          setValues({ ...values, loading: false, error: data.message || "Failed to reset password." });
        }
      })
      .catch((error) => {
        console.log("Reset password request failed", error);
        setValues({
          ...values,
          loading: false,
          error: "Failed to reset password. Please try again.",
        });
      });
  };

  const loadingMessage = () => {
    return (
      loading && (
        <div className="alert alert-info">
          <h4>Your password is being reset...</h4>
        </div>
      )
    );
  };

  const errorMessage = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <div
            className="alert alert-danger"
            style={{ display: error ? "" : "none" }}
          >
            {error}
          </div>
        </div>
      </div>
    );
  };

  const passwordMismatchMessage = () => {
    return (
      passwordMismatch && (
        <div className="alert alert-danger">
          <h4>Passwords do not match!</h4>
        </div>
      )
    );
  };

  const signInForm = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <form>
            <div className="form-group">
              <label className="text-light">Password</label>
              <input
                onChange={handleChange("password")}
                value={password}
                className="form-control"
                type="password"
              />
            </div>
            <div className="form-group">
              <label className="text-light">Confirm Password</label>
              <input
                onChange={handleChange("newPassword")}
                value={newPassword}
                className="form-control"
                type="password"
              />
            </div>
            <button
              onClick={onSubmit}
              className="btn btn-success btn-block"
              disabled={loading} // **Disable while loading**
            >
              {loading ? "Submitting..." : "Submit"} {/* **Dynamic Button Text** */}
            </button>
          </form>
        </div>
      </div>
    );
  };

  if (gotTheToken) {
    return <Redirect to="/signin" />; // **Redirect to Sign In**
  }

  return (
    <Base title="Reset Password page" description="A page for user to reset password!">
      {passwordMismatchMessage()}
      {signInForm()}
      {errorMessage()}
      {loadingMessage()}
    </Base>
  );
};

export default NewPassword;
