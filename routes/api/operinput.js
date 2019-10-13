const express = require("express");
const router = express.Router();
const passport = require("passport");
const { Client, Pool } = require("pg");
const pool = new Pool();
const SQLStmts = require("../SQLStatements");
const modelProvider = require("../../models/modelProvider");
const checkPermissions = require("../middleware/checkPermissions");
const getCollection = require("../middleware/getCollection");

const Database = require("better-sqlite3");
const db = new Database("./db/dnbl.sqlite", {
  verbose: console.log,
  fileMustExist: true
});
const processApproved = require("../middleware/processApproved");

const transactions = require("../transactions");
const validate = require("../../validation/validate").validateItemPair;
const checkSameLocFctr = require("../middleware/checkSamePlace").queryFactory;
const checkIfExitsFact = require("../middleware/checkStillExists").queryFactory;
const checkResultCount = require('../middleware/checkResultCount');
const splitMainJournal = require("../middleware/splitMainJournal");
const parseMainJournal = require("../middleware/parseMainJournal");
const validateSupplied = require("../middleware/validateSupplied");

const begin = db.prepare("BEGIN");
const commit = db.prepare("COMMIT");
const rollback = db.prepare("ROLLBACK");

// A function that always runs in a transaction
function asTransaction(func) {
  // console.log("func1", func);
  return function(...args) {
    begin.run();
    try {
      // console.log("func2", func);
      func(...args);
      commit.run();
    } finally {
      if (db.inTransaction) rollback.run();
    }
  };
}

// force to authenticate
router.use(passport.authenticate("jwt", { session: false }));

// @route POST /api/operinput/supply
// @desc Sends operinput to the temporary storage on the database
// @access Public
router.post("/supply", 
  getCollection,
  checkPermissions("supplyWork", "pateikti"), 
  (req, res, next) => {
  const itype = req.body.itype;
  const input = req.body.input;
  const oper = req.user.kodas || req.user.email;
  const regbit = req.user.regbit;

  const insertStmt = "INSERT INTO supplied (main, journal, itype, oper, regbit, timestamp) VALUES ($1, $2, $3, $4, $5, $6)" ;
  const deleteStmt = "DELETE FROM unapproved WHERE itype = $1 AND oper = $2";

  pool
    .connect()
    .then(client => {
      return client
        .query('BEGIN')
        .then(() => {
          return Promise.all(
            input.map(inp => {
              const insertValues = [
                JSON.stringify(inp.main),
                JSON.stringify(inp.journal),
                itype,
                oper,
                regbit,
                Date.now()
              ];
              return client.query(insertStmt, insertValues);
            })
          );
        })
        .then(succ => checkResultCount.multi(succ, input.length))
        .then(() => client.query(deleteStmt, [itype, oper]))
        .then(() => client.query('COMMIT'))
        .catch(e => {
          result.error = e;
          return client.query('ROLLBACK');
        })
        .catch(e => {
          // pasigaunama ROLLBACK error
          result.error.rollback.error = e;
          result.error.rollback.draft = {
            input,
            itype,
            oper,
            regbit,
            date: Date.now()
          };
        })
        .then(() => {
          // release client
          client.release();

          // error to error processor
          if (result.error) {
            return next(result.error);
          }

          // returning result to client
          res.status(200).send({ ok: 1 });
        })
        .catch(next); // client error
      })
      .catch(next); // connect error
  });

// @route GET /api/operinput/supplied
// @desc Fetch supplied inputs of particular region and particular itype
// @access Public
router.get(
  "/supplied",
  getCollection,
  checkPermissions("fetchSupplied", "matyti pateiktų"),
  (req, res, next) => {
    // patikrinti ar turi teisę
    const itype = req.query.itype;
    const admRegbit = req.user.regbit;
    const coll = res.locals.coll;

    const stmtText = `SELECT * FROM supplied WHERE itype = $1 AND regbit = $2`;
    pool
      .query(stmtText, [itype, regbit])
      .then(succ => {
        // json to object
        succ.rows.forEach(item => parseMainJournal(item));
        return {
            create: succ.rows.filter(i => i.main.id < 0),
            modify: succ.rows.filter(i => i.main.id >= 0)
          };
      })
      .then(succ => {  

        // Visus įrašus padalinti į kuriamus naujus ir modifikuojamus.
        // Modifikuojamų id teigiamas, kuriamų naujų id neigiamas.
        let toCreate = succ.rows.filter(i => i.main.id < 0);
        let toModify = succ.rows.filter(i => i.main.id > 0);

        // validate drafts
        validateSupplied.toCreate(toCreate, coll, admRegbit, itype, db);
        validateSupplied.toModify(toModify, coll, admRegbit, itype, db);
        // Each invalid item has gotten .validation prop:
        // {reason: "string", (optional) errors: []}

        // merge back into single array
        const merged = toCreate.concat(toModify);

        return res.status(200).send(merged);
      })
      .catch(next);
});

// @route GET /api/operinput/unapproved
// @desc Fetch unapproved inputs of particular region and particular useremail
// @access Public
router.get("/unapproved", 
  getCollection,
  checkPermissions("fetchUnapproved", "matyti grąžintų"), 
  (req, res) => {
  const itype = req.query.itype;
  const oper = req.user.kodas;

  const stmtText = `SELECT input FROM unapproved WHERE itype = ? AND oper = ?`;
  try {
    const items = db.prepare(stmtText).all(itype, oper);
    return res.status(200).send(items);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

// @route POST /api/operinput/supply
// @desc Sends operinput to the temporary storage on the database
// @access Public
router.post("/supply-sqlite", 
  getCollection,
  checkPermissions("supplyWork", "pateikti"), 
  (req, res) => {
  const itype = req.body.itype;
  const input = req.body.input;
  const oper = req.user.kodas || req.user.email;
  const regbit = req.user.regbit;

  const insertStmt = db.prepare(
    "INSERT INTO supplied (main, journal, itype, oper, regbit, timestamp) VALUES (?, ?, ?, ?, ?, ?)"
  );
  const deleteStmt = db.prepare(
    "DELETE FROM unapproved WHERE itype = ? AND oper = ?"
  );

  const transFunc = (input, itype, oper, regbit) => {
    input.forEach(inp => {
      //console.log("inp", inp);
      insertStmt.run(
        JSON.stringify(inp.main),
        JSON.stringify(inp.journal),
        itype,
        oper,
        regbit,
        Date.now()
      );
    });
    deleteStmt.run(itype, oper);
  };

  const transaction = asTransaction(transFunc);

  try {
    transaction(input, itype, oper, regbit);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
  res.status(200).send({ ok: 1 });
});

// @route POST /api/operinput/process-approved
// @desc Depending on the item.action performs different tasks on
// approved items
// @access Public
router.post("/process-approved", 
  getCollection,
  checkPermissions("processApproved", "tvarkyti pateiktų"), 
  (req, res) => {
  const itype = req.body.itype;
  const input = req.body.input;
  const regbit = req.user.regbit;
  const coll = res.locals.coll;

  let result = { total: input.length, actions: {} };

  ///// ACTION - DELETE ////////////
  // ištrina iš supplied
  result.actions.delete = { success: 0, fail: 0 };
  const transDelete = asTransaction(transactions.deleteSuppliedById(db));
  input
    .filter(item => item.action === "delete")
    .forEach(item => {
      try {
        transDelete(item.id); // tik ištrina iš supplied
        result.actions.delete.success++;
      } catch (err) {
        console.error(err);
        result.actions.delete.fail++;
      }
    });

  ///// ACTION - RETURN ////////////
  // insertina į unapproved,
  // ištrina iš supplied
  result.actions.return = { success: 0, fail: 0 };
  const returnToOper = asTransaction(transactions.returnToOper(db));

  input
    .filter(item => item.action === "return")
    .forEach(item => {
      try {
        returnToOper(item);
        result.actions.return.success++;
      } catch (err) {
        console.error(err);
        result.actions.return.fail++;
      }
    });

  ///// ACTION - OK, CREATE NEW RECORD ////////////
  result.actions.createOK = { success: 0, fail: 0 };
  const sameLocation = checkSameLocFctr(db, coll, "insert");
  const createRecord = asTransaction(transactions.createRecord(itype, db));
  input
    .filter(item => item.action === "ok" && item.main.id < 0)
    .forEach(item => {
      if (
        processApproved.createNewRecord(
          item,
          itype,
          regbit,
          validate,
          sameLocation,
          createRecord
        )
      ) {
        result.actions.createOK.success++;
      } else {
        result.actions.createOK.fail++;
      }
    });

  ///// ACTION - OK, MODIFY EXISTING RECORD ////////////
  result.actions.modifyOK = { success: 0, fail: 0 };
  const ifExists = checkIfExitsFact(db, coll);
  const modifyRecord = asTransaction(transactions.modifyRecord(itype, db));
  input
    .filter(item => item.action === "ok" && item.main.id > 0)
    .forEach(item => {
      if (
        processApproved.modifyExistingRecord(
          item,
          itype,
          regbit,
          validate,
          ifExists,
          modifyRecord
        )
      ) {
        result.actions.modifyOK.success++;
      } else {
        result.actions.modifyOK.fail++;
      }
    });

  //res.status(200).send(result);
  const stmtText = `SELECT * FROM supplied WHERE itype = ? AND regbit = ?`;
  let fetched = null;

  try {
    fetched = db.prepare(stmtText).all(itype, regbit);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }

  //console.log("fetched", fetched);

  if (fetched.length < 1) return res.status(200).send([]);

  // json to object
  fetched.forEach(item => parseMainJournal(item));

  //console.log("parsed", fetched);

  // Visus įrašus padalinti į kuriamus naujus ir modifikuojamus.
  // Modifikuojamų id teigiamas, kuriamų naujų id neigiamas.
  let toCreate = fetched.filter(i => i.main.id < 0);
  let toModify = fetched.filter(i => i.main.id > 0);

  // validate drafts
  validateSupplied.toCreate(toCreate, coll, regbit, itype, db);
  validateSupplied.toModify(toModify, coll, regbit, itype, db);
  // Each invalid item has gotten .validation prop:
  // {reason: "string", (optional) errors: []}

  // merge back into single array
  const merged = toCreate.concat(toModify);

  return res.status(200).send(merged);
});

module.exports = router;
