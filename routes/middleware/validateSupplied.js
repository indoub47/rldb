const validate = require("../../validation/validate").validateItemPair;
const checkSamePlace = require("./checkSamePlace");
const returnExisting = require("./checkStillExists");
const checkVersionMatch = require("./checkVersionMatch");

// validates supplied item
// jeigu randa klaidų, prideda validation: {status: integer, reason: "string", errors: [array]}
// SIDE EFECT - supplied modifikuojamas!

module.exports.toCreate = (supplied, regbit, config, db) =>
  validateDraft(supplied, config.itype, "both")
    .then(succ => checkSamePlace(db, config, "insert", succ.main, regbit))
    .catch(err => supplied.validation = getValidation(err))
    .then(() => Promise.resolve(supplied)); 


module.exports.toModify = (supplied, regbit, config, db) =>
  validateDraft(supplied, config.itype, "journal")
    .then(succ => returnExisting(db, config.itype, succ.main.id, regbit))
    .then(succ => checkVersionMatch(succ.v, supplied.main.v))
    .catch(err => supplied.validation = getValidation(err))
    .then(() => Promise.resolve(supplied));



const validateDraft = (supplied, itype, whichPart) => {
  const validated = validate(
    supplied.main,
    supplied.journal,
    itype,
    true,
    whichPart
  );
  if (validated.errors) {
    return Promise.reject({reason: "bad draft", errors: validated.errors });
  }
  if (whichPart !== "journal") {
    supplied.main = validated.item.main;
  }
  supplied.journal = validated.item.journal;
  return Promise.resolve(supplied);
};

const getValidation = error => {
  if (typeof error === "Error") {
    // jeigu nenumatyta server exception
    return {
      status: 500,
      reason: "server error",
      errors: [error.toString()]
    };
  } else if (error.reason === "bad draft") {
    // jeigu bad draft
    return {
      status: 400,
      reason: "bad draft",
      errors: error.errors
    }
  } else {
    // jeigu kita klaida
    return {
      status: error.status,
      reason: error.reason,
      errors: [error.msg]
    }
  }
};
