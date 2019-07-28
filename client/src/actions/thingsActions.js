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

// // Get all things for defects
// export const fetchDefectThings = () => dispatch => {
//   dispatch(fetchThingsBegin());
//   axios
//     .get("/api/things/defects")
//     .then(res => dispatch(fetchThingsSuccess(res.data)))
//     .catch(err => dispatch(fetchThingsFailure(err)));
// };

// // Get all things for weldings
// export const fetchWeldingThings = () => dispatch => {
//   dispatch(fetchThingsBegin());
//   axios
//     .get("/api/things/weldings")
//     .then(res => dispatch(fetchThingsSuccess(res.data)))
//     .catch(err => dispatch(fetchThingsFailure(err)));
// };

// Get all things for all apps
export const fetchAllThings = () => dispatch => {
  dispatch(fetchThingsBegin());
  const v = localStorage.getItem("allThingsV") || -1;
  axios
    .get("/api/things/all", {params: {v}} )
    .then(res => {
      if (res.data.things) {
        //console.log("res.data", res.data);
        localStorage.setItem("allThingsV", res.data.v);
        localStorage.setItem("allThings", JSON.stringify(res.data.things));
        dispatch(fetchThingsSuccess(res.data.things));
      } else {
        dispatch(fetchThingsSuccess(JSON.parse(localStorage.getItem("allThings"))));
      }
    })
    .catch(err => dispatch(fetchThingsFailure(err.message)));
};
