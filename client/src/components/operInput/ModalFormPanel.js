import React from 'react';

const ModalFormPanel = ({body, title, submitHandler, cancelHandler, purpose, show}) => {

  return (
    <div 
      className={"operinput my-modal " + purpose} 
      style={show ? {display: "block"} : {display: "none"}} 
      id="form-panel" tabIndex="-1">
        <div className="modal-content">
          <div className="modal-header"> 
            <h5 className="modal-title" id="modal-title">{title}</h5>
            <button type="button" className="reject-button" onClick={cancelHandler}>
              &times;
            </button>
          </div>
          <div className="modal-body">
            {body}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={cancelHandler}>
              Close
            </button>
            <button type="button" className="btn btn-danger" onClick={submitHandler}>
              Submit
            </button>
          </div>
        </div>
    </div>
  );
}

export default ModalFormPanel;