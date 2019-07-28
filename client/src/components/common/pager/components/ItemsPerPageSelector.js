import React from "react";
import PropTypes from "prop-types";
import SelectInputGroup from '../../SelectInputGroup';
import {createOptions} from '../../../createOptions';

const ItemsPerPageSelector = 
({availableItemsPerPage, onItemsPerPageChanged, itemsPerPage}) => {

  const options = 
    createOptions(
      availableItemsPerPage,
      '',
      x => x, 
      x => x, 
      x => x
    );
  


  return (<SelectInputGroup 
      options={options}
      name='items-per-page'
      onChange={onItemsPerPageChanged}
      value={itemsPerPage + ''}
    />);
};

ItemsPerPageSelector.propTypes = {
  availableItemsPerPage: PropTypes.arrayOf(PropTypes.number).isRequired,
  onItemsPerPageChanged: PropTypes.func.isRequired,
  itemsPerPage: PropTypes.number.isRequired
};

export default ItemsPerPageSelector;
