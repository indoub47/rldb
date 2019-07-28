import {
  REPORT_BEGIN,
  REPORT_SUCCESS,
  REPORT_ERROR,
  REPORT_ERASE,
  LOGOUT
} from "../actions/types";

const initialState = {
  data: {},
  rtype: "",
  params: null,
  errormsg: null,
  isLoading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    // begin report
    case REPORT_BEGIN:
      return {
        ...state,
        data: {},
        params: action.payload.params,
        errormsg: null,
        isLoading: true
      };

    // report success
    case REPORT_SUCCESS:
      return {
        ...state,
        data: action.payload.report,
        rtype: action.payload.rtype,
        errormsg: null,
        isLoading: false
      };

    // report error
    case REPORT_ERROR:
      // console.log("reducer action.payload.error", action.payload.error);
      return {
        ...state,
        data: {},
        rtype: "",
        errormsg: action.payload.errormsg,
        isLoading: false
      };

    case REPORT_ERASE:
    case LOGOUT:
      // console.log("report reducer erasing report");
      return initialState;

    default:
      return state;
  }
}
