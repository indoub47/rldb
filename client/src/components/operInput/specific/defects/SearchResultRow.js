import React from "react";

const FoundItemRow = ({ ind, foundItem, setItemEdit }) => {
  return (
    <tr>
      <td className="id">{foundItem.id}</td>
      <td className="meistrija vt">{foundItem.meistrija}</td>
      <td className="kkateg">{foundItem.kkateg}</td>
      <td className="btipas begis">{foundItem.btipas}</td>
      <td className="bgamykl begis">{foundItem.bgamykl}</td>
      <td className="bmetai begis">{foundItem.bmetai}</td>
      <td className="linija vt">{foundItem.linija}</td>
      <td className="kelias vt">{foundItem.kelias}</td>
      <td className="km vt">{foundItem.km}</td>
      <td className="pk vt">{foundItem.pk}</td>
      <td className="m vt">{foundItem.m}</td>
      <td className="siule vt">{foundItem.siule}</td>
      <td className="data">{foundItem.data}</td>
      <td className="kodas def">{foundItem.kodas}</td>
      <td className="dl def">{foundItem.dl}</td>
      <td className="dh def">{foundItem.dh}</td>
      <td className="pavoj def">{foundItem.pavoj}</td>
      <td className="dtermin def">{foundItem.dtermin}</td>
      <td className="note">{foundItem.note}</td>
      <td>
        <div className="button-group">
          <button
            className="btn btn-xs btn-warning"
            data-ind={ind}
            onClick={setItemEdit}
          >
            <i className="fas fa-edit" data-ind={ind} />
          </button>
        </div>
      </td>
    </tr>
  );
}

const SearchHeadRow = () => {
  return (
    <tr>
      <th className="id">ID</th>
      <th className="meistrija vt">Meistrija</th>
      <th className="kkateg">KKateg</th>
      <th className="btipas begis">BTipas</th>
      <th className="bgamykl begis">BGamykl</th>
      <th className="bmetai begis">BMetai</th>
      <th className="linija vt">Linija</th>
      <th className="kelias vt">Kelias</th>
      <th className="km vt">Km</th>
      <th className="pk vt">Pk</th>
      <th className="m vt">M</th>
      <th className="siule vt">Siūlė</th>
      <th className="data">Data</th>
      <th className="kodas def">DKodas</th>
      <th className="dl def">DL</th>
      <th className="dh def">DH</th>
      <th className="pavoj def">DPavoj</th>
      <th className="dtermin def">Terminas</th>
      <th className="note">Pastaba</th>
      <th className="controls">Controls</th>
    </tr>
  );
};

export { FoundItemRow, SearchHeadRow };
