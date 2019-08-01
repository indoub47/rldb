import axios from "axios";
//import * as extractMsg from "./functions/extractMsg";
import {
  THINGS_FETCH_BEGIN,
  THINGS_FETCH_SUCCESS,
  THINGS_FETCH_FAILURE
} from "./types";

export const fetchThingsBegin = () => ({
  type: THINGS_FETCH_BEGIN
});

export const fetchThingsSuccess = things => ({
  type: THINGS_FETCH_SUCCESS,
  payload: { things }
});

export const fetchThingsFailure = errormsg => {
  return {
    type: THINGS_FETCH_FAILURE,
    payload: { errormsg }
  };
};

// Get things for registering user
export const fetchRegisterThings = () => dispatch => {
  dispatch(fetchThingsBegin());
  axios
    .get("/api/things/register")
    .then(res => dispatch(fetchThingsSuccess(res.data)))
    .catch(err => dispatch(fetchThingsFailure(err.message)));
};

// Get all things for all apps
export const fetchAllThings = () => dispatch => {
  dispatch(fetchThingsBegin());
  axios
    .get("/api/things/all")
    .then(res => {
      dispatch(fetchThingsSuccess(res.data.things));
    })
    .catch(err => dispatch(fetchThingsFailure(err.message)));
};
