import {
  ITEM_DELETE_BEGIN,
  ITEM_DELETE_FAILURE,

  ITEM_INSERT_BEGIN,
  ITEM_INSERT_FAILURE,
  ITEM_INSERT_FAILURE_NO_RETRY,

  ITEM_UPDATE_BEGIN,
  ITEM_UPDATE_FAILURE,
  ITEM_UPDATE_FAILURE_NO_RETRY,
  QUERIES_FETCH_FAILURE,

  ITEMS_FETCH_BEGIN,
  ITEMS_FETCH_FAILURE,

  ITEM_LIST_SET_ALERT,
  ITEM_LIST_HIDE_ALERT,
  ITEM_EDIT_SET_ALERT,
  ITEM_EDIT_HIDE_ALERT,

  LOGOUT
} from "../../actions/types";
import * as iTypes from "../../itypes";
import getInitialState from "../functions/getInitialState";

const stateObj = {
  itemEdit: {
    fatal: null,
    info: null
  }, 
  itemList: {
    fatal: null,
    info: null
  }
};

const initialState = getInitialState(iTypes, stateObj);

export default function(state = initialState, action) {
  switch (action.type) {
    case ITEMS_FETCH_BEGIN:
    case ITEM_INSERT_BEGIN:
    case ITEM_UPDATE_BEGIN:
    case ITEM_DELETE_BEGIN:
    case LOGOUT:
      return initialState;

    case ITEMS_FETCH_FAILURE:
    case QUERIES_FETCH_FAILURE:    
      return {
        ...state,
        [action.payload.itype]: {
          ...state[action.payload.itype], 
          itemList: {
            fatal: {msg: action.payload.errormsg, type: "error"},
            info: null
          }
        }
      };

    case ITEM_DELETE_FAILURE:
    case ITEM_UPDATE_FAILURE_NO_RETRY:
    case ITEM_INSERT_FAILURE_NO_RETRY:
      return {
        ...state,
        [action.payload.itype]: {
          ...state[action.payload.itype],  
          itemList: {
            fatal: null,
            info: {msg: action.payload.errormsg, type: "error"}
          }
        }
      };

    case ITEM_UPDATE_FAILURE:
    case ITEM_INSERT_FAILURE:
      return {
        ...state,
        [action.payload.itype]: {
          ...state[action.payload.itype],
          itemEdit: {
            fatal: null,
            info: {msg: action.payload.errormsg, type: "error"}
          }
        }
      };

    case ITEM_LIST_SET_ALERT:
      return {
        ...state,
        [action.payload.itype]: {
          ...state[action.payload.itype],  
          itemList: {
            fatal: null,
            info: {msg: action.payload.msg, type: action.payload.type}
          }
        }
      };

    case ITEM_LIST_HIDE_ALERT:
      return {
        ...state,
        [action.payload.itype]: {
          ...state[action.payload.itype],
          itemList: {
            fatal: null,
            info: null
          },
        }
      };

    case ITEM_EDIT_SET_ALERT:
      return {
        ...state,
        [action.payload.itype]: {
          ...state[action.payload.itype],  
          itemEdit: {
            fatal: null,
            info: {msg: action.payload.msg, type: action.payload.type}
          }
        }
      };

    case ITEM_EDIT_HIDE_ALERT:
      return {
        ...state,
        [action.payload.itype]: {
          ...state[action.payload.itype],
          itemEdit: {
            fatal: null,
            info: null
          },
        }
      };

    default:
      return state;
  }
}
