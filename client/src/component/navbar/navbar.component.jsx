import { Component, Fragment, useContext } from "react";
import { Link, Outlet, NavLink } from "react-router-dom";
import "./navbar.styles.scss";
import { useEffect, useState } from "react";

import { UserContext } from "../../context/user.context";

const Navigation = () => {
  const { isLoggedIn } = useContext(UserContext);

  return (
    <Fragment>
      <nav className="navbar">
        <ul className="navbar-list">
          <li className="navbar-item">
            <NavLink to="/" exact>
              Home
            </NavLink>
          </li>
          {!isLoggedIn && (
            <Fragment>
              <li className="navbar-item">
                <NavLink to="/signup">SignUp</NavLink>
              </li>
              <li className="navbar-item">
                <NavLink to="/signin">SignIn</NavLink>
              </li>
            </Fragment>
          )}
          {isLoggedIn && (
            <Fragment>
              <li className="navbar-item">
                <NavLink to="/profile">Profile</NavLink>
              </li>
              <li className="navbar-item">
                <NavLink to="/logout">Logout</NavLink>
              </li>
            </Fragment>
          )}
        </ul>
      </nav>

      <Outlet />
    </Fragment>
  );
};

export default Navigation;
