import isEmpty from "../validation/is-empty";
import { SET_CURRENT_USER, LOGIN_BEGIN, LOGIN_ERROR, LOGOUT } from "../actions/types";

const initialState = {
  isAuthenticated: false,
  user: {},
  isBusy: false,
  errors: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOGIN_BEGIN:
      return {
        ...state,
        isBusy: true,
        user: {},
        errors: {},
        isAuthenticated: false
      };

    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
        isBusy: false,
        errors: {}
      };

    case LOGIN_ERROR:
      return {
        ...state,
        isBusy: false,
        user: {},
        errors: action.payload.errors,
        isAuthenticated: false
      };

    case LOGOUT:
      return initialState;
      
    default:
      return state;
  }
}
