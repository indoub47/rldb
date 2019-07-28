const validate = require("../../validation/validate").validateItemPair;
const checkSamePlace = require("../middleware/checkSamePlace").bareQuery;
const checkIfExists = require("../middleware/checkIfExists").bareQuery;

module.exports.toCreate = (itemArr, coll, regbit, itype, db) => {
  let vResult;

  // Kuriamų naujų validinti ir main, ir journal
  itemArr
    .filter(item => !item.validation)
    .forEach(item => {
      vResult = validate(
        item.main,
        item.journal,
        itype,
        true,
        "both"
      );

      if (vResult.errors) {
        item.validation = { reason: "draft", errors: vResult.errors };
      } else {
        item.main = vResult.item.main;
        item.journal = vResult.item.journal;
      }
  });

  // toCreate - if drafts valid, test for samePlace
  itemArr
    .filter(item => !item.validation)
    .forEach(item => {
      try {
        if (checkSamePlace(coll, "insert", item.main, regbit, db)) {
          item.validation = { reason: "same place" };
        }
      } catch (error) {
        console.error(error);
        item.validation = { reason: "server error", errors: [error] };
      }
    });
};



module.exports.toModify = (itemArr, coll, regbit, itype, db) => {
  let vResult;

  // Modifikuojamų validinti tik journal
  itemArr
    .filter(item => !item.validation)
    .forEach(item => {
      vResult = validate(
        item.main,
        item.journal,
        itype,
        true,
        "journal"
      );
      if (vResult.errors) {
        item.validation = { reason: "draft", errors: vResult.errors };
      } else {
        item.journal = vResult.item.journal;
      }
    });

  // toModify - if drafts valid: check if exists, check version and
  // test for samePlace
  itemArr
    .filter(item => !item.validation)
    .forEach(item => {
      try {
        const found = checkIfExists(item.main.id, coll, regbit, db);
        if (!found) {
          item.validation = { reason: "not found" };
        } else if (found.v !== item.main.v) {
          item.validation = { reason: "bad version" };
        } else if (
          checkSamePlace(coll, "update", item.main, regbit, db)
        ) {
          item.validation = { reason: "same place" };
        }
      } catch (error) {
        console.error(error);
        item.validation = { reason: "server error", errors: [error] };
      }
    });
};