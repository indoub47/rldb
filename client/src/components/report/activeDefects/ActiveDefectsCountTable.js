import React from "react";

const ActiveDefectsCountTable = ({ report }) => {
  if (!report) return null;
  // console.log("active defects count report", report);

  const kkategColSpan = report[0].kkateg[0].pavoj.length;

  const THead = ({ report }) => (
    <thead>
      <tr>
        <th rowSpan="2" scope="col">
          Meistrija
        </th>
        {report[0].kkateg.map(kk => (
          <th key={kk.ind} colSpan={kkategColSpan}>
            {kk.label}
          </th>
        ))}
      </tr>
      <tr>
        {report[0].kkateg.map(kk =>
          kk.pavoj.map(p => (
            <th scope="col" key={p.ind}>
              {p.label}
            </th>
          ))
        )}
      </tr>
    </thead>
  );

  const ReportRow = ({ meistrija }) => {
    return (
      <tr>
        <th scope="row">{meistrija.label}</th>
        {meistrija.kkateg.map(kk =>
          kk.pavoj.map(p => <td key={kk.ind + "-" + p.ind}>{p.count > 0 ? p.count : ""}</td>)
        )}
      </tr>
    );
  };

  const TBody = ({ report }) => {
    return (
      <tbody>
        {report.map(m => (
          <ReportRow key={m.ind} meistrija={m} />
        ))}
      </tbody>
    );
  };

  return (
    <table className="table table-bordered table-striped">
      <THead report={report} />
      <TBody report={report} />
    </table>
  );
};

export default ActiveDefectsCountTable;
