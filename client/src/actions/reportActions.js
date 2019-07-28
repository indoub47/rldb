import axios from "axios";
//import * as extractMsg from "./functions/extractMsg";
import {
  REPORT_BEGIN,
  REPORT_SUCCESS,
  REPORT_ERROR,
  REPORT_ERASE
} from "./types";
import Reporter from "./reporters/Reporter";

const reportBegin = params => ({
  type: REPORT_BEGIN,
  payload: { params }
});

const reportSuccess = (report, rtype) => ({
  type: REPORT_SUCCESS,
  payload: { report, rtype }
});

const reportFailure = errormsg => ({
  type: REPORT_ERROR,
  payload: { errormsg }
});

export const eraseReport = () => dispatch => {
  // console.log("dispatching erase report");
  dispatch({
    type: REPORT_ERASE
  });
};

export const createReport = (rtype, params) => dispatch => {
  // parinkti reporterį
  const reporter = new Reporter(rtype);
  // console.log("reporter", reporter);
  if (!reporter) {
    dispatch(reportFailure({ errormsg: "Unknown report type" }));
    return;
  }

  dispatch(reportBegin(params));

  // fetch report data async and create report
  axios
    .get(reporter.getUrl(), { params: { ...params } })
    .then(res => {
      const report = reporter.createReport(res.data);
      dispatch(reportSuccess(report, rtype));
    })
    .catch(err => {
      console.error(err);
      dispatch(reportFailure(err));
    });
};
