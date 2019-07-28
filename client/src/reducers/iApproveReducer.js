import {
  IAPPROVE_FETCH_BEGIN,
  IAPPROVE_FETCH_SUCCESS,
  IAPPROVE_FETCH_FAILURE,
  IAPPROVE_PROCESS_BEGIN,
  IAPPROVE_PROCESS_SUCCESS,
  IAPPROVE_PROCESS_FAILURE,
  IAPPROVE_INFO_REMOVE,
  IAPPROVE_SET_ITEMS,
  LOGOUT
} from "../actions/types";

const stateObj = {
  items: [],
  isLoading: false,
  info: null
};

const initialState = { ...stateObj };

export default function(state = initialState, action) {
  switch (action.type) {
    case IAPPROVE_FETCH_BEGIN:
    case IAPPROVE_PROCESS_BEGIN:
      return {
        ...state,
        info: null,
        isLoading: true
      };

    case IAPPROVE_PROCESS_SUCCESS:
    case IAPPROVE_FETCH_SUCCESS:
      //console.log("action.payload.items", action.payload.items);
      const items = action.payload.items.map(i => ({ ...i, action: "none" }));
      //console.log("items to set store", items);
      return {
        ...state,
        items,
        isLoading: false
      };

    // case IAPPROVE_PROCESS_SUCCESS:
    //   return {
    //     ...state,
    //     isLoading: false,
    //     info: { message: action.payload.info.toString(), type: "info" }
    //   };

    case IAPPROVE_FETCH_FAILURE:
    case IAPPROVE_PROCESS_FAILURE:
      return {
        ...state,
        info: { message: action.payload.errormsg, type: "error" },
        isLoading: false
      };

    case IAPPROVE_INFO_REMOVE:
      return {
        ...state,
        info: null
      };

    case IAPPROVE_SET_ITEMS:
      return {
        ...state,
        items: action.payload.items
      };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
}
