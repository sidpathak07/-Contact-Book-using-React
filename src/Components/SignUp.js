import React, { useState, useContext } from "react";

//react-router-dom imports
import { Link, useHistory } from "react-router-dom";

//reactstrap imports
import {
  Form,
  Label,
  FormGroup,
  Input,
  Col,
  Button,
  NavbarText,
} from "reactstrap";

//context imports
import { ContactContext } from "../Context/ContactContext";

//firebase imports
import firebase from "firebase/app";
import { toast } from "react-toastify";
import { SIGN_UP } from "../Context/actions.types";
const SignUp = () => {
  const { state, dispatch } = useContext(ContactContext);

  const { email, password } = state;

  const history = useHistory();

  const [uEmail, setUEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(uEmail, pass);
    firebase
      .auth()
      .createUserWithEmailAndPassword(uEmail, pass)
      .then((userCredential) => {
        console.log(userCredential);
        console.log(userCredential.user.email);
        console.log(userCredential.user.uid);
        dispatch({
          type: SIGN_UP,
          payload: true,
          uuid: userCredential.user.uid,
          uemail: userCredential.user.email,
          upass: pass,
        });
        toast("Sign Up Successfull", { type: "success" });
        history.push("/");
      })
      .catch((err) => {
        console.log(err);
        toast(err.message, { type: "error" });
      });
  };
  return (
    <div className="border border-primary mt-2 w-75 mx-auto">
      <h1 className="text-center">SignUp</h1>
      <Form>
        <FormGroup row className="w-75 mx-auto">
          <Label for="exampleEmail" sm={2}>
            Email
          </Label>
          <Col sm={10}>
            <Input
              type="email"
              name="email"
              id="exampleEmail"
              placeholder="enter email"
              value={uEmail}
              onChange={(e) => setUEmail(e.target.value)}
            />
          </Col>
        </FormGroup>
        <FormGroup row className="w-75 mx-auto">
          <Label for="examplePassword" sm={2}>
            Password
          </Label>
          <Col sm={10}>
            <Input
              type="password"
              name="password"
              id="examplePassword"
              placeholder="enter password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </Col>
        </FormGroup>
        <FormGroup check row className="mb-2">
          <Col sm={{ size: 10, offset: 5 }}>
            <Button onClick={(e) => handleSubmit(e)}>Submit</Button>
          </Col>
        </FormGroup>

        <NavbarText
          tag={Link}
          to={"/login"}
          className="w-100 mx-auto text-center"
        >
          Login
        </NavbarText>
      </Form>
    </div>
  );
};

export default SignUp;
