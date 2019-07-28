import React from "react";

const K33Table = ({ report }) => {
  if (!report) return null;

  // console.log("active defects table report", report);

  const tHead = (
    <thead>
      <tr>
        <th scope="col">Def</th>
        <th scope="col">Oper</th>
        {report[0].counts.map(c => (
          <th scope="col" key={c.id}>
            {c.id}
          </th>
        ))}
      </tr>
    </thead>
  );

  const tRows = report.map((row, i) => (
    <tr key={i}>
      <th scope="row">{row.defskop}</th>
      <th scope="row">{row.operat}</th>
      {row.counts.map(c => (
        <td key={c.id}>{c.count > 0 ? c.count : ""}</td>
      ))}
    </tr>
  ));

  return (
    <table className="table">
      {tHead}
      <tbody>{tRows}</tbody>
    </table>
  );
};

export default K33Table;
