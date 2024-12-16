import React, { useState } from "react";
import Base from "../core/Base";
import "../styles.css";
import { recover } from "../auth/helper/index";

const Forgot = () => {
  const [values, setValues] = useState({
    email: "",
    error: "",
    successMessage: "", // State for success message
    loading: false,
  });

  const { email, error, successMessage, loading } = values;

  // Handle input changes
  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, successMessage: "", [name]: event.target.value });
  };

  // Form Validation
  const validateForm = () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return "Please enter a valid email address.";
    }
    return null;
  };

  // Handle form submission
  const onSubmit = (event) => {
    event.preventDefault();
    const formError = validateForm();

    if (formError) {
      setValues({ ...values, error: formError });
      return;
    }

    setValues({ ...values, error: false, loading: true, successMessage: "" });

    recover({ email })
      .then((data) => {
        if (data && data.resetLink) {
          // Extract and store reset token
          const resetToken = data.resetLink.split("/").pop();
          localStorage.setItem("resetToken", resetToken);

          // Show success message
          setValues({
            ...values,
            error: "",
            successMessage: "A reset link has been sent to your email.",
            loading: false,
          });
        } else {
          // Handle case where resetLink is missing
          setValues({
            ...values,
            loading: false,
            error: data.message || "Failed to retrieve reset link.",
          });
        }
      })
      .catch((error) => {
        console.log("Recover request failed", error);
        setValues({
          ...values,
          loading: false,
          error: "An error occurred. Please try again.",
        });
      });
  };

  // Success Message
  const successMessageComponent = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <div
            className="alert alert-success"
            style={{ display: successMessage ? "" : "none" }}
          >
            {successMessage}
          </div>
        </div>
      </div>
    );
  };

  // Error Message
  const errorMessageComponent = () => {
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

  // Loading Message
  const loadingMessage = () => {
    return (
      loading && (
        <div className="alert alert-info">
          <h4>Processing...</h4>
        </div>
      )
    );
  };

  // Form rendering
  const signInForm = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <form>
            <div className="form-group">
              <label className="text-light">Email</label>
              <input
                onChange={handleChange("email")}
                value={email}
                className="form-control"
                type="email"
              />
            </div>

            <button onClick={onSubmit} className="btn btn-success btn-block">
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <Base title="Forgot Password page" description="A page for user to reset password!">
      {successMessageComponent()}
      {errorMessageComponent()}
      {loadingMessage()}
      {signInForm()}
    </Base>
  );
};

export default Forgot;
