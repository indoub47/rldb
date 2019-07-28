import {
  ITEMS_FETCH_SUCCESS,
  ITEM_INSERT_SUCCESS,
  ITEM_UPDATE_SUCCESS,
  ITEM_DELETE_SUCCESS,
  LOGOUT
} from "../../actions/types";
import * as iTypes from "../../itypes";
import getInitialState from "../functions/getInitialState";

const stateObj = [];

const initialState = getInitialState(iTypes, stateObj);

export default function(state = initialState, action) {
  switch (action.type) {

    // fetch items
    case ITEMS_FETCH_SUCCESS:
      return {
        ...state,
        [action.payload.itype]: action.payload.items
      };

    // create item
    case ITEM_INSERT_SUCCESS:
      if (!action.payload.item) return state;
      return {
        ...state,
        [action.payload.itype]: [
          ...state[action.payload.itype], 
          action.payload.item
        ]
      };

    // edit item
    case ITEM_UPDATE_SUCCESS:
      if (!action.payload || !action.payload.item) return state;
      const updatedItem = action.payload.item;
      const itype = action.payload.itype;
      const allItems = state[itype];
      let ind = allItems.findIndex(x => x.id === updatedItem.id);
      return {
        ...state,
        [itype]: [
          ...allItems.slice(0, ind),
          updatedItem,
          ...allItems.slice(ind + 1)
        ]
      };

    // delete item success
    case ITEM_DELETE_SUCCESS:
      if (action.payload.id == null) return state;
      ind = state[action.payload.itype].findIndex(x => x.id === action.payload.id);
      // console.log("locally found index of id", ind, action.payload.id);
      if (ind < 0) return state; // jeigu kartais nerastų tokio id...
      return {
        ...state,
        [action.payload.itype]: [
          ...state[action.payload.itype].slice(0, ind),
          ...state[action.payload.itype].slice(ind + 1)
        ]
      };


    case LOGOUT:
      return initialState;
    
    default:
      return state;
  }
}
