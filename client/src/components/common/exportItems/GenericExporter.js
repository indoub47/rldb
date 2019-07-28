import React from "react";
import Blob from 'blob';
import FileSaver from 'file-saver';


const GenericExporter = ({convertItems, label, fname, getItems}) => {
  //if (!getItems) getItems = () => ["empty"];
  // // console.log("genericExporter getItems", getItems);
  if (!getItems) return null;
  // // console.log("GenericExporter");
  const getBlob = () => new Blob([convertItems(getItems())], {type: "text/plain;charset=utf-8"});
  const fileName = fname;
  const saveToFile = () => FileSaver.saveAs(getBlob(), fileName);
  return (
    <button className="btn" type="button" onClick={saveToFile}>
      {label}
    </button>
  );
}

// const GenericExporter = ({convertItems, label, fname, getItems}) => {
  
//   const blob = new Blob([convertItems(getItems())], {type: "text/plain;charset=utf-8"});
//   const fileName = fname;
//   const saveToFile = () => FileSaver.saveAs(blob, fileName);
//   return (
//     <button className="btn" type="button" onClick={saveToFile}>
//       {label}
//     </button>
//   );
// }

export default GenericExporter;