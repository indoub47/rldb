import React from 'react';
import itemSpecific from "../../itemSpecific";
import journalSorter from "../../utils/journalSorter";

const JournalList = ({jItems, setForEdit, deleteJItem, itype, currentJid, things}) => {

  if (jItems.length < 1) {
    return (
      <div className="container journal-list text-center">
        <div className="alert alert-info">
          No journal as yet
        </div>
      </div>
    );
  }

  const JournalRow = itemSpecific[itype].journalRow;
  const JournalHeadRow = itemSpecific[itype].journalListHead;
  
  const jItemRows = jItems.sort(journalSorter).map((jItem, ind) => 
    <JournalRow
      jItem={jItem} 
      setForEdit={setForEdit}
      deleteJItem={deleteJItem}
      key={jItem.jid}
      current={jItem.jid === currentJid}
      things={things}
    />
  );

  return ( 
    <div className="container journal-list text-center">     
      <table 
        className="table table-sm table-striped table-bordered jitems" style={{fontSize: ".85rem"}}
      >
        <thead>
          {JournalHeadRow()}
        </thead>
        <tbody>
          {jItemRows}
        </tbody>
      </table>
    </div>

  );
}

export default JournalList;