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
  QUERIES_HIDE_ERROR,
  LOGOUT
} from "../actions/types";
import * as iTypes from "../itypes";
import getInitialState from "./functions/getInitialState";

const stateObj = {
  data: [],
  valid: false,
  isLoading: false,
  error: null,
  successmsg: ""
};

const initialState = getInitialState(iTypes, stateObj);

export default function(state = initialState, action) {
  let itype;
  let query;
  let queries;
  let id;
  let ind;

  switch (action.type) {
    case QUERIES_FETCH_BEGIN:
    case QUERY_UPDATE_BEGIN:
    case QUERY_INSERT_BEGIN:
    case QUERY_DELETE_BEGIN:
      itype = action.payload.itype;
      return {
        ...state,
        [itype]: {
          ...state[itype],
          isLoading: true,
          valid: false,
          error: null,
          successmsg: ""
        }
      };

    case QUERIES_FETCH_SUCCESS:
      itype = action.payload.itype;
      // console.log("queriesReducer queries-fetch-success action.payload.queries", action.payload.queries);
      return {
        ...state,
        [itype]: {
          ...state[itype],
          data: action.payload.queries,
          isLoading: false,
          valid: true,
          error: null,
          successmsg: ""
        }
      };

    case QUERY_UPDATE_SUCCESS:
      // console.log("Q_U_S action", action);
      query = action.payload.query;
      itype = action.payload.itype;
      ind = state[itype].data.findIndex(q => q.id === query.id);

      if (ind < 0) {
        // should not happen
        return {
          ...state,
          [itype]: {
            ...state[itype],
            error: {message: "Įvyko nesuprantama klaida"},
            valid: false,
            isLoading: false,
            successmsg: ""
          }
        };
      }

      queries = [
        ...state[itype].data.slice(0, ind),
        query,
        ...state[itype].data.slice(ind + 1)
      ];

      return {
        ...state,
        [itype]: {
          ...state[itype],
          data: queries,
          isLoading: false,
          error: null,
          valid: true,
          successmsg: "atnaujinta sėkmingai"
        }
      };

    case QUERY_INSERT_SUCCESS:
      // console.log("query_insert_success action.payload", action.payload);
      query = action.payload.query;
      itype = action.payload.itype;

      // console.log("queriesReducer state", state);

      queries = [...state[itype].data, query];
      // console.log("queriesReducer queries", queries);

      return {
        ...state,
        [itype]: {
          ...state[itype],
          data: queries,
          isLoading: false,
          error: null,
          valid: true,
          successmsg: "sukurta sėkmingai"
        }
      };

    case QUERY_DELETE_SUCCESS:
      // console.log("QUERY_DELETE_SUCCESS action", action);
      id = action.payload.id.toString();
      itype = action.payload.itype;
      ind = state[itype].data.findIndex(q => q.id.toString() === id);
      // console.log("QUERY_DELETE_SUCCESS index", ind);

      if (ind < 0) {
        // should not happen
        //console.log("index", ind);
        
        return {
          ...state,
          [itype]: {
            ...state[itype],
            error: {message: "Įvyko nesuprantama klaida"},
            valid: false,
            isLoading: false,
            successmsg: ""
          }
        };
      }

      queries = [
        ...state[itype].data.slice(0, ind),
        ...state[itype].data.slice(ind + 1)
      ];

      return {
        ...state,
        [itype]: {
          ...state[itype],
          data: queries,
          isLoading: false,
          error: null,
          valid: true,
          successmsg: `id ${id} panaikinta sėkmingai`
        }
      };

    case QUERIES_FETCH_FAILURE:
    case QUERY_UPDATE_FAILURE:
    case QUERY_INSERT_FAILURE:
    case QUERY_DELETE_FAILURE:
      itype = action.payload.itype;
      return {
        ...state,
        [itype]: {
          ...state[itype],
          isLoading: false,
          error: action.payload.error,
          successmsg: ""
        }
      };

    case QUERIES_HIDE_ERROR:
      itype = action.payload.itype;
      return {
        ...state,
        [itype]: {
          ...state[itype],
          error: null
        }
      };

    case QUERIES_HIDE_SUCCESS:
      itype = action.payload.itype;
      return {
        ...state,
        [itype]: {
          ...state[itype],
          successmsg: ""
        }
      };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
}
