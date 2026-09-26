import React, { useState } from "react";
import Base from "../core/Base";
import Popup from "../core/Popup";
import { signup } from "../auth/helper/index";
import { Link } from "react-router-dom";
const Signup = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    success: "",
  });

  const { name, email, password, error, success } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false, success: false });
    signup({ name, email, password })
      .then((data) => {
        if (!data.ok) {
          setValues({ ...values, error: data?.errors?.[0]?.msg || data?.error, success: false });
        } else {
          setValues({ 
            ...values, 
            name: "",
            email: "",
            password: "",
            error: "",
            success: true,
          });
        }
      })
      .catch((error) => console.log(error));
  };
  const SignUpForm = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <form>
            <div className="form-group">
              <label className="text-light">Name</label>
              <input
                onChange={handleChange("name")}
                value={name}
                className="form-control"
                type="text"
              />
            </div>
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
        </div>
      </div>
    );
  };
  const successMessage = () => {
    return success ? (
    <Popup
      type="success"
      message="Signup Successful! Please login now."
      onClose={() => setValues({ ...values, success: false })}
    >
      <Link
        to="/user/signin"
        className="btn btn-success btn-sm mr-2"
      >
        Login Now
      </Link>
    </Popup>
  ) : null;
  };
  
  const errorMessage = () => {
    return error ? (
    <Popup
      type="error"
      message={error}
      onClose={() => setValues({ ...values, error: "" })}
    />
  ) : null;
  };

  return (
    <Base title="Sign Up | Personal Merchandise App" description="Create your account on Personal Merchandise App to shop trendy T-shirts, manage orders, and save favorite products securely.">
      {SignUpForm()}
      {successMessage()}
      {errorMessage()}
      
    </Base>
  );
};
export default Signup;
