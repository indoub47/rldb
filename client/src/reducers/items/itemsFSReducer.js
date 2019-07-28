import {
  ITEMS_FILTERSORT_APPLIED,
  ITEMS_FILTERSORT_APPLY_ERROR,
  ITEMS_REFRESH,
  LOGOUT
} from "../../actions/types";
import * as iTypes from "../../itypes";
import getInitialState from "../functions/getInitialState";


const stateObj = {
  filterText: "",
  sortText: "",
  errormsg: null
};

const initialState = getInitialState(iTypes, stateObj);

export default function(state = initialState, action) {
  switch (action.type) {
    case ITEMS_FILTERSORT_APPLIED:
      return {
        ...state,
        [action.payload.itype]: {
          filterText: action.payload.filterText,
          sortText: action.payload.sortText,
          errormsg: null
        }
      };

    case ITEMS_FILTERSORT_APPLY_ERROR:
      const obj = {
        ...state[action.payload.itype],
        errormsg: action.payload.errormsg
      };
      return {
        ...state,
        [action.payload.itype]: obj
      };
    
    case ITEMS_REFRESH:
    case LOGOUT:
      return initialState;

    default:
      return state;
  }
}
