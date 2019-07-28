import React from 'react';
import itemSpecific from "./itemSpecific";
import Alert from "../common/Alert";

const SearchPanel = ({foundItems, itype, setItemEditHandler, newSearchHandler, info, hideInfo}) => {
  
  const SearchHeadRow = itemSpecific[itype].searchResultRow.SearchHeadRow;
  const FoundItemRow = itemSpecific[itype].searchResultRow.FoundItemRow;
  
  const foundItemRows = foundItems.map((fItem, ind) => 
    <FoundItemRow
      ind={ind}
      foundItem={fItem} 
      setItemEdit={setItemEditHandler}
      key={fItem.id}
    />
  );

  return (
    <div className="container search-panel">
      {info &&
      <div className="row info-row">
        <div className="col-12">
          <Alert 
            message={info.message} 
            type={info.type}
            hide={hideInfo} 
          />
        </div>
      </div>}
      <div className="row button-row">  
        <div className="col-12"> 
          <button type="button" className="btn btn-warning" onClick={newSearchHandler}>
            New Search
          </button>
        </div>
      </div>
      <div className="row table-row">
        <div className="col-12">
          <table className="table table-sm table-striped table-bordered items">
            <thead><SearchHeadRow /></thead>
            <tbody>{foundItemRows}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SearchPanel;