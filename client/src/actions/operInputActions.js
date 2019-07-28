import axios from "axios";
import {
  UNAPPROVED_FETCH_BEGIN,
  UNAPPROVED_FETCH_SUCCESS,
  UNAPPROVED_FETCH_FAILURE,
  OPERINPUT_SUPPLY_BEGIN,
  OPERINPUT_SUPPLY_SUCCESS,
  OPERINPUT_SUPPLY_FAILURE,
  OPERINPUT_ITEMS_SEARCH_BEGIN,
  OPERINPUT_ITEMS_SEARCH_SUCCESS,
  OPERINPUT_ITEMS_SEARCH_FAILURE,
  OPERINPUT_CLEAR,
  OPERINPUT_INFO_REMOVE,
  OPERINPUT_SEARCH_INFO_REMOVE,
  OPERINPUT_SET_ITEMS
} from "./types";
import { unpack } from "./functions/unpack";

export const setItems = items => dispatch => {
  dispatch({ type: OPERINPUT_SET_ITEMS, payload: { items } });
};

export const removeInfo = () => dispatch => {
  dispatch({ type: OPERINPUT_INFO_REMOVE });
};

export const removeSearchInfo = () => dispatch => {
  dispatch({ type: OPERINPUT_SEARCH_INFO_REMOVE });
};

const unapprovedFetchBegin = () => ({
  type: UNAPPROVED_FETCH_BEGIN
});

const unapprovedFetchSuccess = items => ({
  type: UNAPPROVED_FETCH_SUCCESS,
  payload: { items }
});

const unapprovedFetchFailure = errormsg => ({
  type: UNAPPROVED_FETCH_FAILURE,
  payload: { errormsg }
});

export const fetchUnapprovedOperInput = itype => dispatch => {
  dispatch(unapprovedFetchBegin());
  const paramsObj = { params: { itype } };
  axios
    .get("/api/operinput/unapproved", paramsObj)
    .then(res => {
      //console.log("unapproved response", res.data);
      const parsed = unpack(res.data, "unapproved");
      //console.log("unapproved parsed", parsed);
      dispatch(unapprovedFetchSuccess(parsed));
    })
    .catch(err => {
      console.error(err);
      dispatch(unapprovedFetchFailure(err.message));
    });
};

const searchItemsBegin = () => ({
  type: OPERINPUT_ITEMS_SEARCH_BEGIN
});

const searchItemsSuccess = items => ({
  type: OPERINPUT_ITEMS_SEARCH_SUCCESS,
  payload: { items }
});

const searchItemsFailure = (msg, type) => ({
  type: OPERINPUT_ITEMS_SEARCH_FAILURE,
  payload: { msg, type }
});

export const searchItems = (itype, filter) => dispatch => {
  dispatch(removeSearchInfo());
  dispatch(searchItemsBegin());
  axios
    .get("/api/items/search/location", { params: { itype, ...filter } })
    .then(res => {
      dispatch(searchItemsSuccess(res.data));
    })
    .catch(err => {
      let msg;
      let type = "error";
      if (err.response && err.response.data) {
        if (err.response.data.ok) type = "info";
        msg = err.response.data.msg;
      } else {
        console.error(err);
        msg = err.toString();
      }
      dispatch(searchItemsFailure(msg, type));
    });
};

const operInputSupplyBegin = () => ({
  type: OPERINPUT_SUPPLY_BEGIN
});

const operInputSupplySuccess = () => ({
  type: OPERINPUT_SUPPLY_SUCCESS
});

const operInputSupplyFailure = errormsg => ({
  type: OPERINPUT_SUPPLY_FAILURE,
  payload: { errormsg }
});

export const supplyOperInput = (input, itype) => dispatch => {
  dispatch(operInputSupplyBegin());
  axios
    .post("/api/operinput/supply", { input, itype })
    .then(res => {
      dispatch(operInputSupplySuccess());
    })
    .catch(err => {
      console.error(err);
      dispatch(operInputSupplyFailure(err.message));
    });
};

export const clearOperInput = () => dispatch => {
  dispatch({ type: OPERINPUT_CLEAR });
};