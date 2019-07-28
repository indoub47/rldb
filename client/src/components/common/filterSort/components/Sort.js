import React from 'react';
import PropTypes from 'prop-types';
import TextAreaGroup from '../../TextAreaGroup';


const Sort = ({sortText, onChange, clearText, valid}) => {
  return (
    <React.Fragment>
      <h5>
        Sort <button 
          className="btn btn-sm btn-light"
          onClick={clearText}
        >
          Clear
        </button>
      </h5>

      <TextAreaGroup
        name="filter" 
        rows="3"
        onChange={onChange}
        value={sortText}
        valid={valid}
      >
      </TextAreaGroup>
    </React.Fragment>
  );
}

Sort.propTypes = {
  sortText: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  clearText: PropTypes.func.isRequired,
  valid: PropTypes.bool
};

Sort.defaultProps = {
  sortText: ''
};

export default Sort;