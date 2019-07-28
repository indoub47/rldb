import React from "react";

const IsLoading = props => {
  // rodomas, jeigu props.when yra true arba išvis nėra when
  let display = "none";
  if (!props.hasOwnProperty("when") || props.when === true) {
    display = "block";
  }

  return (
    <div id="overlay" style={{ display }}>
      <div className="loader" />
    </div>
  );
};

export default IsLoading;
