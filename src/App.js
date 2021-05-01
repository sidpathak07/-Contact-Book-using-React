import React, { useEffect, useReducer } from "react";

//Context import
import { ContactContext } from "./Context/ContactContext";

//import react-toastify
import { ToastContainer } from "react-toastify";

//react-router-dom imports
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

//action.types and reducer import
import { SET_LOADING, SET_CONTACT } from "./Context/actions.types";
import reducer from "./Context/reducer";
//CSS imports
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.min.css";
import "./App.css";

//reactstrap imports
import { Container } from "reactstrap";

//pages and component imports
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import SignUp from "./Components/SignUp";
import LogIn from "./Components/LogIn";
import Home from "./Pages/Home";
import ContactForm from "./Pages/ContactForm";
import PageNotFound from "./Pages/PageNotFound";
import ViewContact from "./Pages/ViewContact";

//firebase imports
import { firebaseConfig } from "./Config/config";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";
import "firebase/auth";
firebase.initializeApp(firebaseConfig);
const App = () => {
  //initializing state for useReducers
  const initialstate = {
    contacts: [],
    contact: {},
    contactToUpdate: null,
    contactToUpdateKey: null,
    isLoading: false,
    email: "",
    password: "",
    uid: null,
    isAuthenticated: false,
  };

  //using useReducer to create a central strore in which we have state and dispatch
  const [state, dispatch] = useReducer(reducer, initialstate);

  const { isAuthenticated, uid } = state;

  //we use getContacts method to retrive contacts from database
  const getContactFromFirebase = async () => {
    // console.log("hello");
    dispatch({
      type: SET_LOADING,
      payload: true,
    });
    console.log("UID " + uid);
    const ref = await firebase.database().ref(uid + "/contacts/");
    ref.on("value", (snapshot) => {
      console.log(snapshot.val());
      dispatch({
        type: SET_CONTACT,
        payload: snapshot.val(),
      });
      dispatch({
        type: SET_LOADING,
        payload: false,
      });
    });
  };
  // getting contact  when component did mount
  useEffect(() => {
    getContactFromFirebase();
  }, []);

  return (
    <Router>
      <ToastContainer />
      <ContactContext.Provider value={{ state, dispatch }}>
        <Header />
        <Container>
          <Switch>
            <Route exact path={"/"} component={Home} />
            <Route exact path={"/signup"} component={SignUp} />
            <Route exact path={"/login"} component={LogIn} />
            <Route exact path={"/addcontact"} component={ContactForm} />
            <Route exact path={"/viewcontact"} component={ViewContact} />
            <Route exact path={"*"} component={PageNotFound} />
          </Switch>
        </Container>
      </ContactContext.Provider>
      <Footer />
    </Router>
  );
};

export default App;
