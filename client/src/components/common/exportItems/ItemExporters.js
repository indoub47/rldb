import React from "react";
import Blob from 'blob';


const ItemExporter = ({convert, label, defaultFn, fnExtension, items}) => {
  const blob = new Blob([convert(items)], {type: "text/plain;charset=utf-8"});
  const fileName = `${defaultFnFunction()}${fnExtension}`;
  const saveToFile = () => saveAs(blob, fileName);
  return (
    <button className="btn" type="button" onClick={saveToFile}>
      {label}
    </button>
  );
}

const JsonExporter = (ItemExporter, items, convert, jsonLabel, arrToJson, jsonExtension) => {
  const props = {
    convert: items => items,
    label: "JSON",
    defaultFnFunction: () => "json_items",
    fnExtension: ".json"
  }
  return <ItemExporter {...props} />
}


const JsonExporter = items => exporterProps => ItemExporter => {
  return items => {
    return exporterProps => {
      return <ItemExporter {...exporterProps} items={items} />
  }
}


const Exporter = ({saveToFile, label}) => (
    <button className="btn" type="button" onClick={saveToFile}>
      {label}
    </button>
);

const ParticularExporter = (items, modifiers, Exporter) => {
  const createBlob = items => new Blob([modifiers.convert(items)], {type: "text/plain;charset=utf-8"});
  const fileName = `${modifiers.defaultFnFunction()}${modifiers.fnExtension}`;
  const saveToFile = () => saveAs(blob, fileName);
  return <Exporter saveToFile={saveToFile} label={modifiers.label} />
}

export specializeExporter(modifiers, Exporter);