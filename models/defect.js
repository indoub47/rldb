module.exports.main = {
  id: {type: 'integer', label: "id"}, // insert - generates automatically, update - if wrong doesnt find
  v: {type: 'integer', label: "versija"}, // insert - generates automatically, update - if wrong doesnt update or updates the item which has been updated by someone other
  id1: {type: 'integer', validator: "isNegative", label: "ID1"},
  regbit: {type: 'integer', validator: "isNegative", label: "regiono bitas"}, // is set by the server  
  meistrija: {type: 'string', required: true, validator: "isEmptyString", label: "meistrija"},
  linija: {type: 'string', required: true, validator: "isEmptyString", label: "linija"},
  kelias: {type: 'string', required: true, validator: "isEmptyString", label: "kelias"},
  km: {type: 'integer', required: true, validator: "isNegative", label: "km"},
  pk: {type: 'integer', required: true, validator: "isNegative", label: "pk"},
  m: {type: 'integer', required: true, validator: "isNegative", label: "m"},
  siule: {type: 'string', label: "siūlė"},
  kkateg: {type: 'string', required: true, validator: "isEmptyString", label: "kelio kategorija"},
  btipas: {type: 'string', required: true, validator: "isEmptyString", label: "bėgio tipas"},
  bgamykl: {type: 'string', required: true, validator: "isEmptyString", label: "bėgio gamykla"},
  bmetai: {type: 'integer', required: true, validator: "isNotYear", label: "bėgio pagaminimo metai"},
  dstop: {type: 'string', validator: "isNeitherEmptyStringNorShortDate", label: "pašalinimo data"}
};

module.exports.journal = {
  jid: {type: 'integer', label: "id"},
  data: {type: 'string', required: true, validator: "isNotShortDate", label: "įrašo data"},
  kodas: {type: 'string', required: true, validator: "isEmptyString", label: "defekto kodas"},
  dl: {type: 'number', validator: "isNegative", label: "defekto dydis L"},
  dh: {type: 'number', validator: "isNegative", label: "defekto dydis H"},
  pavoj: {type: 'string', required: true, validator: "isEmptyString", label: "pavojingumo laipsnis"},
  oper: {type: 'string', required: true, validator: "isEmptyString", label: "operatoriaus kodas"},
  apar: {type: 'string', required: true, validator: "isEmptyString", label: "defektoskopo kodas"},
  dtermin: {type: 'string', validator: "isNeitherEmptyStringNorShortDate", label: "pašalinimo terminas"},
  note: {type: 'string', validator: "wrongLength", params: {min: 0, max: 255}, label: "pastaba"},
  mainid: {type: 'integer', label: 'main id'}
};