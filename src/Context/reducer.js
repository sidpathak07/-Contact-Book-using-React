import {
  SET_CONTACT,
  SET_LOADING,
  SET_SINGLE_CONTACT,
  CONTACT_TO_UPDATE,
  LOG_IN,
  LOG_OUT,
  SIGN_UP,
} from "./actions.types";

export default (state, action) => {
  switch (action.type) {
    case SET_CONTACT:
      return action.payload === null
        ? { ...state, contacts: [] }
        : { ...state, contacts: action.payload };
    case SET_LOADING:
      return { ...state, isLoading: action.payload };
    case SET_SINGLE_CONTACT:
      return { ...state, contact: action.payload };
    case CONTACT_TO_UPDATE:
      return {
        ...state,
        contactToUpdate: action.payload,
        contactToUpdateKey: action.key,
      };
    case SIGN_UP:
      return {
        ...state,
        isAuthenticated: action.payload,
        uid: action.uuid,
        username: action.uemail,
        password: action.upass,
      };
    case LOG_IN:
      return {
        ...state,
        isAuthenticated: action.payload,
        uid: action.uuid,
        username: action.uemail,
        password: action.upass,
      };
    case LOG_OUT:
      return {
        ...state,
        isAuthenticated: action.payload,
        uid: action.uuid,
        username: action.uemail,
        password: action.upass,
      };
    default:
      return state;
  }
};
