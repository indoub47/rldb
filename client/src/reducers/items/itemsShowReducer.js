import {
  ITEM_TOGGLE_FS,
  ITEM_TOGGLE_FS_MANUAL,
  LOGOUT
} from "../../actions/types";
import * as iTypes from "../../itypes";
import getInitialState from "../functions/getInitialState";

const stateObj = {
  fsOn: false,
  fsManualOn: false
};

const initialState = getInitialState(iTypes, stateObj);

export default function(state = initialState, action) {
  switch (action.type) {
    case ITEM_TOGGLE_FS:
      return {
        ...state,
        [action.payload.itype]: {
          ...state[action.payload.itype],
          fsOn: !state[action.payload.itype].fsOn
        }
      };

    case ITEM_TOGGLE_FS_MANUAL:
      return {
        ...state,
        [action.payload.itype]: {
          ...state[action.payload.itype],
          fsManualOn: !state[action.payload.itype].fsManualOn
        }
      };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
}
