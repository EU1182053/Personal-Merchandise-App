import React, { useState } from "react";
import Base from "../core/Base";
import { Link, Redirect } from "react-router-dom";
import '../styles.css'
import { signin, authenticate, isAuthenticated } from "../auth/helper";
import { recover } from "../auth/helper/index";

const Forgot = () => {
  const [values, setValues] = useState({
    email: "",
    error: "",
    loading: false,
    didRedirect: false,
    gotTheToken: false
  });
  const { email, error, loading, didRedirect, gotTheToken } = values;

  // Handle input changes
  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  // **Added** Form Validation
  const validateForm = () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) { // **Email validation** regex
      return "Please enter a valid email address.";
    }
    return null;
  };

  // Handle form submission
  const onSubmit = (event) => {
    event.preventDefault();
    const formError = validateForm(); // **Calling validateForm**

    if (formError) {
      setValues({ ...values, error: formError }); // **Display error if form is invalid**
      return;
    }

    setValues({ ...values, error: false, loading: false, gotTheToken: false });
    recover({ email })
    .then((data) => {
      console.log(data)
      if (data && data.resetLink) {
        // Extract the token from the resetLink
        const resetToken = data.resetLink.split("/").pop(); // Assumes token is at the end of the URL
        console.log("resetToken", resetToken);
        localStorage.setItem("resetToken", resetToken); // Store the token
        setValues({ ...values, error: "", loading: false, gotTheToken: true });
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
  
  }
  const loadingMessage = () => {
    if (gotTheToken) {
      return <Redirect to="/user/newPassword" />;
    }
    return (
      loading && (
        <div className="alert alert-info">
          <h4>Processing...</h4>
        </div>

      ))
  };

  // Display error message
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

            <button 
            onClick={onSubmit} 
            className="btn btn-success btn-block"
            >
              {loading ? "Submitting..." : "Submit"} {/* **Button text change while loading** */}
            </button>
          </form>

        </div>
      </div>
    )
  };

  return (
    <Base title="Forgot Password page" description="A page for user to sign in!">
      {signInForm()}
      {errorMessage()}
      {loadingMessage()}
    </Base>
  );
};

export default Forgot;
