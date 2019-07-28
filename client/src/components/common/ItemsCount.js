import React from 'react';
import PropTypes from 'prop-types';

const ItemsCount = ({total, inView}) => {
  return (
    <div className="alert alert-info" role="alert">
      {total} items total, {inView} items in this view
    </div>
  );
}

ItemsCount.propTypes = {
  total: PropTypes.number.isRequired,
  inView: PropTypes.number.isRequired
};

ItemsCount.defaultProps = {
  total: 0,
  inView: 0
};

export default ItemsCount;