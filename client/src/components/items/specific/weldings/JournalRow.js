import React from "react";

const JournalRow = ({ jItem, setForEdit, deleteJItem, current, things }) => {
  return (
    <tr className={current ? "current" : undefined}>
      <td className="id">{jItem.jid}</td>
      <td className="data">{jItem.data}</td>
      <td className="oper">{jItem.oper}</td>
      <td className="apar">{jItem.apar}</td>
      <td className="pvd">{things.vpvd.find(th => th.pvdid === jItem.pvd).pvdname}</td>
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
      <th className="pvd">pavadinimas</th>
      <th className="note">pastaba</th>
      <th className="controls">controls</th>
    </tr>
  );
};

export { JournalRow, JournalHeadRow };
