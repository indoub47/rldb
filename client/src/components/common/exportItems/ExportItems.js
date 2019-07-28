import React from "react";
import modifiers from "./modifiers";
import GenericExporter from "./GenericExporter"

const ExportItems = ({getItems}) => {
  // // console.log("exportItems getItems", {getItems});
  const exporters = modifiers.map(m => 
    <GenericExporter  
      convertItems={m.convert} 
      label={m.label} 
      fname={m.defaultFnFunction() + m.fnExtension} 
      getItems={getItems}
      key={m.label}
    />);
  return (
    <div className="btn-group" role="group">
      {exporters}
    </div>
  );
}

export default ExportItems