import {
  ITEM_DELETE_BEGIN,
  ITEM_DELETE_FAILURE,
  ITEM_DELETE_SUCCESS,

  ITEM_INSERT_BEGIN,
  ITEM_INSERT_FAILURE,
  ITEM_INSERT_FAILURE_NO_RETRY,
  ITEM_INSERT_SUCCESS,

  ITEM_UPDATE_BEGIN,
  ITEM_UPDATE_FAILURE,
  ITEM_UPDATE_FAILURE_NO_RETRY,
  ITEM_UPDATE_SUCCESS,

  ITEMS_FETCH_BEGIN,
  ITEMS_FETCH_FAILURE,
  ITEMS_FETCH_SUCCESS,

  ITEMS_INVALIDATE,
  LOGOUT
} from "../../actions/types";
import * as iTypes from "../../itypes";
import getInitialState from "../functions/getInitialState";

const stateObj = {
  isBusy: false,
  all: false
};

const initialState = getInitialState(iTypes, stateObj);

export default function(state = initialState, action) {
  switch (action.type) {
    case ITEMS_FETCH_BEGIN:
    case ITEM_INSERT_BEGIN:
    case ITEM_UPDATE_BEGIN:
    case ITEM_DELETE_BEGIN:
      return {
        ...state,
        [action.payload.itype]: {
          ...state[action.payload.itype],
          isBusy: true
        }
      };

    case ITEMS_FETCH_SUCCESS:
    case ITEM_INSERT_SUCCESS:
    case ITEM_UPDATE_SUCCESS:
    case ITEM_DELETE_SUCCESS:
    case ITEMS_FETCH_FAILURE:
    case ITEM_DELETE_FAILURE:
    case ITEM_UPDATE_FAILURE_NO_RETRY:
    case ITEM_INSERT_FAILURE_NO_RETRY:
    case ITEM_UPDATE_FAILURE:
    case ITEM_INSERT_FAILURE:
      return {
        ...state,
        [action.payload.itype]: {
          ...state[action.payload.itype],
          isBusy: false
        }
      };

    case ITEMS_INVALIDATE:
      return {
        ...state,
        [action.payload.itype]: {
          ...state[action.payload.itype],
          all: action.payload.all
        }
      };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
}
