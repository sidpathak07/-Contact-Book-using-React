import React, { useContext } from "react";

//react-router-dom imports
import { useHistory } from "react-router-dom";

//context import
import { ContactContext } from "../Context/ContactContext";

//actions.types import
import {
  CONTACT_TO_UPDATE,
  SET_SINGLE_CONTACT,
} from "../Context/actions.types";

//reactstrap imports
import { Row, Col } from "reactstrap";

//react-icons imports
import { FaRegStar, FaStar } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";

//firebase imports
import firebase from "firebase/app";

//react-toastify imports
import { toast } from "react-toastify";

const Contact = ({ contact, contactKey }) => {
  const { state, dispatch } = useContext(ContactContext);

  const { uid } = state;

  const history = useHistory();
  const updateContact = () => {
    // console.log("updateContact");
    dispatch({
      type: CONTACT_TO_UPDATE,
      payload: contact,
      key: contactKey,
    });

    history.push("/addcontact");
  };

  const updateImpContact = () => {
    // console.log("UpdateImpContact");
    firebase
      .database()
      .ref(uid + "/contacts/" + contactKey)
      .update(
        {
          star: !contact.star,
        },
        (err) => {
          console.log(err);
        }
      )
      .then(() => {
        toast("Contact Updated", { type: "success" });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const viewSingleContact = (contact) => {
    let httpsRef = firebase.storage().refFromURL(contact.picture);
    console.log(httpsRef._delegate._location.path_);
    let path = httpsRef._delegate._location.path_;
    let name = path.slice(9, 30);
    console.log(name);
    console.log("contacts/" + name);
    // console.log(firebase.storage.child("contacts/" + name));
    // console.log(
    //   firebase
    //     .storage()
    //     .ref()
    //     .child("contacts/" + name)
    // );
    dispatch({
      type: SET_SINGLE_CONTACT,
      payload: contact,
    });

    history.push("/viewcontact");
  };

  const deleteContact = () => {
    // console.log("deleteContact");
    firebase
      .database()
      .ref(uid + "/contacts/" + contactKey)
      .remove()
      .then(() => {
        toast("Contact Deleted Successfully", { type: "success" });
      })
      .catch((err) => console.log(err));
    let httpsRef = firebase.storage().refFromURL(contact.picture);
    console.log(httpsRef._delegate._location.path_);
    let path = httpsRef._delegate._location.path_;
    let name = path.slice(9, 30);
    // console.log("contacts/" + name);
    // console.log(firebase.storage.child("contacts/" + name));
    firebase
      .storage()
      .ref()
      .child("contacts/" + name)
      .delete()
      .then(() => console.log("deleted"))
      .catch((err) => console.log("not deleted"));
  };
  return (
    <>
      <Row>
        <Col
          md="1"
          className="d-flex justify-content-center align-items-center"
        >
          <div className="icon" onClick={() => updateImpContact()}>
            {contact.star ? (
              <FaStar className=" text-primary" />
            ) : (
              <FaRegStar className=" text-info" />
            )}
          </div>
        </Col>
        <Col
          md="2"
          className="d-flex justify-content-center align-items-center"
        >
          <img src={contact.picture} alt="" className="img-circle profile" />
        </Col>
        <Col md="8" onClick={() => viewSingleContact(contact)}>
          <div className="text-primary">{contact.name}</div>

          <div className="text-secondary">{contact.phoneNumber}</div>
          <div className="text-secondary">{contact.email}</div>

          <div className="text-info">{contact.address}</div>
        </Col>
        <Col
          md="1"
          className="d-flex justify-content-center align-items-center"
        >
          <MdDelete
            onClick={() => deleteContact()}
            color="danger"
            className="text-danger icon"
          />
          <MdEdit
            className="icon text-info ml-2"
            onClick={() => updateContact()}
          />
        </Col>
      </Row>
    </>
  );
};

export default Contact;
