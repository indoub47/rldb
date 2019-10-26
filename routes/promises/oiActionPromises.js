
const validateDraft = require('../../validation/validate').validateItemPair;
const checkStillExists = require('../middleware/checkStillExists');
const checkSamePlace = require('../middleware/checkSamePlace');
const insertStmtFactory = require('../SQLStatements').INSERT_stmtFactory;
const deleteSuppliedStmt = require('../SQLStatements').DELETE_SUPPLIED_stmt; 
const insertOiRejectedStmt = require('../SQLStatements').INSERT_OI_REJECTED_stmt;
const shiftMainVStmt = require('../SQLStatements').SHIFT_MAIN_V_stmt


const validateDraftPromise = (supplied, itype, whichPart) => {
  const validated = validateDraft(supplied.main, supplied.journal, itype, true, whichPart);
  if (validated.errors) {
    return Promise.reject(validated.errors);
  }
  return Promise.resolve(validated.item);
}

const onError = (err, duringTrans, db) => {
  if (duringTrans) {
    return db.query("ROLLBACK");
  } else {
    return Promise.resolve(err);
  }
}


module.exports.modifyRecord = (supplied, db, regbit, itype) => {
  const inTranscaction = false;  
  const insertJournalStmt = insertStmtFactory(itype, "journal");
  let validated = null;
  return validateDraftPromise(supplied, itype, "journal")
    .then(succ => validated = succ)
    .then(() => checkStillExists(db, itype, supplied.main.id, regbit))
    .then(() => checkVersionMatch(succ.v, draft.main.v))
    .then(() => db.query("BEGIN"))
    .then(() => inTransaction = true)
    .then(() => db.query(insertJournalStmt(validated.journal)))
    .then(() => db.query(shiftMainVStmt(draft.main.id, itype)))
    .then(() => db.query(deleteSuppliedStmt(regbit, itype, supplied.id)))
    .then(() => db.query("COMMIT"))
    .catch(err => onError(err, inTransaction, db));
}

module.exports.createRecord = (supplied, db, regbit, itype) => {
  const inTranscaction = false;  
  const insertMainStmt = insertStmtFactory(itype, "main");
  const insertJournalStmt = insertStmtFactory(itype, "journal");
  let validated = null;
  return validateDraftPromise(supplied, itype, "both")
    .then(succ => validated = succ)
    .then(() => checkSamePlace(db, itype, "insert", validated.main, regbit))
    .then(() => db.query("BEGIN"))
    .then(() => inTransaction = true)
    .then(() => db.query(insertMainStmt(validated.main)))
    .then(succ => validated.journal.mainid = succ.id)
    .then(() => db.query(insertJournalStmt(validated.journal)))
    .then(() => db.query(deleteSuppliedStmt(regbit, itype, supplied.id)))
    .then(() => db.query("COMMIT"))
    .catch(err => onError(err, inTransaction, db));
}

module.exports.return = (supplied, db, regbit, itype) => {
  return db.query("BEGIN")
    .then(succ => db.query(insertOiRejectedStmt(supplied.oper, itype, supplied.input))
    .then(() => db.query(deleteSuppliedStmt(regbit, itype, supplied.id)))
    .then(() => db.query("COMMIT"))
    .catch(err => db.query("ROLLBACK"));
}

 module.exports.delete = (supplied, db, regbit, itype) => {
   return db.query(deleteSuppliedStmt(regbit, itype, supplied.id)))
    .catch(err => Promise.resolve(err));
 }