import {
  UNAPPROVED_FETCH_BEGIN,
  UNAPPROVED_FETCH_SUCCESS,
  UNAPPROVED_FETCH_FAILURE,
  OPERINPUT_SUPPLY_BEGIN,
  OPERINPUT_SUPPLY_SUCCESS,
  OPERINPUT_SUPPLY_FAILURE,
  OPERINPUT_ITEMS_SEARCH_BEGIN,
  OPERINPUT_ITEMS_SEARCH_SUCCESS,
  OPERINPUT_ITEMS_SEARCH_FAILURE,
  OPERINPUT_CLEAR,
  OPERINPUT_INFO_REMOVE,
  OPERINPUT_SEARCH_INFO_REMOVE,
  OPERINPUT_SET_ITEMS,
  LOGOUT
} from "../actions/types";

const stateObj = {
  items: [],
  foundItems: [],
  isLoading: false,
  info: null,
  searchInfo: null
};

const initialState = { ...stateObj };

export default function(state = initialState, action) {
  switch (action.type) {
    case UNAPPROVED_FETCH_BEGIN:
    case OPERINPUT_SUPPLY_BEGIN:
      return {
        ...state,
        info: null,
        isLoading: true
      };

    case OPERINPUT_ITEMS_SEARCH_BEGIN:
      return {
        ...state,
        searchInfo: null,
        isLoading: true
      };

    case OPERINPUT_SET_ITEMS:
      return {
        ...state,
        items: action.payload.items
      };

    case UNAPPROVED_FETCH_SUCCESS:
      const items = action.payload.items;
      return {
        ...state,
        items,
        isLoading: false
      };

    case OPERINPUT_ITEMS_SEARCH_SUCCESS:
      return {
        ...state,
        foundItems: action.payload.items,
        isLoading: false
      };

    case OPERINPUT_SUPPLY_SUCCESS:
      return {
        ...state,
        items: [],
        isLoading: false,
        info: { message: "Įrašai sėkmingai pateikti", type: "success" }
      };

    case UNAPPROVED_FETCH_FAILURE:
    case OPERINPUT_SUPPLY_FAILURE:
      return {
        ...state,
        info: { message: action.payload.errormsg, type: "error" },
        isLoading: false
      };

    case OPERINPUT_ITEMS_SEARCH_FAILURE:
      return {
        ...state,
        foundItems: [],
        searchInfo: { message: action.payload.msg, type: action.payload.type },
        isLoading: false
      };

    case OPERINPUT_CLEAR:
      return {
        ...state,
        items: []
      };

    case OPERINPUT_INFO_REMOVE:
      return {
        ...state,
        info: null
      };

    case OPERINPUT_SEARCH_INFO_REMOVE:
      return {
        ...state,
        searchInfo: null
      };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
}
