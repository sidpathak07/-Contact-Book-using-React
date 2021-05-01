import React, { useContext, useEffect } from "react";

//context import
import { ContactContext } from "../Context/ContactContext";

//react-router-dom import
import { useHistory } from "react-router-dom";

//reactstrap imports
import { Container, ListGroup, ListGroupItem, Spinner } from "reactstrap";

//component imports
import Contact from "../Components/Contact";

//react-icons import
import { MdAdd } from "react-icons/md";

//action.types import
import { CONTACT_TO_UPDATE } from "../Context/actions.types";
const Home = () => {
  const { state, dispatch } = useContext(ContactContext);
  const { contacts, isLoading } = state;
  const { isAuthenticated } = state;
  const history = useHistory();

  useEffect(() => {
    console.log("logged In" + isAuthenticated);
  }, [isAuthenticated]);
  const AddContact = () => {
    dispatch({
      type: CONTACT_TO_UPDATE,
      contactToUpdate: null,
      contactToUpdateKey: null,
    });
    history.push("/addcontact");
  };
  if (isLoading) {
    return (
      <div className="Center">
        <Spinner color="primary" />
        <div className="text-primary">Loading...</div>
      </div>
    );
  }
  return (
    <Container className="mt-4">
      {/* TODO: Loop through FIREBASE objects  */}
      {isAuthenticated ? (
        [
          contacts.length === 0 ? (
            <h1 className="Center text-primary">No Contacts Found</h1>
          ) : (
            <ListGroup>
              {/* {Object.entries(contacts).map(([key, value]) => (
                <ListGroupItem>
                  <Contact contact={value} contactKey={key} />
                </ListGroupItem>
              ))} */}
              {console.log(contacts)}
              <h1>Contacts Found</h1>
            </ListGroup>
          ),
        ]
      ) : (
        <h1 className="text-center">Please SignUp Or Login</h1>
      )}
      {/* {contacts.length === 0 ? (
        <h1 className="Center text-primary">No Contacts Found</h1>
      ) : (
        <ListGroup>
          {Object.entries(contacts).map(([key, value]) => (
            <ListGroupItem>
              <Contact contact={value} contactKey={key} />
            </ListGroupItem>
          ))}
        </ListGroup>
      )} */}
      <MdAdd className="fab icon AddIcon" onClick={AddContact} />
    </Container>
  );
};

export default Home;
