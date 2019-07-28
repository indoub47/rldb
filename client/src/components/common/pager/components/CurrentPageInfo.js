import React from "react";
import PropTypes from "prop-types";

const CurrentPageInfo = ({firstItemLabel, lastItemLabel}) => {
  // // console.log("CurrentPageInfo firstItemLabel, lastItemLabel", firstItemLabel, lastItemLabel);
  return (
    <div className="alert alert-info" role="alert">
      Items: {firstItemLabel}-{lastItemLabel}
    </div>
  );
};

CurrentPageInfo.propTypes = {
  firstItemLabel: PropTypes.number.isRequired,
  lastItemLabel: PropTypes.number.isRequired
};

export default CurrentPageInfo;
