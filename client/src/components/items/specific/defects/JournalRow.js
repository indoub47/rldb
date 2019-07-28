import React from "react";

const JournalRow = ({ jItem, setForEdit, deleteJItem, current }) => {
  return (
    <tr className={current ? "current" : undefined}>
      <td className="id">{jItem.jid}</td>
      <td className="data">{jItem.data}</td>
      <td className="oper">{jItem.oper}</td>
      <td className="apar">{jItem.apar}</td>
      <td className="kodas">{jItem.kodas}</td>
      <td className="dl text-right">{jItem.dl}</td>
      <td className="dh text-right">{jItem.dh}</td>
      <td className="pavoj">{jItem.pavoj}</td>
      <td className="dtermin">{jItem.dtermin}</td>
      <td className="note">{jItem.note}</td>
      <td>
        <div className="button-group">
          <button
            className="btn btn-xs btn-warning"
            data-jid={jItem.jid}
            onClick={setForEdit}
          >
            <i className="fas fa-edit" data-jid={jItem.jid} />
          </button>
          <button
            className="btn btn-xs btn-danger"
            data-jid={jItem.jid}
            onClick={deleteJItem}
          >
            <i 
              className="fas fa-trash-alt" 
              data-jid={jItem.jid}
            />
          </button>
        </div>
      </td>
    </tr>
  );
}

const JournalHeadRow = () => {
  return (
    <tr>
      <th className="id">id</th>
      <th className="data">data</th>
      <th className="oper">oper</th>
      <th className="apar">apar</th>
      <th className="kodas">kodas</th>
      <th className="dl">dl</th>
      <th className="dh">dh</th>
      <th className="pavoj">pavoj</th>
      <th className="dtermin">dtermin</th>
      <th className="note">note</th>
      <th className="controls">controls</th>
    </tr>
  );
};

export { JournalRow, JournalHeadRow };
