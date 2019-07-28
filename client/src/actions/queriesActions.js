import axios from "axios";
//import * as extractMsg from "./functions/extractMsg";
import {
  QUERIES_FETCH_BEGIN,
  QUERIES_FETCH_SUCCESS,
  QUERIES_FETCH_FAILURE,
  QUERY_INSERT_BEGIN,
  QUERY_INSERT_SUCCESS,
  QUERY_INSERT_FAILURE,
  QUERY_UPDATE_BEGIN,
  QUERY_UPDATE_SUCCESS,
  QUERY_UPDATE_FAILURE,
  QUERY_DELETE_BEGIN,
  QUERY_DELETE_SUCCESS,
  QUERY_DELETE_FAILURE,
  QUERIES_HIDE_SUCCESS,
  QUERIES_HIDE_ERROR
} from "./types";

const err2msg = err => {
  if (err.response) {
      // Request made and server responded
      if (err.response.data.errors) {
        return err.response.data.errors.map(e => `${e.key} - ${e.msg}`);
      }
      if (err.response.data.msg) {
        return err.response.data.msg;
      };
      return "Kažkokia klaida";
  }  
  // Something happened in setting up the request that triggered an Error
  return 'Error: ' + err.message;
}


export const hideSuccess = itype => dispatch =>
  dispatch({
    type: QUERIES_HIDE_SUCCESS,
    payload: { itype }
  });

export const hideError = itype => dispatch =>
  dispatch({
    type: QUERIES_HIDE_ERROR,
    payload: { itype }
  });

const fetchQueriesBegin = itype => ({
  type: QUERIES_FETCH_BEGIN,
  payload: { itype }
});

const fetchQueriesSuccess = (queries, itype) => ({
  type: QUERIES_FETCH_SUCCESS,
  payload: { queries, itype }
});

const fetchQueriesFailure = (error, itype) => ({
  type: QUERIES_FETCH_FAILURE,
  payload: { error, itype }
});

// Get fsqueries
export const fetchQueries = itype => (dispatch, getState) => {
  dispatch(fetchQueriesBegin(itype));
  axios
    .get(`/api/fsqueries/fetch`, { params: { itype } })
    .then(res => {
      // console.log("state before", getState().queries);
      dispatch(fetchQueriesSuccess(res.data, itype));
      // console.log("state after", getState().queries);
    })
    .catch(err => {
      dispatch(fetchQueriesFailure(err2msg(err), itype));
    });
};

const updateQueryBegin = itype => ({
  type: QUERY_UPDATE_BEGIN,
  payload: { itype }
});

const updateQuerySuccess = (query, itype) => ({
  type: QUERY_UPDATE_SUCCESS,
  payload: { query, itype }
});

const updateQueryFailure = (error, itype) => ({
  type: QUERY_UPDATE_FAILURE,
  payload: { error, itype }
});

// update fsquery
export const updateQuery = draft => dispatch => {
  const itype = draft.itype;
  dispatch(updateQueryBegin(itype));
  axios
    .post(`/api/fsqueries/update`, draft)
    .then(res => dispatch(updateQuerySuccess(res.data, itype)))
    .catch(err => {
      dispatch(updateQueryFailure(err2msg(err), itype));
    });
};

const insertQueryBegin = itype => ({
  type: QUERY_INSERT_BEGIN,
  payload: { itype }
});

const insertQuerySuccess = (query, itype) => ({
  type: QUERY_INSERT_SUCCESS,
  payload: { query, itype }
});

const insertQueryFailure = (error, itype) => ({
  type: QUERY_INSERT_FAILURE,
  payload: { error, itype }
});

// insert fsquery
export const insertQuery = draft => dispatch => {
  const itype = draft.itype;
  dispatch(insertQueryBegin(itype));
  axios
    .put(`/api/fsqueries/insert`, draft)
    .then(res => {
      // console.log("insertQuery action res.data", res.data);
      dispatch(insertQuerySuccess(res.data, itype));
    })
    .catch(err => {
      dispatch(insertQueryFailure(err2msg(err), itype));
    });
};

const deleteQueryBegin = itype => ({
  type: QUERY_DELETE_BEGIN,
  payload: { itype }
});

const deleteQuerySuccess = (id, itype) => {
  //console.log("success", id, itype);
  return {
    type: QUERY_DELETE_SUCCESS,
    payload: { id, itype }
  };
};

const deleteQueryFailure = (error, itype) => {
  // console.log("failure", errormsg, itype);
  return {
    type: QUERY_DELETE_FAILURE,
    payload: { error, itype }
  };
};

// delete fsquery
export const deleteQuery = (id, itype) => dispatch => {
  dispatch(deleteQueryBegin(itype));
  axios
    .delete(`/api/fsqueries/delete`, { params: { id } })
    .then(res => {
      //console.log("res.data", res.data);      
      dispatch(deleteQuerySuccess(res.data.id, itype))
    })
    .catch(err => {
      dispatch(deleteQueryFailure(err2msg(err), itype));
    });
};
