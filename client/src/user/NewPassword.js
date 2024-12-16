import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { resetPassword } from "../auth/helper";
import { useLocation, Redirect } from "react-router-dom"; // Import Redirect

const NewPassword = () => {
  const [values, setValues] = useState({
    password: "",
    confirmPassword: "",
    error: "",
    loading: false,
    passwordMismatch: false,
    redirectToSignin: false, // New state for redirection
  });

  const { password, confirmPassword, error, loading, passwordMismatch, redirectToSignin } = values;

  const location = useLocation();

  // Extract the token and store it in localStorage
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    if (token) {
      localStorage.setItem("resetToken", token);
    }
  }, [location]);

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();

    // Validate password and confirmPassword
    if (password !== confirmPassword) {
      setValues({ ...values, passwordMismatch: true });
      return;
    }

    setValues({ ...values, loading: true, error: false });

    // Retrieve token from localStorage
    const token = localStorage.getItem("resetToken");

    resetPassword({ password, token })
      .then((data) => {
        if (data && data.message === "Your password has been updated.") {
          alert("Password reset successful. Please log in.");
          setValues({ ...values, redirectToSignin: true }); // Set redirect state
        } else {
          setValues({
            ...values,
            loading: false,
            error: data.message || "Failed to reset password.",
          });
        }
      })
      .catch(() => {
        setValues({
          ...values,
          loading: false,
          error: "An error occurred. Please try again.",
        });
      });
  };

  const loadingMessage = () => {
    return (
      loading && (
        <div className="alert alert-info">
          <h4>Resetting your password...</h4>
        </div>
      )
    );
  };

  const errorMessage = () => {
    return (
      error && (
        <div className="alert alert-danger">
          <h4>{error}</h4>
        </div>
      )
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

  const passwordResetForm = () => {
    return (
      <form>
        <div className="form-group">
          <label className="text-light">New Password</label>
          <input
            type="password"
            value={password}
            onChange={handleChange("password")}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label className="text-light">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={handleChange("confirmPassword")}
            className="form-control"
          />
        </div>
        <button
          onClick={onSubmit}
          className="btn btn-success btn-block"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    );
  };

  return (
    <Base title="Reset Password" description="Enter your new password">
      {redirectToSignin && <Redirect to="/user/signin" />} {/* Redirect on success */}
      {passwordMismatchMessage()}
      {errorMessage()}
      {loadingMessage()}
      {passwordResetForm()}
    </Base>
  );
};

export default NewPassword;
