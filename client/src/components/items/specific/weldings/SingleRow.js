import React from "react";

const ItemRow = ({ item, editItem, deleteItem }) => {
  return (
    <tr>
      <td className="regbit">{item.regbit}</td>
      <td className="id text-right">{item.id}</td>
      <td className="oldid text-right">{item.oldid}</td>
      <td className="data">{item.data0}</td>
      <td className="virino">{item.virino}</td>
      <td className="vbudas">{item.vbudas}</td>
      <td className="linija">{item.linija}</td>
      <td className="kelias">{item.kelias}</td>
      <td className="km text-right">{item.km}</td>
      <td className="pk text-right">{item.pk}</td>
      <td className="m text-right">{item.m}</td>
      <td className="siule">{item.siule}</td>
      <td className="suvnr">{item.suvnr}</td>
      <td className="nrschema">{item.nrschema}</td>
      <td className="data">{item.data}</td>
      <td className="pvd">{item.pvd}</td>
      <td className="oper">{item.oper}</td>
      <td className="apar">{item.apar}</td>
      <td className="dstop">{item.dstop}</td>
      <td className="pastaba">{item.note}</td>
      <td>
        <div className="button-group">
          <button
            className="btn btn-xs btn-warning"
            data-id={item.id}
            onClick={editItem}
          >
            <i className="fas fa-edit" data-id={item.id} />
          </button>
          <button
            className="btn btn-xs btn-danger"
            data-id={item.id}
            data-v={item.v}
            onClick={deleteItem}
          >
            <i 
              className="fas fa-trash-alt" 
              data-id={item.id}
              data-v={item.v} 
            />
          </button>
        </div>
      </td>
    </tr>
  );
}

const ItemHeadRow = () => {
  return (
    <tr>
      <th className="region">regbit</th>
      <th className="id">id</th>
      <th className="oldid">oldid</th>
      <th className="data">data0</th>
      <th className="virino">virino</th>
      <th className="vbudas">vbudas</th>
      <th className="linija">linija</th>
      <th className="kelias">kelias</th>
      <th className="km">km</th>
      <th className="pk">pk</th>
      <th className="m">m</th>
      <th className="siule">siule</th>
      <th className="suvnr">suvnr</th>
      <th className="nrschema">nrschema</th>
      <th className="data">data</th>
      <th className="pvd">pvd</th>
      <th className="oper">oper</th>
      <th className="apar">apar</th>
      <th className="dstop">dstop</th>
      <th className="note">note</th>
      <th className="controls">controls</th>
    </tr>
  );
};

export { ItemRow, ItemHeadRow };
