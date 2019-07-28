import React from "react";
import {
  getOperApar, 
  getHL, 
  getVietosKodas, 
  getBegis
} from "../functions";

const InputRow = ({ ind, inputItem, setItemEdit, deleteItem, copyItem, isCurrent }) => {
  const main = inputItem.main;
  const journal = inputItem.journal;
  return (
    <tr className={isCurrent ? "current" : undefined}>      
      <td className="id">{main.id}</td>
      <td className="meistrija vieta">{main.meistrija}</td>
      <td className="vk vieta">{getVietosKodas(main)}</td>      
      <td className="oper-apar">{getOperApar(journal)}</td>
      <td className="begis">{getBegis(main)}</td>
      <td className="data def">{journal.data}</td>
      <td className="kodas def">{journal.kodas}</td>
      <td className="hl">{getHL(journal)}</td>
      <td className="kkateg def">{main.kkateg}</td>
      <td className="pavoj def">{journal.pavoj}</td>
      <td className="dtermin def">{journal.dtermin}</td>
      <td className="note">{journal.note}</td>

      {/*<td className="id">{inputItem.main.id}</td>
      <td className="meistrija vieta">{inputItem.main.meistrija}</td>
      <td className="linija vieta">{inputItem.main.linija}</td>
      <td className="kelias vieta">{inputItem.main.kelias}</td>
      <td className="km text-right vieta">{inputItem.main.km}</td>
      <td className="pk text-right vieta">{inputItem.main.pk}</td>
      <td className="m text-right vieta">{inputItem.main.m}</td>
      <td className="siule vieta">{inputItem.main.siule}</td>
      <td className="btipas begis">{inputItem.main.btipas}</td>
      <td className="bgamykl begis">{inputItem.main.bgamykl}</td>
      <td className="bmetai begis">{inputItem.main.bmetai}</td>
      <td className="oper">{inputItem.journal.oper}</td>
      <td className="apar">{inputItem.journal.apar}</td>
      <td className="data">{inputItem.journal.data}</td>
      <td className="kodas def">{inputItem.journal.kodas}</td>
      <td className="dl text-right def">{inputItem.journal.dl}</td>
      <td className="dh text-right def">{inputItem.journal.dh}</td>
      <td className="kkateg">{inputItem.main.kkateg}</td>
      <td className="pavoj def">{inputItem.journal.pavoj}</td>
      <td className="dtermin def">{inputItem.journal.dtermin}</td>
      <td className="note">{inputItem.journal.note}</td>*/}
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
      <th className="meistrija vieta">Meistrija</th>
      <th className="vk vieta">Vietos kodas</th>
      <th className="oper-apar">Oper-Apar</th>
      <th className="begis">Bėgis</th>
      <th className="data def">Data</th>
      <th className="kodas def">Kodas</th>
      <th className="hl">H/L</th>
      <th className="kkateg def">KKateg</th>
      <th className="pavoj def">Pavoj</th>
      <th className="dtermin def">Terminas</th>
      <th className="note">Pastaba</th>
      <th className="controls">Controls</th>

      {/*<th className="id">ID</th>
      <th className="meistrija vieta">Meistrija</th>
      <th className="linija vieta">Linija</th>
      <th className="kelias vieta">Kelias</th>
      <th className="km vieta">Km</th>
      <th className="pk vieta">Pk</th>
      <th className="m vieta">M</th>
      <th className="siule vieta">Siūlė</th>
      <th className="btipas begis">BTipas</th>
      <th className="bgamykl begis">BGamykl</th>
      <th className="bmetai begis">BMetai</th>
      <th className="oper">Oper</th>
      <th className="apar">Apar</th>
      <th className="data">Data</th>
      <th className="kodas def">DKodas</th>
      <th className="dl def">L</th>
      <th className="dh def">H</th>
      <th className="kkateg def">KKateg</th>
      <th className="pavoj def">Pavoj</th>
      <th className="dtermin def">Terminas</th>
      <th className="note">Pastaba</th>
      <th className="controls">Controls</th>*/}
    </tr>
  );
};

export { InputRow, InputHeadRow };
