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
  const { email,  error, loading, didRedirect, gotTheToken } = values;
 
  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };
  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false, loading: false, gotTheToken: false });
    recover({ email }) 
      .then((data) => {
        
        
        if (data.token) {
          console.log('resetToken', data)
          localStorage.setItem('resetToken', data.token)
          setValues({ ...values, error: data.message, loading: false, gotTheToken: true });
          console.log("gotTheToken", gotTheToken)
        } else {
          setValues({ ...values, loading: true, didRedirect: true, gotTheToken: false });
        }
      })
      .catch(error => { return console.log("signin request failed", error) });
  }
  const loadingMessage = () => {
    if (gotTheToken) {
      return <Redirect to="/user/newPassword"/>;
    }

    else {
      return (
        loading && (
          <div className="alert alert-info">
            <h4>{error}</h4>
          </div>

        ))
    }



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
              <label className="text-light">Email</label>
              <input
                onChange={handleChange("email")}
                value={email}
                className="form-control"
                type="email"
              />
            </div>
            
            <button onClick={onSubmit} className="btn btn-success btn-block">
              Submit
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
