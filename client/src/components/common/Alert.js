import React from "react";

const Alert = ({ type, message, hide }) => {
  // message - string or array of strings
  if (!message) return null;
  const alertType = type || "error";
  let displayMsg;
  if (typeof message === 'string') {
    displayMsg = message.trim();
    if (!displayMsg) return null;
  } else if (Array.isArray(message)) {
    if (message.length === 0) return null;
    displayMsg = [];
    // create an array in displayMsg:
    // [item0, <br />, item1, <br />, item3]
    message.forEach((item, i) => {
      displayMsg.push(item);
      if (i < message.length-1) {
        displayMsg.push(<br />);
      }
    });
  }

  const classOf = {
    error: "danger",
    danger: "danger",
    red: "danger",
    warning: "warning",
    yellow: "warning",
    success: "success",
    green: "success",
    info: "info",
    lightblue: "info",
    light: "light",
    white: "light",
    primary: "primary",
    blue: "primary",
    secondary: "secondary",
    lightgrey: "secondary",
    dark: "dark",
    grey: "dark",
  }

  const classname = `alert alert-${classOf[alertType]}${hide == null ? " alert-dismissible fade show" : ""}`;
  return (
    <div className={classname} role="alert">
      {displayMsg}
      {hide == null ? null : (
        <button type="button" className="close" onClick={hide}>
          <span>&times;</span>
        </button>
      )}
    </div>
  );
};

export default Alert;
