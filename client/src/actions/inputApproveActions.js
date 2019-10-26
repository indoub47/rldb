import axios from "axios";
import {
  IAPPROVE_FETCH_BEGIN,
  IAPPROVE_FETCH_SUCCESS,
  IAPPROVE_FETCH_FAILURE,
  IAPPROVE_PROCESS_BEGIN,
  IAPPROVE_PROCESS_SUCCESS,
  IAPPROVE_PROCESS_FAILURE,
  IAPPROVE_INFO_REMOVE,
  IAPPROVE_SET_ITEMS
} from "./types";

export const dispatchRemoveInfo = () => dispatch => {
  dispatch({ type: IAPPROVE_INFO_REMOVE });
};

const fetchIApproveBegin = () => ({
  type: IAPPROVE_FETCH_BEGIN
});

const fetchIApproveSuccess = items => ({
  type: IAPPROVE_FETCH_SUCCESS,
  payload: { items }
});

const fetchIApproveFailure = errormsg => ({
  type: IAPPROVE_FETCH_FAILURE,
  payload: { errormsg }
});

export const fetchSuppliedOperInput = itype => dispatch => {
  dispatch(fetchIApproveBegin());
  axios
    .get("/api/operinput/supplied", { params: { itype } })
    .then(res => {
      //console.log("got supplied: ", res.data);
      //const parsed = unpack(res.data, "supplied");
      //console.log("dispatching fetchIApproveSuccess")
      dispatch(fetchIApproveSuccess(res.data));
    })
    .catch(err => {
      console.error(err);
      dispatch(fetchIApproveFailure(err.message));
    });
};

const iApproveProcessBegin = () => ({
  type: IAPPROVE_PROCESS_BEGIN
});

const iApproveProcessSuccess = items => ({
  type: IAPPROVE_PROCESS_SUCCESS,
  payload: { items }
});

const iApproveProcessFailure = errormsg => ({
  type: IAPPROVE_PROCESS_FAILURE,
  payload: { errormsg }
});

export const submitIApprove = (input, itype) => dispatch => {
  /*
  input:
  
  */
  dispatch(iApproveProcessBegin());
  axios
    .post("/api/operinput/process-approved", {
      input: input.filter(i => i.action !== "none"),
      itype
    })
    .then(res => {
      //console.log(res.data);
      dispatch(iApproveProcessSuccess(res.data));
    })
    .catch(err => {
      // to neturėtų būti, nes visos klaidos išgaudomos
      console.error(err);
      dispatch(iApproveProcessFailure(err.message));
    })
    // .finally(() => {
    //   console.log("dispatching fetchSupplied");
    //   fetchSuppliedOperInput(itype);
    // });
};

export const setItems = items => dispatch => {
  dispatch({ type: IAPPROVE_SET_ITEMS, payload: { items } });
};
