const validate = require("../../validation/validate").validateItemPair;
const checkSamePlace = require("../middleware/checkSamePlace");
const checkStillExists = require("../middleware/checkStillExists");
const checkVersionMatch = require("../middleware/checkVersionMatch");

// validates supplied items
// jeigu randa klaidų, prideda validation: {reason: "string", errors: [array]}
// SIDE EFECT - item modifikuojamas!

module.exports.toCreate = (item, regbit, config, db) => {
  return new Promise((resolve, reject) => {
    const validated = validate(item.main, item.journal, config.itype, true, "both");

    if (validated.errors) {
      // jeigu yra klaidų, prideda validation ir grąžina
      item.validation =  { reason: "draft", errors: validated.errors};
      resolve(item);
    } else {
      // jeigu klaidų nėra, main ir journal pakeičia validintais
      item.main = validated.main;
      item.journal = validated.journal;

      checkSamePlace(db, config, "insert", item.main, regbit)
        .catch(e => {
          if (e.msg) {
            item.validation = {reason: "same place", errors: [e.msg]};
          } else {
            console.error(e);
            item.validation = {reason: "server error", errors: [e]};
          }
        })
        .then(() => resolve(item)) // finally grąžina
    }
  });
}


module.exports.toModify = (item, regbit, config, db) => {
  return new Promise((resolve, reject) => {
    // validina tik journal, nes tas įvestas operatoriaus; main gautas iš db
    const validated = validate(item.main, item.journal, config.itype, true, "journal");
    if (validated.errors) {
      // jeigu yra klaidų, prideda validation ir grąžina
      item.validation = { reason: "draft", errors: validated.errors };
      resolve(item);
    } else {
      // jeigu klaidų nėra, journal pakeičia validintu
      item.journal = validated.journal;
      checkStillExists(db, conf.tables.main.name, item.main.id, regbit)
        .then(found => checkVersionMatch(found.v, item.main.v))
        // same place netikrina, nes item.main operatorius nekeičia
        //.then(() => checkSamePlace(db, config, "update", item.main, regbit))
        .catch(e => {
          switch(e.status) {
            case 404:
              result.validation = {reason: "not found"};
              break;
            case 409:
              result.validation = {reason: "bad version"};
              break;
            // case 400:
            //   result.validation = {reason: "same place"};
            //   break;
            default: 
              console.error(e);
              result.validation = {reason: "server error", errors: [e.msg]}
          }
        })
        .then(() => resolve(result)) // finally
    }
  });
}


/*

module.exports.toCreateSqlite = (itemArr, coll, regbit, itype, pool) => {
  let vResult;

  // Kuriamų naujų validinti ir main, ir journal
  itemArr
    .filter(item => !item.validation) // tie, kurie sėkmingai parsinti
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


module.exports.toModifySqlite = (itemArr, coll, regbit, itype, db) => {
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

*/