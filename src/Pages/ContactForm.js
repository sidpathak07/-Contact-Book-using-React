import React, { useContext, useEffect, useState } from "react";

//react-router-dom imports
import { useHistory } from "react-router-dom";

//context imports
import { ContactContext } from "../Context/ContactContext";

//firebase imports
import firebase from "firebase/app";

//browser-image-resizer
import { readAndCompressImage } from "browser-image-resizer";

//config imports
import { imageConfig } from "../Config/config";

//toast import
import { toast } from "react-toastify";
//action.types imports
import { CONTACT_TO_UPDATE } from "../Context/actions.types";

//reactstrap imports
import {
  Container,
  Row,
  Col,
  Form,
  Spinner,
  FormGroup,
  Input,
  Label,
  Button,
} from "reactstrap";

//uuid imports
import { v4 } from "uuid";
const ContactForm = () => {
  //destructuring state and dispatch from ContactContext which is provided using ContactContext.Provider value={{state,dispatch}}
  const { state, dispatch } = useContext(ContactContext);

  //destructuring contactToUpdate and contactToUpdateKey from state
  const { contactToUpdate, contactToUpdateKey } = state;

  const { uid } = state;
  //to push to page
  const history = useHistory();

  //states to store data from previous contact or from form
  const [name, setName] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [address, setAddress] = useState();
  const [email, setEmail] = useState();
  const [isUpdate, setIsUpdate] = useState(false);
  const [star, setStar] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState();

  //if we have to update contact
  useEffect(() => {
    if (contactToUpdate) {
      console.log(contactToUpdate);
      setName(contactToUpdate.name);
      setPhoneNumber(contactToUpdate.phoneNumber);
      setAddress(contactToUpdate.address);
      setEmail(contactToUpdate.email);
      setStar(contactToUpdate.star);
      setDownloadUrl(contactToUpdate.picture);
      setIsUpdate(true);
    }
  }, [contactToUpdate]);
  //adding image to storage
  const imagePicker = async (e) => {
    try {
      const storageRef = await firebase.storage().ref(uid + "/contacts/");

      const file = e.target.files[0];

      const metadata = {
        contentType: file.type,
      };

      const resizedImg = await readAndCompressImage(file, imageConfig);

      var uploadTask = storageRef
        .child(uid + "/contacts/" + file.name)
        .put(resizedImg, metadata);

      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          setIsUploading(true);
          var progress =
            (firebase.storage.bytesTransferred / firebase.storage.totalBytes) *
            100;
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
              setIsUploading(false);
              toast("Upload Paused due to unknown error", { type: "error" });
              break;
            case firebase.storage.TaskState.RUNNING:
              setIsUploading(true);
              break;
            case firebase.storage.TaskState.SUCCESS:
              setIsUploading(false);
              toast("Upload Completed", { type: "success" });
              break;
            case firebase.storage.TaskState.CANCELED:
              setIsUploading(false);
              toast("Upload cancled due to unknown error", { type: "error" });
              break;
            case firebase.storage.TaskState.ERROR:
              setIsUploading(false);
              toast("Unknown Error Occured", { type: "error" });
              break;
            default:
              break;
          }
          if (progress === 100) {
            setIsUploading(false);
            toast("Upload Completed", { type: "success" });
          }
        },
        (error) => {
          console.log(error);
          toast("Unknown Error Occured", { type: "error" });
        },
        () => {
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then((downloadURL) => {
              setDownloadUrl(downloadURL);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      );
    } catch (error) {
      console.log(error);
      toast("Something went wrong", { type: "error" });
    }
  };
  //addContact Method to add Contact in database
  const addContact = async () => {
    try {
      console.log("UID" + uid);
      firebase
        .database()
        .ref(uid + "/contacts/" + v4())
        .set({
          name,
          phoneNumber,
          email,
          address,
          star,
          picture: downloadUrl,
        });
    } catch (error) {
      console.log(error);
    }
  };

  //updateContact method to update Contact which exist in database
  const updateContact = async () => {
    try {
      firebase
        .database()
        .ref(uid + "/contacts/" + contactToUpdateKey)
        .set({
          name,
          phoneNumber,
          email,
          address,
          star,
          picture: downloadUrl,
        });
    } catch (error) {
      console.log(error);
      toast("Failed Updating Contact", { type: "error" });
    }
  };

  //handleSubmit method to submit the form
  const handleSubmit = (e) => {
    e.preventDefault();
    isUpdate ? updateContact() : addContact();
    // isUpdate(false);

    dispatch({
      type: CONTACT_TO_UPDATE,
      contactToUpdate: null,
      contactToUpdateKey: null,
    });

    history.push("/");
  };

  return (
    <Container fluid className="mt-5">
      <Row>
        <Col md="6" className="offset-md-3 p-2">
          <Form onSubmit={handleSubmit}>
            <div className="text-center">
              {isUploading ? (
                <Spinner type="grow" color="primary" />
              ) : (
                <div>
                  <label htmlFor="imagepicker" className="">
                    <img src={downloadUrl} alt="" className="profile" />
                  </label>
                  <input
                    type="file"
                    name="image"
                    id="imagepicker"
                    accept="image/*"
                    multiple={false}
                    onChange={(e) => imagePicker(e)}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            <FormGroup>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="number"
                name="number"
                id="phonenumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="phone number"
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="textarea"
                name="area"
                id="area"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="address"
              />
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="checkbox"
                  onChange={() => {
                    setStar(!star);
                  }}
                  checked={star}
                />{" "}
                <span className="text-right">Mark as Star</span>
              </Label>
            </FormGroup>
            <Button
              type="submit"
              color="primary"
              block
              className="text-uppercase"
            >
              {isUpdate ? "Update Contact" : "Add Contact"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactForm;
