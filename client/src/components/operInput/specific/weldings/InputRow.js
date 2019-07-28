import React from "react";
import {
  getOperApar,
  getVietosKodas
} from "../functions";

const InputRow = ({ ind, inputItem, setItemEdit, deleteItem, copyItem, isCurrent }) => {
  const main = inputItem.main;
  const journal = inputItem.journal;
  return (
    <tr className={isCurrent ? "current" : undefined}>      
      <td className="id">{main.id}</td>
      <td className="vbudas">{main.vbudas}</td>
      <td className="data0">{main.data0}</td>  
      <td className="vk vieta">{getVietosKodas(main)}</td>  
      <td className="virino">{main.virino}</td>
      <td className="data">{journal.data}</td> 
      <td className="oper-apar">{getOperApar(journal)}</td>
      <td className="pvd">{journal.pvd}</td>
      <td className="note">{journal.note}</td>
      <td>
        <div className="button-group">
          <button
            className="btn btn-xs btn-warning"
            data-ind={ind}
            onClick={setItemEdit}
          >
            <i className="fas fa-edit" data-ind={ind} />
          </button>
          <button
            className="btn btn-xs btn-info"
            data-ind={ind}
            onClick={copyItem}
          >
            <i className="fas fa-copy" data-ind={ind} />
          </button>
          <button
            className="btn btn-xs btn-danger"
            data-ind={ind}
            onClick={deleteItem}
          >
            <i 
              className="fas fa-trash-alt" 
              data-ind={ind}
            />
          </button>
        </div>
      </td>
    </tr>
  );
}

const InputHeadRow = () => {
  return (
    <tr>   
      <th className="id">ID</th>
      <th className="vbudas">Būdas</th>
      <th className="data0">Virinimo data</th>
      <th className="vk vieta">Vietos kodas</th>
      <th className="virino">Kas virino</th>
      <th className="data">Tikrinimo data</th>
      <th className="oper-apar">Oper-Apar</th>
      <th className="pvd">Pavadinimas</th>
      <th className="note">Pastaba</th>
      <th className="controls">Controls</th>
    </tr>
  );
};

export { InputRow, InputHeadRow };
