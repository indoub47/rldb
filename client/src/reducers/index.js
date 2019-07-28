import { combineReducers } from "redux";
import thingsReducer from "./thingsReducer";
import loginReducer from "./loginReducer";
import registerReducer from "./registerReducer";
import queriesReducer from "./queriesReducer";
import reportReducer from "./reportReducer";
import journalReducer from "./journalReducer";
import operInputReducer from "./operInputReducer";
import iApproveReducer from "./iApproveReducer";

import allItemsReducer from "./items/allItemsReducer";
import itemAlertingReducer from "./items/itemAlertingReducer";
import itemsFSReducer from "./items/itemsFSReducer";
import itemsPagerReducer from "./items/itemsPagerReducer";
import itemsShowReducer from "./items/itemsShowReducer";
import itemsStatusReducer from "./items/itemsStatusReducer";
import fsedItemsReducer from "./items/fsedItemsReducer";


export default combineReducers({
  login: loginReducer,
  things: thingsReducer,
  register: registerReducer,
  queries: queriesReducer,
  report: reportReducer,
  journal: journalReducer,
  operInput: operInputReducer,
  iApprove: iApproveReducer,

  allItems: allItemsReducer,
  itemAlerting: itemAlertingReducer,
  itemsFS: itemsFSReducer,
  itemsPager: itemsPagerReducer,
  itemsShow: itemsShowReducer,
  itemsStatus: itemsStatusReducer,
  fsedItems: fsedItemsReducer
});
