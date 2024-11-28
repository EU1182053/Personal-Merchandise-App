import React, { useState } from "react";
import Base from "../core/Base";
import { Link, Redirect } from "react-router-dom";
import '../styles.css'
import { signin, authenticate, isAuthenticated, resetPassword } from "../auth/helper";
import { recover } from "../auth/helper/index";


const NewPassword = () => {
  const [values, setValues] = useState({
    password: "",
    newPassword: "",
    error: "",
    loading: false,
    gotTheToken: false
  });
  const { password, newPassword, error, loading, gotTheToken } = values;
  const { user } = isAuthenticated();

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false, loading: true });
    const token = localStorage.getItem("resetToken"); // **Retrieve Token**
    resetPassword({ password, token })

      .then((data) => {

        if (data.success) {
          setValues({ ...values, loading: false, gotTheToken: true });
        } else {
          setValues({ ...values, loading: false, error: data.message });
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
  }

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
    )

  };

  if (gotTheToken) {
    return <Redirect to="/signin" />; // **Redirect to Sign In**
  }

  
  return (
    <Base title="Reset Password page" description="A page for user to reset password!">
      {signInForm()}
      {errorMessage()}
      {loadingMessage()}
    </Base>
  );
};

export default NewPassword;
