import React from 'react';
import PropTypes from 'prop-types';
import TextAreaGroup from '../../TextAreaGroup';

const Filter = ({filterText, onChange, clearText, valid}) => {
  return (
    <React.Fragment>
      <h5>
        Filter <button 
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
        value={filterText}
        valid={valid}
      >
      </TextAreaGroup>
    </React.Fragment>
  );
}

Filter.propTypes = {
  filterText: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  clearText: PropTypes.func.isRequired,
  valid: PropTypes.bool
};

Filter.defaultProps = {
  filterText: ''
};

export default Filter;