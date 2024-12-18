//  for commom template
import React from "react";
import Menu from "./Menu";

import "../styles.css";
const Base = ({
  title = "My title",

  description = "My description",
  className = "bg-dark text-white p-4",
  children,
}) => {
  return (
    <div>
      <Menu />
      <div className="container-fluid">
        <div className="jumbotron bg-dark text-white text-center">
          <h2 className="display-4">{title}</h2>
          <p className="lead">{description}</p>
        </div>
        <div className={className}>{children}</div>
      </div>
      <footer className="footer p-3 ">
        <div className="col text-center">  
          <div className="container-fluid   text-white   py-3 "></div>
          <span className="text-white">
            If you have any problems, reach me at instagram!
          </span>
          <br></br>
          
          <a href="https://www.google.com/" className="col-3" style={{"color":"purple"}} ><i className="fab fa-instagram fa-2x" ></i></a>
          <a href="https://www.google.com/" className="col-3" style={{"color":"#74C0FC"}}><i className="fab fa-linkedin fa-2x" ></i></a>
          <a href="https://www.google.com/" className="col-3" style={{"color":"#74C0FC"}}><i className="fab fa-twitter fa-2x" ></i></a>
          
        </div>
      </footer> 
    </div>
  );
};

export default Base;
