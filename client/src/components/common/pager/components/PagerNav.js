import React from "react";
import PropTypes from "prop-types";

const PagerNav = ({buttons, onPageChanged}) => {

  const makeButton = b => {
    // if ellipsis
    if (b.role === "ellipsis-left" || b.role === "ellipsis-right") {
      return (
        <li 
          key={b.role + b.pageIndex} 
          className="page-item ellipsis"
        >
          {b.label}
        </li>
      );
    }

    // if clickable button
    return (
      <li
        key={b.role + b.pageIndex}
        className="page-item"
        onClick={
          b.role !== "current" ? e => onPageChanged(b.pageIndex, e) : null
        }
      >
        <button 
          className={"page-link " + b.role}
          onClick={e => e.preventDefault()}
        >
          {b.label}
        </button>
      </li>
    );
  };

  let navButtons = [];
  buttons.forEach(b => navButtons.push(makeButton(b)));

  return (
    <nav>
      <ul className="pagination">{navButtons}</ul>
    </nav>
  );
};

PagerNav.propTypes = {
  buttons: PropTypes.arrayOf(PropTypes.object).isRequired,
  onPageChanged: PropTypes.func.isRequired
};

export default PagerNav;
