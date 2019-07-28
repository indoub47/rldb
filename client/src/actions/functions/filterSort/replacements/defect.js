export const filterReplacements = {
  id: "x.id",
  id1: "x.id1",
  regbit: "x.regbit",
  meistrija: "x.meistrija",
  linija: "x.linija",
  kelias: "x.kelias",
  km: "x.km",
  pk: "x.pk",
  m: "x.m",
  siule: "x.siule",
  kodas: "x.kodas",
  dl: "x.dl",
  dh: "x.dh",
  pavoj: "x.pavoj",
  kkateg: "x.kkateg",
  btipas: "x.btipas",
  bgamykl: "x.bgamykl",
  bmetai: "x.bmetai",
  oper: "x.oper",
  apar: "x.apar",
  data: "x.data",
  dtermin: "x.dtermin",
  dstop: "x.dstop",
  liko: "(x.dtermin && !x.dstop) && Math.floor((Date.parse(x.dtermin)-Date.now())/86400000)",
  vt: "(x.kelias && (x.kelias==='1' || x.kelias==='2') && x.km && x.pk && (x.m || x.m===0)) && (x.km*1000+(x.pk-1)*100+x.m)"
};

export function getSortingReplacement(fieldName, x) {
  switch (fieldName) {
    case "id": return x.id;
    case "id1": return x.id1;
    case "regbit": return x.regbit;
    case "meistrija": return x.meistrija;
    case "linija": return x.linija;
    case "kelias": return x.kelias;
    case "km": return x.km;
    case "pk": return x.pk;
    case "m": return x.m;
    case "siule": return x.siule;
    case "kodas": return x.kodas;
    case "dl": return x.dl;
    case "dh": return x.dh;
    case "pavoj": return x.pavoj;
    case "kkateg": return x.kkateg;
    case "btipas": return x.btipas;
    case "bgamykl": return x.bgamykl;
    case "bmetai": return x.bmetai;
    case "oper": return x.oper;
    case "apar": return x.apar;
    case "data": return x.data;
    case "dtermin": return x.dtermin;
    case "dstop": return x.dstop;
    case "liko": return x.dtermin && !x.daction ? Math.floor((Date.parse(x.dtermin)-Date.now())/86400000) : Number.MAX_SAFE_INTEGER;

    default:
      throw new Error("Nesuprantamas rikiavimo parametras " + fieldName);
  }
}
