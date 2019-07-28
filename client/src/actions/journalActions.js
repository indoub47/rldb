import axios from "axios";
//import * as extractMsg from "./functions/extractMsg";
import {
  JOURNAL_FETCH_BEGIN,
  JOURNAL_FETCH_SUCCESS,
  JOURNAL_FETCH_FAILURE,
  JOURNAL_REMOVE,
  JOURNAL_SET
} from "./types";

// fetch journal
const fetchJournalBegin = () => ({
  type: JOURNAL_FETCH_BEGIN
});

const fetchJournalSuccess = journal => ({
  type: JOURNAL_FETCH_SUCCESS,
  payload: { journal }
});

const fetchJournalFailure = errormsg => ({
  type: JOURNAL_FETCH_FAILURE,
  payload: { errormsg }
});

export const fetchJournal = (mainid, itype) => (dispatch, getState) => {
  dispatch(fetchJournalBegin());
  axios
    .get("/api/journal", { params: {mainid, itype} })
    .then(res => {
      dispatch(fetchJournalSuccess(res.data));
    })
    .catch(err => dispatch(fetchJournalFailure(err.message)));
};

export const removeJournal = () => dispatch => {
  dispatch({type: JOURNAL_REMOVE});
};

export const setJournal = journal => dispatch => {
  dispatch({type: JOURNAL_SET, payload: {journal}});
}