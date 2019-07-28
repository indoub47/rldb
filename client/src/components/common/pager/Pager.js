import React from 'react';
// import PropTypes from 'prop-types';
import PagerNav from './components/PagerNav';
import CurrentPageInfo from './components/CurrentPageInfo';
import ItemsPerPageSelector from './components/ItemsPerPageSelector';
import {pagerSettings} from './settings';

const Pager = ({
    firstItemIndex,
    buttons, 
    itemsPerPage,
    onPageChanged, 
    onItemsPerPageChanged, 
    itemCount}) => {

  return (
    <div className="row">
      
      <div className="col-7">
        <PagerNav 
          buttons={buttons} 
          onPageChanged={onPageChanged} 
        />
      </div>

      
      <div className="col-2">
        <ItemsPerPageSelector 
          availableItemsPerPage={pagerSettings.availableItemsPerPage} 
          onItemsPerPageChanged={onItemsPerPageChanged} 
          itemsPerPage={itemsPerPage} 
        />
      </div>

      
      <div className="col-3">
        <CurrentPageInfo 
          firstItemLabel={firstItemIndex + 1} 
          lastItemLabel={Math.min(firstItemIndex + itemsPerPage, itemCount)} 
        />
      </div>
    </div>
  );
};

export default Pager;