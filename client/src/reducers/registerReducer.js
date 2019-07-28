import {
  REGISTER_BEGIN, REGISTER_SUCCESS, REGISTER_ERROR, LOGOUT
} from "../actions/types";

const initialState = {
  isBusy: false,
  errors: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case REGISTER_BEGIN:
      return {
        ...state,
        isBusy: true,
        errors: {}
      };

    case REGISTER_SUCCESS:
      return {
        ...state,
        isBusy: false,
        errors: {}
      };

    case REGISTER_ERROR:
      return {
        ...state,
        isBusy: false,
        errors: action.payload.errors
      };
    
    case LOGOUT:
      return initialState;

    default:
      return state;
  }
}
