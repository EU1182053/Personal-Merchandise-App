import React, { useState } from "react";
import Base from "../core/Base";
import { Link, Redirect } from "react-router-dom";
import '../styles.css'
import { signin, authenticate, isAuthenticated, resetPassword } from "../auth/helper";
import { recover } from "../auth/helper/index";


const NewPassword = () => {
  const [values, setValues] = useState({ 
    password: "",
    newPassword:"", 
    error: "",
    loading: false,
    didRedirect: false,
    gotTheToken:false
  });
  const { password, newPassword, error, loading, didRedirect, gotTheToken } = values;
  const { user } = isAuthenticated();
  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };
  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false, loading: false, gotTheToken: false });
   
    resetPassword( {password} )
    
      .then((data) => {
       
        if (data) {
          setValues({ ...values, error: data.message, loading: false, gotTheToken: true });
        } else {
          setValues({ ...values, loading: true, didRedirect: true, gotTheToken: false });
        }
      })
      .catch(error => { return console.log("signin request failed", error) });
  }
  const loadingMessage = () => {
    if (loading) {
      return (
        loading && (
          <div className="alert alert-info">
            <h4>Your password has been changed</h4>
          </div>
  
        ))
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
              <button onClick={onSubmit} className="btn btn-success btn-block">
                Submit
              </button>
            </form>
  
          </div>
        </div>
        )
      
    
    
    
  };

  return (
    <Base title="Reset Password page" description="A page for user to reset password!">
      {signInForm()}
      {errorMessage()}
      {loadingMessage()}
    </Base>
  );
};

export default NewPassword;
