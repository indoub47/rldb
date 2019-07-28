import React from 'react';
import itemSpecific from "./itemSpecific";
import Alert from "../common/Alert";

const ListPanel = ({inputItems, itype, newInputHandler, sendHandler, clearHandler, setItemEditHandler, deleteItemHandler, currentId, info}) => {
  
  const InputRow = itemSpecific[itype].inputRow.InputRow;
  const InputHeadRow = itemSpecific[itype].inputRow.InputHeadRow;
  
  const inputRows = inputItems.map((iItem, ind) => 
    <InputRow
      inputItem={iItem} 
      setItemEdit={setItemEditHandler}
      deleteItem={deleteItemHandler}
      key={iItem.id}
      isCurrent={iItem.id === currentId}
    />
  );

  return (
    <div className="container oper-input-panel">
      {info &&
      <div className="row info-row">
        <div className="col-12">
          <Alert message={info.message} type={info.style} />
        </div>
      </div>}
      <div className="row table-row">
        <div className="col-12">
          <table className="table table-sm table-striped table-bordered items">
            <thead><InputHeadRow /></thead>
            <tbody>{inputRows}</tbody>
          </table>
        </div>
      </div>
      <div className="row button-row">  
        <div className="col-12">    
          <button type="button" className="btn btn-primary" onClick={newInputHandler}>
            New Input
          </button>      
          <button type="button" className="btn btn-secondary" onClick={sendHandler}>
            Send
          </button>
          <button type="button" className="btn btn-warning" onClick={clearHandler}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

export default ListPanel;