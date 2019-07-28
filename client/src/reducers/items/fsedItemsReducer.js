import { 
  ITEMS_FILTERSORT_APPLIED,
  ITEMS_INVALIDATE,
  LOGOUT 
  } from "../../actions/types";
import * as iTypes from "../../itypes";
import getInitialState from "../functions/getInitialState";

const stateObj = {data: [], valid: false};

const initialState = getInitialState(iTypes, stateObj);

export default function(state = initialState, action) {
  switch (action.type) {
    
    case ITEMS_FILTERSORT_APPLIED:
      return {
        ...state,
        [action.payload.itype]: {
          ...state[action.payload.itype],
          data: action.payload.items,
          valid: true
        }
      };
    
    case ITEMS_INVALIDATE:
      return {
        ...state,
        [action.payload.itype]: {
          ...state[action.payload.itype],
          valid: false
        }
      };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
}
