//TODO: DONE set NavbarBrand to go to home page and export Header

import React, { useContext } from "react";
import { Navbar, NavbarBrand, Nav, NavItem } from "reactstrap";
import { Link } from "react-router-dom";
import { ContactContext } from "../Context/ContactContext";
import { LOG_OUT } from "../Context/actions.types";

const Header = () => {
  const { state, dispatch } = useContext(ContactContext);

  const { isAuthenticated } = state;

  const logOut = (e) => {
    dispatch({
      type: LOG_OUT,
      payload: false,
      uuid: null,
      uemail: "",
      upass: "",
    });
  };
  return (
    <Navbar color="info" light>
      <NavbarBrand tag={Link} to="/" className="text-white">
        LCO Contact App
      </NavbarBrand>
      <Nav>
        {isAuthenticated ? (
          <NavItem
            tag={Link}
            to="/signup"
            className="mr-2 text-white"
            onClick={(e) => logOut(e)}
          >
            Log Out
          </NavItem>
        ) : (
          <>
            <NavItem tag={Link} to="/signup" className="mr-2 text-white">
              Sign Up
            </NavItem>
            <NavItem tag={Link} to="/login" className="mr-2 text-white">
              Log In
            </NavItem>
          </>
        )}
      </Nav>
    </Navbar>
  );
};

export default Header;
