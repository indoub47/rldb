import React from "react";

const FoundItemRow = ({ ind, foundItem, setItemEdit }) => {
  return (
    <tr>
      <td className="id">{foundItem.id}</td>
      <td className="vbudas">{foundItem.vbudas}</td>
      <td className="data0">{foundItem.data0}</td>
      <td className="virino">{foundItem.virino}</td>
      <td className="linija vt">{foundItem.linija}</td>
      <td className="kelias vt">{foundItem.kelias}</td>
      <td className="km vt">{foundItem.km}</td>
      <td className="pk vt">{foundItem.pk}</td>
      <td className="m vt">{foundItem.m}</td>
      <td className="siule vt">{foundItem.siule}</td>
      <td className="data">{foundItem.data}</td>
      <td className="pvd">{foundItem.pvd}</td>
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
      <th className="vbudas">Būdas</th>
      <th className="data0">Virinimo data</th>
      <th className="virino">Kas virino</th>
      <th className="linija vt">Linija</th>
      <th className="kelias vt">Kelias</th>
      <th className="km vt">Km</th>
      <th className="pk vt">Pk</th>
      <th className="m vt">M</th>
      <th className="siule vt">Siūlė</th>
      <th className="data">Tikrinimo Data</th>
      <th className="pvd">Pavadinimas</th>
      <th className="note">Pastaba</th>
      <th className="controls">Controls</th>
    </tr>
  );
};

export { FoundItemRow, SearchHeadRow };
