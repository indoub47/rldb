import axios from "axios";
//import * as extractMsg from "./functions/extractMsg";
import { REGISTER_BEGIN, REGISTER_SUCCESS, REGISTER_ERROR } from "./types";

export const registerBegin = () => ({
  type: REGISTER_BEGIN
});

export const registerSuccess = () => ({
  type: REGISTER_SUCCESS
});

export const registerError = errors => ({
  type: REGISTER_ERROR,
  payload: {errors}
});

// Register
export const registerUser = (userData, history) => dispatch => {
  dispatch(registerBegin());
  axios
    .post("/api/users/register", userData)
    .then(res => {
      dispatch(registerSuccess());
      history.push("/");
    })
    .catch(err => {
      if (err.response) {
        dispatch(registerError(err.response.data));
      } else {
        dispatch(registerError(err));
      }   
    });
};
