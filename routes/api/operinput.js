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
const checkResultCount = require("../middleware/checkResultCount");
const splitMainJournal = require("../middleware/splitMainJournal");
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

// @route GET /api/operinput/count
// @desc Gets operinput count by itype and region
// @access Public
router.get("/count", (req, res, next) => {
  const itype = req.query.itype;
  const regbit = req.user.regbit;
  const table = req.query.table || "oi_supplied";

  const stmt = {
    text: `SELECT COUNT(*) AS count FROM ${table} WHERE itype = $1 and regbit = $2`,
    values: [itype, regbit]
  };

  pool
    .query(stmt)
    .then(succ => {
      if (succ.rowCount < 1) {
        throw {
          status: 500,
          reason: "server error",
          msg: "negautas įrašų skaičius"
        };
      }
      res.status(200).send({ count: succ.rows[0].count });
    })
    .catch(next);
});

// @route POST /api/operinput/supply
// @desc Sends operinput to the temporary storage on the database
// @access Public
router.post(
  "/supply",
  getCollection,
  checkPermissions("supplyWork", "pateikti"),
  (req, res, next) => {
    const itype = req.body.itype;
    const input = req.body.input;
    const oper = req.user.kodas || req.user.email;
    const regbit = req.user.regbit;

    const insertStmt =
      "INSERT INTO oi_supplied (main, journal, itype, oper, regbit, tstamp) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)";
    const deleteStmt = "DELETE FROM oi_rejected WHERE itype = $1 AND oper = $2";

    // filter to skip importing incomplete objects
    const inputIsOk = input =>
      !!input &&
      input.main &&
      input.main.hasOwnProperty("id") &&
      !isNaN(parseInt(input.main.id)) &&
      input.journal;

    pool
      .connect()
      .then(client => {
        let err = null;
        return client
          .query("BEGIN")
          .then(() => {
            return Promise.all(
              input.filter(inputIsOk).map(inp => {
                const insertValues = [
                  inp.main,
                  inp.journal,
                  itype,
                  oper,
                  regbit
                ];
                //console.log("text, values: ", insertStmt, insertValues);
                return client.query(insertStmt, insertValues);
              })
            );
          })
          .then(succ => {
            //console.log("succ.rows", succ.rows);
            return checkResultCount.multi(succ, input.filter(inputIsOk).length);
          })
          .then(() => {
            return client.query(deleteStmt, [itype, oper]);
          })
          .then(() => {
            client.query("COMMIT");
          })
          .catch(e => {
            err = e;
            return client.query("ROLLBACK");
          })
          .catch(e => {
            // pasigaunama ROLLBACK error
            err.rollback.error = e;
            err.rollback.draft = {
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
            if (err) {
              return next(err);
            }

            // returning result to client
            res.status(200).send({ ok: 1 });
          })
          .catch(next); // client error
      })
      .catch(next); // connect error
  }
);

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
    const regbit = req.user.regbit;
    const coll = res.locals.coll;

    pool
      .connect()
      .then(client => {
        const stmtText = `SELECT * FROM oi_supplied WHERE itype = $1 AND regbit = $2`;
        return client
          .query(stmtText, [itype, regbit])
          .then(succ => {
            let allItems = {
              create: succ.rows.filter(i => i.main.id < 0),
              modify: succ.rows.filter(i => i.main.id >= 0)
            };
            return Promise.all(
              allItems.modify.map(item =>
                validateSupplied.toModify(item, regbit, coll, client)
              )
            )
              .then(() =>
                Promise.all(
                  allItems.create.map(item =>
                    validateSupplied.toCreate(item, regbit, coll, client)
                  )
                )
              )
              .then(() => {
                // merge them
                const merged = allItems.create.concat(allItems.modify);
                return res.status(200).send(merged);
              })
              .catch(next);
          })
          .catch(next);
      })
      .catch(next);
  }
);

// @route GET /api/operinput/unapproved
// @desc Fetch unapproved inputs of particular region and particular useremail
// @access Public
router.get(
  "/unapproved",
  checkPermissions("fetchUnapproved", "matyti grąžintų"),
  (req, res, next) => {
    const stmt = {
      text: "SELECT input FROM oi_rejected WHERE itype = $1 AND oper = $2",
      values: [req.query.itype, req.user.kodas]
    };

    pool
      .query(stmt)
      .then(succ => res.status(200).send(succ.rows))
      .catch(next);
  }
);

// @route POST /api/operinput/process-approved
// @desc Depending on the item.action performs different tasks on
// approved items
// @access Public
// @note Items must be taken one by one and if task succeeded, item is being
// deleted from oi_supplied. If task failed, item is not deleted from oi_supplied
router.post(
  "/process-approved",
  getCollection,
  checkPermissions("processApproved", "tvarkyti pateiktų"),
  (req, res, next) => {
    const itype = req.body.itype;
    const input = req.body.input;
    const regbit = req.user.regbit;
    const coll = res.locals.coll;

    let result = { total: input.length, actions: {} };

    const deleteSupplied = ids =>
      `DELETE FROM oi_supplied WHERE id IN (${ids})`;
    const filterByAction = action =>
      input.filter(item => item.action === action);

    // {
    //   const ids = .map(item => item.id).join(", ");
    //   return
    // };

    pool.connect().then(client => {
      //return Promise.allSettled(input.map(item => operinputActions[item.action](item, client)}));

      client.query("BEGIN")
        ///// ACTION - DELETE ////////////
        // ištrina iš supplied
        .then(() => {
          const ids = input
            .filter(item => item.action === "delete")
            .map(i => i.id)
            .join(", ");
          return client.query(deleteSupplied(ids))
        })
        ///// ACTION - RETURN ////////////
        // insertina į unapproved
        .then(succ => {
          const text =
            "INSERT INTO oi_rejected (item, itype, oper, suppliedid) VALUES ($1, $2, $3, $4) RETURNING suppliedid";
          return Promise.allSettled(
            input
              .filter(item => item.action === "return")
              .map(item =>
                client.query(text, [
                  { main: item.main, journal: item.journal },
                  itype,
                  item.oper
                ])
              )
          );
        })
        // ištrina iš supplied
        .then(succ => {
          const fulfilledIds = succ
            .filter(result => result.status === "fulfilled")
            .map(result => result.value.id)
            .join(", ");
          return client.query(deleteSupplied(fulfilledIds));
        })

        ///// ACTION - OK, CREATE NEW RECORD ////////////
        // validatina, tikrina same place,
        // kurie tinkami, tuos insertina
        .then(succ => {
          // (succ reikalingas būtų, jeigu tikrinti ar visus ištrynė)
          // filtruoja ir validateina items
          return input
            .filter(item => item.action === "ok" && item.main.id < 0)
            .map(item => {
              let validated = validate(item.main, item.journal, itype, true, "both");
              validated.itemId = item.id;
              return validated; 
            })
            .filter(validated => !validated.errors)
            .map(validated => ({main: validated.item.main, journal: validated.item.journal}))
            .forEach(item => {
              item.main.regbit = regbit
            });
        })
        .then(succ => {

        });
    });

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
  }
);

// @route GET /api/operinput/unapproved
// @desc Fetch unapproved inputs of particular region and particular useremail
// @access Public
router.get(
  "/unapproved_sqlite",
  getCollection,
  checkPermissions("fetchUnapproved", "matyti grąžintų"),
  (req, res) => {
    const itype = req.query.itype;
    const oper = req.user.kodas;

    const stmtText = `SELECT input FROM oi_rejected WHERE itype = ? AND oper = ?`;
    try {
      const items = db.prepare(stmtText).all(itype, oper);
      return res.status(200).send(items);
    } catch (error) {
      console.error(error);
      return res.status(500).send(error);
    }
  }
);

// @route POST /api/operinput/supply
// @desc Sends operinput to the temporary storage on the database
// @access Public
router.post(
  "/supply-sqlite",
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
  }
);

// @route POST /api/operinput/process-approved
// @desc Depending on the item.action performs different tasks on
// approved items
// @access Public
router.post(
  "/process-approved-sqlite",
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
  }
);

module.exports = router;
