import React, { useState } from "react";
import Base from "../core/Base";
import { Link, Redirect } from "react-router-dom";
import '../styles.css'
import { signin, authenticate, isAuthenticated } from "../auth/helper";
import Popup from "../core/Popup";

const Signin = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    loading: false,
    success: false,
    didRedirect: false,
  });

  const { email, password, error, loading, success, didRedirect } = values;
  const { user } = isAuthenticated();

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false, loading: true });
    signin({ email, password })
      .then((data) => {
        if (!data.ok) {
          setValues({ ...values, error: data?.errors?.[0]?.msg || data?.error, loading: false });
        } else {
          authenticate(data, () => {
            setValues({
              ...values,
              success: true,
              didRedirect: false,
            });
          });
        }
      })
      .catch(error => { return console.log("signin request failed", error) });
  };

  const performRedirect = () => {
    if (didRedirect) {
      if (user && user.role === 1) {
        return <Redirect to="/admin/dashboard" />
      } else {
        return <Redirect to="/" />
      }
    }
    if (!success && isAuthenticated()) {
      return <Redirect to="/" />;
    }
  };

  // const loadingMessage = () => {
  //   return (
  //     loading && (
  //       <div className="alert alert-info">
  //         <h2>Loading...</h2>
  //       </div>
  //     )
  //   );
  // };

  const errorMessage = () => {
    return error ? (
      <Popup
        type="error"
        message={error}
        onClose={() => setValues({ ...values, error: "" })}
      />
    ) : null
  };

  // ADDED
  const successMessage = () => {
    return success ? (
      <Popup
        type="success"
        message="Signin Successful! Welcome back."
        onClose={() => setValues({ ...values, success: false })}
      >
        <button
          className="btn btn-success btn-sm"
          onClick={() =>
            setValues({
              ...values,
              success: false,
              didRedirect: true,
            })
          }
        >
          Continue
        </button>
      </Popup>
    ) : null;
  };
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

            <div className="form-group">
              <label className="text-light">Password</label>
              <input
                onChange={handleChange("password")}
                value={password}
                className="form-control"
                type="password"
              />
            </div>
            <button onClick={onSubmit} className="btn btn-success btn-block">
              Submit
            </button>
          </form>
          <Link

            className="nav-link offset-sm-3 text-right"
            to="/user/recover"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
    );
  };

  return (
    <Base title="Sign In | Personal Merchandise App" description="Access your Personal Merchandise App account to manage orders, update profile, and continue shopping your favorite T-shirts.">
      {/* {loadingMessage()} */}
      {errorMessage()}
      {successMessage()}
      {signInForm()}
      {performRedirect()}

    </Base>
  );
};

export default Signin;
