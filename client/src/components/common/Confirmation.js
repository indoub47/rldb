import React from 'react';

const Confirmation = ({body, title, confirmHandler, rejectHandler, show}) => {

  return (
    <div 
      className="my-modal" 
      style={show ? {display: "block"} : {display: "none"}} 
      id="confirmation-modal" tabIndex="-1">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="confirmationTitle">{title}</h5>
            <button type="button" className="reject-button" onClick={rejectHandler}>
              &times;
            </button>
          </div>
          <div className="modal-body">
            {body}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={rejectHandler}>
              Close
            </button>
            <button type="button" className="btn btn-danger" onClick={confirmHandler}>
              Confirm
            </button>
          </div>
        </div>
    </div>
  );
}

export default Confirmation;

