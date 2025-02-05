import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth/helper";

const currentTab = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#2ecc72" };
  } else {
    return { color: "#FFFFFF" };
  }
};

const Menu = ({ history }) => {
  const auth = isAuthenticated(); // Call once and store in a variable
  const userRole = auth?.user?.role; // Safe access

  return (
    <div>
      <ul className="nav nav-tabs bg-dark">
        <li className="nav-item">
          <Link style={currentTab(history, "/")} className="nav-link" to="/">
            Home
          </Link>
        </li>

        {auth && (
          <li className="nav-item">
            <Link style={currentTab(history, "/cart")} className="nav-link" to="/cart">
              Cart
            </Link>
          </li>
        )}

        {auth && (
          <li className="nav-item">
            <Link style={currentTab(history, "/user/order")} className="nav-link" to="/user/order">
              My Orders
            </Link>
          </li>
        )}

        {/* Admin Dashboard */}
        {auth && userRole === 1 && (
          <li className="nav-item">
            <Link style={currentTab(history, "/admin/dashboard")} className="nav-link" to="/admin/dashboard">
              Admin Dashboard
            </Link>
          </li>
        )}

        {/* If not authenticated, show Signup & Signin */}
        {!auth && (
          <Fragment>
            <li className="nav-item">
              <Link style={currentTab(history, "/user/signup")} className="nav-link" to="/user/signup">
                Signup
              </Link>
            </li>
            <li className="nav-item">
              <Link style={currentTab(history, "/user/signin")} className="nav-link" to="/user/signin">
                Sign In
              </Link>
            </li>
          </Fragment>
        )}

        {/* Signout */}
        {auth && (
          <li className="nav-item">
            <span
              className="nav-link text-warning"
              onClick={() => {
                signout(() => {
                  history.push("/");
                });
              }}
            >
              Signout
            </span>
          </li>
        )}
      </ul>
    </div>
  );
};


export default withRouter(Menu);
