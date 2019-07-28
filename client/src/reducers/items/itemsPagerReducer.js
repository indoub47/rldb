import {
  ITEMS_PAGE_CHANGE,
  ITEMS_PER_PAGE_CHANGE,
  ITEMS_FILTERSORT_APPLIED,
  ITEMS_REFRESH,
  LOGOUT
} from "../../actions/types";
import getPagerObj from '../functions/getPagerObj';
import * as iTypes from "../../itypes";
import getInitialState from "../functions/getInitialState";

const stateObj = {
  itemsPerPage: 0,
  currPageIndex: 0,
  firstItemIndex: 0,
  buttons: [],
};

const initialState = getInitialState(iTypes, stateObj);

export default function(state = initialState, action) {
  var pagerObj;
  switch (action.type) {

    case ITEMS_PAGE_CHANGE:
      if (action.payload.pageIndex === 
      state[action.payload.itype].currPageIndex) {
        // tas neturėtų įvykti, nes knopkė su currentPage yra neaktyvi
        return state;
      }

      pagerObj = getPagerObj(
        state[action.payload.itype].itemsPerPage, 
        action.payload.itemCount,
        action.payload.pageIndex);
      return {
        ...state,
        [action.payload.itype]: pagerObj
      };


    case ITEMS_PER_PAGE_CHANGE:
      if (action.payload.itemsPerPage === state[action.payload.itype].itemsPerPage) {
        return state;
      }
      pagerObj = getPagerObj(
        action.payload.itemsPerPage, 
        action.payload.itemCount, 
        0);
      return {
        ...state,
        [action.payload.itype]: pagerObj
      };

    case ITEMS_FILTERSORT_APPLIED: 
      pagerObj = getPagerObj(10, action.payload.items.length, 0);
      return {
        ...state,
        [action.payload.itype]: pagerObj
      };

    case ITEMS_REFRESH:
    case LOGOUT: 
      return initialState;

    default:
      return state;
  }
}

