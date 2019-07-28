import {
  JOURNAL_FETCH_BEGIN,
  JOURNAL_FETCH_SUCCESS,
  JOURNAL_FETCH_FAILURE,
  JOURNAL_SET,
  JOURNAL_REMOVE,
  LOGOUT
} from "../actions/types";
//import * as iTypes from "../itypes";
//import getInitialState from "./functions/getInitialState";

const stateObj = {
  items: [],
  isBusy: false,
  errormsg: null
};

const initialState = {...stateObj};

//const initialState = getInitialState(iTypes, stateObj);

export default function(state = initialState, action) {
  switch (action.type) {

    // begin fetch journal
    case JOURNAL_FETCH_BEGIN:
      return {
          items: [],
          isBusy: false,
          errormsg: null
        };

    // journal has been fetched
    case JOURNAL_FETCH_SUCCESS:
      return {
          items: action.payload.journal,
          isBusy: false,
          errormsg: null
        };

    // journal fetch failure
    case JOURNAL_FETCH_FAILURE:
      return {
          items: [],
          isBusy: false,
          errormsg: action.payload.errormsg
        };

    // set journal
    case JOURNAL_SET:
      return {
        items: action.payload.journal,
        isBusy: false,
        errormsg: null
      };

    // remove journal
    case JOURNAL_REMOVE:
      return {
        items: [],
        isBusy: false,
        errormsg: null
      };

    case LOGOUT:
      return initialState;
    
    default:
      return state;
  }
}
