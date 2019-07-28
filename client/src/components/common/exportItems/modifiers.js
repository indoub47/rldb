//import * as json2xml from "js2xmlparser";
import json2csv from "json2csv";
import arrayToXml from "./arrayToXml";

const jsonToCsv = items => json2csv.parse(items, { delimiter: ";" });
const jsonToXml = items => arrayToXml(items, "items", "item");

const modifiers = [
  {
    convert: JSON.stringify,
    label: "JSON",
    defaultFnFunction: () => "json_items",
    fnExtension: ".json"
  },
  {
    convert: jsonToCsv,
    label: "CSV",
    defaultFnFunction: () => "csv_items",
    fnExtension: ".csv"
  },
  {
    convert: jsonToXml,
    label: "XML",
    defaultFnFunction: () => "xml_items",
    fnExtension: ".xml"
  }
];

export default modifiers;
