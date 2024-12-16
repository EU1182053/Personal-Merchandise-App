import React from "react";
import { Redirect } from "react-router-dom";
import Base from "../core/Base";

const Signout = () => {
    const SignOutForm = () => {
        window.localStorage.clear();
        
    }
    return (
        <Base title="Signout Page">
          {SignOutForm()}
          <Redirect to="/user/signup"/> 
          <p className=" text-white text-center"></p>
        </Base>
      );
    
}
export default Signout