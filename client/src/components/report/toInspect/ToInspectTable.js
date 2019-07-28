import React from "react";

const ToInspectTable = ({ report }) => {
  if (!report) return null;

  const tHead = (
    <thead>
      <tr>
        <th scope="col">id</th>
        <th scope="col">linija</th>
        <th scope="col">kelias</th>
        <th scope="col">km</th>
        <th scope="col">pk</th>
        <th scope="col">m</th>
        <th scope="col">siule</th>
        <th scope="col">vbudas</th>
        <th scope="col">data1</th>
        <th scope="col">kelintas</th>
        <th scope="col">galima_nuo</th>
        <th scope="col">reikia_iki</th>
      </tr>
    </thead>
  );

  const tRows = report.map(welding => (
    <tr key={welding.id}>
      <td>{welding.id}</td>
      <td>{welding.linija}</td>
      <td>{welding.kelias}</td>
      <td>{welding.km}</td>
      <td>{welding.pk}</td>
      <td>{welding.m}</td>
      <td>{welding.siule}</td>
      <td>{welding.vbudas}</td>
      <td>{welding.data1}</td>
      <td>{welding.kelintas}</td>
      <td>{welding.galimanuo}</td>
      <td>{welding.reikiaiki}</td>
    </tr>
  ));

  return (
    <table className="table">
      {tHead}
      <tbody>{tRows}</tbody>
    </table>
  );
};

export default ToInspectTable;
