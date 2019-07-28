import React from "react";

const actionMap = {
  none: { display: "None", value: "none", classname: "none" },
  ok: { display: "OK", value: "ok", classname: "ok" },
  return: { display: "Return", value: "return", classname: "return" },
  delete: { display: "Delete", value: "delete", classname: "delete" }
};

const Option = ({ action, ind }) => {
  return (
    <option
      key={ind}
      value={actionMap[action].value}
      className={actionMap[action].value}
    >
      {actionMap[action].display}
    </option>
  );
};

const ActionSelector = ({ action, ind, changeAction }) => {
  return (
    <select
      name="action"
      className={"by-option " + action}
      data-ind={ind}
      value={action}
      onChange={changeAction}
      id={"select-action-" + ind}
    >
      {Object.keys(actionMap) 
        .map((ac, nr) => (
          <Option action={ac} ind={nr} key={nr} />
        ))}
    </select>
  );
};

export default ActionSelector;
