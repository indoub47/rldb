import {
  THINGS_FETCH_BEGIN,
  THINGS_FETCH_SUCCESS,
  THINGS_FETCH_FAILURE,
  LOGOUT
} from "../actions/types";

const initialState = {
  data: null,
  isLoading: false,
  errormsg: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case THINGS_FETCH_BEGIN:
      return {
        ...state,
        isLoading: true,
        errormsg: null,
        data: null
      };

    case THINGS_FETCH_SUCCESS:
    
      return {
        ...state,
        isLoading: false,
        errormsg: null,
        data: action.payload.things
      };

    case THINGS_FETCH_FAILURE:
      return {
        ...state,
        isLoading: false,
        errormsg: action.payload.errormsg,
        data: null
      };

    // case THINGS_UPDATE_BEGIN:
    //   return {
    //     ...state,
    //     isLoading: true,
    //     error: null,
    //     data: null
    //   };

    // case THINGS_UPDATE_SUCCESS:
    //   const modifiedData = {
    //     ...state.data,
    //     [action.payload.thingType]: action.payload.things
    //   };
    //   return {
    //     ...state,
    //     isLoading: false,
    //     error: null,
    //     data: modifiedData
    //   };

    // case THINGS_UPDATE_FAILURE:
    //   return {
    //     ...state,
    //     isLoading: false,
    //     error: action.payload.error,
    //     data: null
    //   };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
}
