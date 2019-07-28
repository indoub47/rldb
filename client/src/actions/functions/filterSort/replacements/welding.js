export const filterReplacements = {
  id: "x.id",
  oldid: "x.oldid",
  regbit: "x.regbit",
  linija: "x.linija",
  kelias: "x.kelias",
  km: "x.km",
  pk: "x.pk",
  m: "x.m",
  siule: "x.siule",
  vbudas: "x.vbudas",
  suvnr: "x.suvnr",
  nrschema: "x.nrschema",
  data0: "x.data0",
  dstop: "x.stop",
  note: "x.note",

  data: "x.data",
  oper: "x.oper",
  apar: "x.apar",
  name: "x.pvd",
  defectid: "x.defectid"
};

export function getSortingReplacement(fieldName, x) {
  switch (fieldName) {
    case "id": return x.id;
    case "oldid": return x.oldid;
    case "regbit": return x.regbit;
    case "linija": return x.linija;
    case "kelias": return x.kelias;
    case "km": return x.km;
    case "pk": return x.pk;
    case "m": return x.m;
    case "siule": return x.siule;
    case "vbudas": return x.vbudas;
    case "suvnr": return x.suvnr;
    case "nrschema": return x.nrschema;
    case "data0": return x.data0;
    case "dstop": return x.dstop;
    case "note": return x.note;
    
    case "data": return x.data;
    case "apar": return x.apar;
    case "oper": return x.oper;
    case "pvd": return x.pvd;
    case "defectid": return x.defectid;

    default:
      throw new Error("Nesuprantamas rikiavimo parametras " + fieldName);
  }
}
