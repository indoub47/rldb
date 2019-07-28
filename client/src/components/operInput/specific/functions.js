const absent = val => (val == null ? "" : val);

const pad = (num, size = 2) => {
  if (num == null || num === "") return "-".repeat(size);
  return ("0".repeat(size) + num).substr(-size);
};

const getDTString = timestamp =>
  new Date(timestamp).toLocaleString("lt-LT").slice(0, -3);

const getValidationString = validation => {
  let errs = "";
  if (validation.errors) {
    if (Array.isArray(validation.errors)) {
      errs = validation.errors.map(e => `${e.key} - ${e.msg}`).join(", ");
    } else {
      errs = validation.errors.toString();
    }
    return `Validation: ${validation.reason}. Errors: ${errs}`;
  }
  return "Validation: " + validation.reason;
};

const getOperApar = item => `${absent(item.oper)}-${absent(item.apar)}`;

const getHL = item => `${absent(item.dh)}/${absent(item.dl)}`;

const getVietosKodas = item =>
  `${pad(item.linija)}.${absent(item.kelias)}${pad(item.km, 3)}.${pad(
    item.pk
  )}.${pad(item.m)}.${absent(item.siule)}`;

const getBegis = item =>
  `${absent(item.btipas)} ${absent(item.bgamykl)} ${absent(item.bmetai)}`;

const splitMainJournalClear = (input, model) => {
  let main = {};
  Object.keys(model.main).forEach(key => (main[key] = input[key]));

  let journal = {};
  Object.keys(model.journal).forEach(key => (journal[key] = null));

  journal.mainid = input.id;

  return { main, journal };
};

const samePlace = (main1, main2) => {
  const areEq = propName => {
    const val1 = main1[propName];
    const val2 = main2[propName];
    return (
      ((val1 == null || val1 === "") && (val2 == null || val2 === "")) ||
      (val1 != null && val2 != null && val1.toString() === val2.toString())
    );
  };
  return (
    areEq("linija") &&
    areEq("kelias") &&
    areEq("km") &&
    areEq("pk") &&
    areEq("m") &&
    areEq("siule")
  );
};

export {
  getDTString,
  getValidationString,
  getOperApar,
  getHL,
  getVietosKodas,
  getBegis,
  splitMainJournalClear,
  samePlace
};
