import axios from "axios";
import {
  ITEMS_FETCH_BEGIN,
  ITEMS_FETCH_SUCCESS,
  ITEMS_FETCH_FAILURE,
  ITEM_INSERT_BEGIN,
  ITEM_INSERT_SUCCESS,
  ITEM_INSERT_FAILURE,
  ITEM_INSERT_FAILURE_NO_RETRY,
  ITEM_UPDATE_BEGIN,
  ITEM_UPDATE_SUCCESS,
  ITEM_UPDATE_FAILURE,
  ITEM_UPDATE_FAILURE_NO_RETRY,
  ITEM_DELETE_BEGIN,
  ITEM_DELETE_SUCCESS,
  ITEM_DELETE_FAILURE,
  ITEMS_INVALIDATE,
  ITEMS_FILTERSORT_APPLIED,
  ITEMS_FILTERSORT_APPLY_ERROR,
  ITEM_TOGGLE_FS,
  ITEM_TOGGLE_FS_MANUAL,
  ITEMS_PAGE_CHANGE,
  ITEMS_PER_PAGE_CHANGE,
  ITEM_LIST_HIDE_ALERT,
  ITEM_LIST_SET_ALERT,
  ITEM_EDIT_HIDE_ALERT,
  CURRENT_ITEM_SET_TYPE
} from "./types";
import funcCreator from "./functions/filterSort/itemFilterSort";
import itemSpecific from "../itemSpecific";
import journalSorter from "../utils/journalSorter";

const errors2msgs = errors => {
  return errors.map(e => `id${e.id}-${e.key}: ${e.msg}`);
}

export const setCurrentItemType = itype => dispatch =>
  dispatch({
    type: CURRENT_ITEM_SET_TYPE,
    payload: { itype }
  });

export const setItemListAlert = (itype, msg, type) => ({
    type: ITEM_LIST_SET_ALERT,
    payload: { itype, msg, type }
  });

export const hideItemListAlert = itype => dispatch =>
  dispatch({
    type: ITEM_LIST_HIDE_ALERT,
    payload: { itype }
  });

export const hideItemEditAlert = itype => dispatch =>
  dispatch({
    type: ITEM_EDIT_HIDE_ALERT,
    payload: { itype }
  });

export const pageChange = (pageIndex, itemCount, itype) => dispatch => 
  dispatch({
    type: ITEMS_PAGE_CHANGE,
    payload: { itemCount, pageIndex, itype }
  });

export const itemsPerPageChange = (
  itemsPerPage,
  itemCount,
  itype
) => dispatch =>
  dispatch({
    type: ITEMS_PER_PAGE_CHANGE,
    payload: { itemCount, itemsPerPage, itype }
  });

export const toggleFS = itype => dispatch =>
  dispatch({
    type: ITEM_TOGGLE_FS,
    payload: { itype }
  });

export const toggleFSManual = itype => dispatch =>
  dispatch({
    type: ITEM_TOGGLE_FS_MANUAL,
    payload: { itype }
  });

// apply filter and sort and return result action
const applyFilterSort = (items, filterText, sortText, itype) => {
  try {
    const funcs = funcCreator(filterText, sortText, itype);
    const fsedItems = items.filter(funcs.filter).sort(funcs.sort);
    return {
      type: ITEMS_FILTERSORT_APPLIED,
      payload: { items: fsedItems, filterText, sortText, itype }
    };
  } catch (err) {
    console.error(err);
    return {
      type: ITEMS_FILTERSORT_APPLY_ERROR,
      payload: { errormsg: err.toString(), itype }
    };
  }
};

// just filtersort items
export const filterSortItems = (filterText, sortText, itype) => (
  dispatch,
  getState
) => {
  dispatch(
    applyFilterSort(getState().allItems[itype], filterText, sortText, itype)
  );
};

// fetch items
const fetchItemsBegin = itype => ({
  type: ITEMS_FETCH_BEGIN,
  payload: { itype }
});

const fetchItemsSuccess = (items, itype) => ({
  type: ITEMS_FETCH_SUCCESS,
  payload: { items, itype }
});

const fetchItemsFailure = (errormsg, itype) => ({
  type: ITEMS_FETCH_FAILURE,
  payload: { errormsg, itype }
});

export const fetchItems = itype => (dispatch, getState) => {
  dispatch(fetchItemsBegin(itype));
  let paramsObj = { params: { itype } };
  if (getState().itemsStatus[itype].all) paramsObj.params.all = 1;
  axios
    .get("/api/items", paramsObj)
    .then(res => {
      dispatch(fetchItemsSuccess(res.data, itype));
      refilter(dispatch, getState, itype);
    })
    .catch(err => {
      console.error(err);
      dispatch(fetchItemsFailure(err.toString(), itype))
    });
};

export const invalidateItems = (all, itype) => dispatch => {
  dispatch({
    type: ITEMS_INVALIDATE,
    payload: { all, itype }
  });
};

const refilter = (dispatch, getState, itype) => {
  const fetchedItems = getState().allItems[itype];
  const filterText = getState().itemsFS[itype].filterText;
  const sortText = getState().itemsFS[itype].sortText;
  dispatch(applyFilterSort(fetchedItems, filterText, sortText, itype));
};

// insert item
const itemInsertBegin = itype => ({
  type: ITEM_INSERT_BEGIN,
  payload: { itype }
});

const itemInsertSuccess = (item, itype) => ({
  type: ITEM_INSERT_SUCCESS,
  payload: { item, itype }
});

const itemInsertFailure = (errormsg, itype) => ({
  type: ITEM_INSERT_FAILURE,
  payload: { errormsg, itype }
});

const itemInsertFailureNoRetry = (errormsg, itype) => ({
  type: ITEM_INSERT_FAILURE_NO_RETRY,
  payload: { errormsg, itype }
});

export const insertItem = (main, journal, history, itype) => (dispatch, getState) => {
  dispatch(itemInsertBegin(itype));
  axios
    .put("/api/items/insert", { main, journal, itype })
    .then(res => {
      // suformuojamas pranešimas apie rezultatą
      // console.log("inserting item response", res.data);
      if (res.data.ok) {
        dispatch(setItemListAlert(itype, res.data.msg, "success"));
      } else {
        dispatch(setItemListAlert(itype, res.data.msg, "warning"));
      }

      // pagal rezultatą updateinamas local cache
      if (
        getState().itemsStatus[itype].all ||
        !itemSpecific[itype].panaikinta(res.data.item.main)
      ) {
        // jeigu rodyti visus (ir panaikintus, ir ne) ARBA
        // jeigu buvo sukurtas nepanaikintas -
        // updateinamas local cache ir refilter
        const lastJournalRecord = res.data.item.journal.sort(journalSorter)[res.data.item.journal.length - 1];
        const item = {...lastJournalRecord, ...res.data.item.main};
        dispatch(itemInsertSuccess(item, itype));
        refilter(dispatch, getState, itype);
      } else {
        // jeigu insertintas toks, kurio neturėtų būti local cache,
        // tuomet su local cache nedaroma nieko - nei insertinama, nei refilter
        dispatch(itemInsertSuccess(null, itype));
      }

      // return to list
      history.push(itemSpecific[itype].listPath);
    })
    .catch(err => {
      if (err.response && err.response.data) {
        if (err.response.data.reason === "bad criteria") {
          // "bad criteria" - kartoti nėra prasmės, grįžtama į sąrašą
          dispatch(itemInsertFailureNoRetry(err.response.data.msg, itype));
          history.push(itemSpecific[itype].listPath);
        } else if (err.response.data.reason === "bad draft") {
          // "bad draft" - reikia paredaguoti draft, pasiliekama item edit'e
          // gali perduoti vieną string - msg, o gali perduoti objektų array - errors
          let responseMsg = err.response.data.msg;
          if (err.response.data.errors) {
            responseMsg = errors2msgs(err.response.data.errors);
          }
          dispatch(itemInsertFailure(responseMsg, itype));
        } else {
          console.error(err);
          // kt. - galbūt serverio klaida ar kažkas, apsimoka pamėginti dar kartą
          dispatch(itemInsertFailure(err.response.data.msg, itype));
        }
      } else {
        console.error(err);
        // galbūt serverio klaida ar kažkas, apsimoka pamėginti dar kartą
        dispatch(itemInsertFailure(err.toString(), itype));
      }
    });
};

// edit item
const itemUpdateBegin = itype => ({
  type: ITEM_UPDATE_BEGIN,
  payload: { itype }
});

const itemUpdateSuccess = (item, itype) => ({
  type: ITEM_UPDATE_SUCCESS,
  payload: { item, itype }
});

const itemUpdateFailure = (errormsg, itype) => ({
  type: ITEM_UPDATE_FAILURE,
  payload: { errormsg, itype }
});

const itemUpdateFailureNoRetry = (errormsg, itype) => ({
  type: ITEM_UPDATE_FAILURE_NO_RETRY,
  payload: { errormsg, itype }
});

export const updateItem = (main, journal, history, itype) => (dispatch, getState) => {
  dispatch(itemUpdateBegin(itype));
  axios
    .post("/api/items/update", { main, journal, itype })
    .then(res => {
      // suformuojamas pranešimas apie rezultatą
      if (res.data.ok) {
        dispatch(setItemListAlert(itype, res.data.msg, "success"));
      } else {
        dispatch(setItemListAlert(itype, res.data.msg, "warning"));
      }      

      // pagal rezultatą updateinamas local cache
      if (getState().itemsStatus[itype].all || !itemSpecific[itype].panaikinta(res.data.item.main)) {
        // jeigu rodyti visus (ir panaikintus, ir nepanaikintus)
        // ARBA 
        // jeigu sukurtas nepanaikintas
        // - updateinamas local
        const lastJournalRecord = res.data.item.journal.sort(journalSorter)[res.data.item.journal.length - 1];        
        const item = { ...lastJournalRecord, ...res.data.item.main};
        dispatch(itemUpdateSuccess(item, itype));
      } else {
        // jeigu rodyti tik nepanaikintus
        // o modifikuotas į panaikintą - 
        // jis ištrinamas iš local
        dispatch(itemDeleteSuccess(res.data.item.main.id, itype));
      }

      // refilter local cache
      refilter(dispatch, getState, itype);

      // return to list
      history.push(itemSpecific[itype].listPath);
    })
    .catch(err => {
      if (err.response && err.response.data) {
        if (err.response.data.reason === "bad criteria") {
          // "bad criteria" - kartoti nėra prasmės, grįžtama į sąrašą
          dispatch(itemUpdateFailureNoRetry(err.response.data.msg, itype));
          history.push(itemSpecific[itype].listPath);
        } else if (err.response.data.reason === "bad draft") {
          // "bad draft" - reikia paredaguoti draft, pasiliekama item edit'e
          // gali perduoti vieną string - msg, o gali perduoti objektų array - errors
          let responseMsg = err.response.data.msg;
          if (err.response.data.errors) {
            responseMsg = errors2msgs(err.response.data.errors);
          }
          dispatch(itemUpdateFailure(responseMsg, itype));
        } else {
          console.error(err);
          // kt. - galbūt serverio klaida ar kažkas, apsimoka pamėginti dar kartą
          dispatch(itemUpdateFailure(err.response.data.msg, itype));
        }
      } else {
        console.error(err);
        // galbūt serverio klaida ar kažkas, apsimoka pamėginti dar kartą
        dispatch(itemUpdateFailure(err.toString(), itype));
      }
    });
};

// delete item

const itemDeleteBegin = itype => ({
  type: ITEM_DELETE_BEGIN,
  payload: { itype }
});

const itemDeleteSuccess = (id, itype) => ({
  type: ITEM_DELETE_SUCCESS,
  payload: { id, itype }
});

const itemDeleteFailure = (errormsg, itype, target) => ({
  type: ITEM_DELETE_FAILURE,
  payload: { errormsg, itype, target }
});

export const deleteItem = (itemId, itemV, itype) => (dispatch, getState) => {
  dispatch(itemDeleteBegin(itype));
  axios
    .delete("/api/items/delete", { params: { id: itemId, v: itemV, itype } })
    .then(res => {
      // console.log("res.data", res.data);
      dispatch(setItemListAlert(itype, res.data.msg, "success"));
      // console.log("going to dispatch itemDeleteSucces");
      dispatch(itemDeleteSuccess(res.data.id, itype));
      // console.log("going to refilter");
      refilter(dispatch, getState, itype);
    })
    .catch(err => {
      if (err.response && err.response.data) {
        dispatch(itemDeleteFailure(err.response.data.msg, itype));
      } else {
        console.error(err);
        dispatch(itemDeleteFailure(err.toString(), itype));
      }
    });
};
