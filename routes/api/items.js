const express = require("express");
const router = express.Router();
const passport = require("passport");

const { Client, Pool } = require("pg");
const pool = new Pool();

const SQLStmts = require("../SQLStatements");
const getCollection = require("../middleware/getCollection");
const checkPermissions = require("../middleware/checkPermissions");
const checkSamePlace = require("../middleware/checkSamePlace");
const checkVersionMatch = require("../middleware/checkVersionMatch");
const checkStillExists = require("../middleware/checkStillExists");
const checkResultCount = require('../middleware/checkResultCount');

const fetchResult = require("../middleware/fetchResult");
const transactions = require("../transactions");
const validateItem = require("../../validation/validate").validateItem;

// force to authenticate
router.use(passport.authenticate("jwt", { session: false }));

// get collection
router.use(getCollection);

// @route GET /api/items/search/location
// @desc Search items by their location data
// @access Public
router.get("/search/location", (req, res, next) => {
  const stmt = SQLStmts.SEARCH_ITEMS_BY_LOCATION_stmt(
    req.query,
    req.user.regbit,
    res.locals.coll
  );
  if (stmt.error) {
    throw stmt.error;
  }

  pool
    .query(stmt)
    .then(succ => {
      if (succ.rows.length === 0) {
        res.status(200).send({
          msg: "Rezultatų nerasta."
        });
      } else if (succ.rows.length > 20) {
        res.status(200).send({
          msg: "Per daug rezultatų. Siaurinkite užklausą."
        });
      } else {
        res.status(200).send(succ.rows);
      }
    })
    .catch(next);
});

// @route GET api/items
// @desc Get nepanaikinti items
// @access Public
router.get("/", (req, res, next) => {
  const tableName = req.query.all === undefined
    ? res.locals.coll.tables.viewActiveLastJ.name
    : res.locals.coll.tables.viewAllLastJ.name;
  const filter = "regbit = $1";
  const stmtText = `SELECT * FROM ${tableName} WHERE ${filter}`;
  pool
    .query(stmtText, [req.user.regbit])
    .then(succ => res.status(200).send(succ.rows))
    .catch(next);
});

// @route POST api/items/update
// @desc Update item and increment version
// @access Public
router.post(
  "/update",
  checkPermissions("update", "redaguoti"),
  (req, res, next) => {
    const coll = res.locals.coll;
    const itype = res.locals.itype;
    // validate draft here. returns either {errors: []} or {item: {}}
    const validated = validateItem(req.body.main, req.body.journal, itype, false);
    if (validated.errors) {
      throw {
        status: 400,
        reason: "bad draft",
        errors: validated.errors
      };
    }

    let main = validated.item.main;
    main.regbit = req.user.regbit;
    let journal = validated.item.journal;
    const mainId = main.id;
    const tableMain = coll.tables.main.name;
    const tableJournal = coll.tables.journal.name;

    // nuo čia vykdomos užklausos į db, reikalingas client
    pool
      .connect()
      .then(client => {
        // ŠITO BLOKO VIDUJE YRA client, result, location
        let location = "before transaction";
        let result = { error: null, success: {}};
        
        checkStillExists(client, tableMain, mainId, main.regbit)
          .then(succ => checkVersionMatch(succ.v, main.v))
          .then(() => checkSamePlace(client, coll, "update", main, main.regbit))
          .then(() => {
            main.v += 1;
            journal.insert &&
              journal.insert.forEach(j => {
                j.mainid = mainId;
                //delete j.jid; // nėra reikalo, nes yra exclude
              });
            journal.update &&
              journal.update.forEach(j => {
                j.mainid = mainId;
              });

            // starting transaction
            client.query("BEGIN");
          })
          .then(() => {
            location = "during transaction";

            // update main
            const updateMainStmt = SQLStmts.UPDATE_stmtFactory(itype, "main");
            const updateMain = updateMainStmt(main);
            updateMain.values = [...updateMain.values, main.id, main.regbit];
            return client.query(updateMain);
          })
          .then(succ => checkResultCount.single(succ))
          .then(succ => {
            result.success.main = succ.rows[0];
          })
          .then(() => {
            // update journal
            if (journal.update && journal.update.length) {
              const journalUpdateStmt = SQLStmts.UPDATE_stmtFactory(
                itype,
                "journal"
              );
              return Promise.all(
                journal.update.map(j => {
                  const journalUpdate = journalUpdateStmt(j);
                  journalUpdate.values = [
                    ...journalUpdate.values,
                    j.jid,
                    main.id
                  ];
                  return client.query(journalUpdate);
                })
              );
            }
          })
          .then(succ => {
            if (journal.update && journal.update.length) {
              return checkResultCount.multi(succ, journal.update.length);
            }
          })
          .then(() => {            
            // insert journal
            if (journal.insert && journal.insert.length) {
              const journalInsertStmt = SQLStmts.INSERT_stmtFactory(
                itype,
                "journal"
              );
              return Promise.all(
                journal.insert.map(j => {
                  const journalInsert = journalInsertStmt(j);
                  return client.query(journalInsert);
                })
              );
            }
          })
          .then(succ => {
            if (journal.insert && journal.insert.length) {
              return checkResultCount.multi(succ, journal.insert.length);
            }
          })
          .then(() => {
            // delete journal
            if (journal.delete && journal.delete.length) {
              const deleteSomeJournalStmt = SQLStmts.DELETE_SOME_JOURNAL_stmt(
                itype,
                journal.delete,
                main.id
              );
              return client.query(deleteSomeJournalStmt);
            }
          })
          .then(() => {
            // baigiama transaction
            return client.query("COMMIT");
          })
          .then(() => {
            location = "during result fetch";
            // fetching journal
            const fetchJournal = {
              text: `SELECT * FROM ${tableJournal} WHERE mainid = $1`,
              values: [mainId]
            };
            return client.query(fetchJournal);
          })
          .then(succ => {
            location = "after result fetch";
            result.success.journal = succ.rows;
          })
          .catch(e => {
            // pasigaunama async veiksmų error;
            result.error = e;
            if (location === "during transaction") {
              return client.query("ROLLBACK");
            }
          })
          .catch(e => {
            // pasigaunama ROLLBACK error
            result.error.rollback.error = e;
            result.error.rollback.draft = {
              main: req.body.main,
              journal: req.body.journal
            };
          })
          .then(() => {
            // release client
            client.release();
            
            // returning result to client
            if (result.error) {
              if (location === "during result fetch") {
                return res.status(200).send({
                  ok: 0,
                  reason: "server error",
                  msg: `Įrašas redaguotas sėkmingai, bet atsisiunčiant rezultatą iš DB, įvyko DB klaida. Siūloma atnaujinti įrašus programoje`,
                  item: {}
                });
              } else {
                return next(result.error);
              }
            }

            // returning result to client
            return res.status(200).send({
              ok: 1,
              item: result.success,
              msg: 'Įrašas sėkmingai redaguotas'              
            });
          })
          .catch(next);
      })
      .catch(next);
  }
);

// @route PUT api/items/insert
// @desc Insert item
// @access Public
router.put("/insert", checkPermissions("insert", "kurti"), (req, res, next) => {
  const coll = res.locals.coll;
  const itype = res.locals.itype;

  // validate draft here. returns either {errors: []} or {item: {}}
  // console.log("draft before validation", req.body.draft);
  const validated = validateItem(req.body.main, req.body.journal, itype, true);
  if (validated.errors) {
    throw {
      status: 400,
      reason: "bad draft",
      errors: validated.errors
    };
  }

  let main = validated.item.main;
  let journal =
    validated.item.journal && validated.item.journal.insert
      ? validated.item.journal.insert
      : [];
  // delete journal.jid; // nėra reikalo, nes yra exclude in SQLStatements
  main.regbit = req.user.regbit;
  main.v = 0;
  // delete main.id; // nėra reikalo, nes yra exclude in SQLStatements

  // nuo čia vykdomos užklausos į db, reikalingas client
  pool
    .connect()
    .then(client => {
      // ŠITO BLOKO VIDUJE YRA client, result, inTransaction
      let inTransaction = false;
      let result = { error: null, success: {} };
      checkSamePlace(client, coll, "insert", main, main.regbit)
        .then(() => {
          // starting transaction
          client.query("BEGIN");
        })
        .then(() => {
          inTransaction = true;
          // update main
          let insertMainStmt = SQLStmts.INSERT_stmtFactory(itype, "main");
          const insertMain = insertMainStmt(main);
          return client.query(insertMain);
        })
        .then(succ => checkResultCount.single(succ))
        .then(succ => {
          result.success.main = succ.rows[0];
          const mainid = succ.rows[0].id;

          // insert journal
          const journalInsertStmt = SQLStmts.INSERT_stmtFactory(
            itype,
            "journal"
          );

          return Promise.all(
            journal.map(j => {
              j.mainid = mainid;
              const journalInsert = journalInsertStmt(j);
              return client.query(journalInsert);
            })
          );
        })
        .then(succ => checkResultCount.multi(succ, journal.length))
        .then(succ => {
          result.success.journal = succ.map(s => s.rows[0]);
          // baigiama transaction
          return client.query("COMMIT");
        })
        .catch(e => {
          result.error = e;
          if (inTransaction) {
            return client.query("ROLLBACK");
          }
        })
        .catch(e => {
          // pasigaunama ROLLBACK error
          result.error.rollback.error = e;
          result.error.rollback.draft = {
            main: req.body.main,
            journal: req.body.journal
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
          return res.status(200).send({
            item: result.success,
            msg: `Įrašas sėkmingai sukurtas, jo id:${result.success.main.id}}`
          });
        })
        .catch(next);
    })
    .catch(next);
});

// @route DELETE api/items/delete
// @desc Delete item
// @access Public
router.delete(
  "/delete",
  checkPermissions("delete", "naikinti"),
  (req, res, next) => {
    const coll = res.locals.coll;
    const itype = res.locals.itype;

    const mainData = [
      parseInt(req.query.id),
      req.user.regbit,
      parseInt(req.query.v)
    ];

    pool
      .connect()
      .then(client => {
        // Čia ne transakcija, bet cascaded delete
        // todėl naudoju client
        const deleteMain = SQLStmts.DELETE_MAIN_stmt(itype);
        return client.query(deleteMain, mainData);
      })
      .then(succ => {
        if (succ.rowCount > 0) {
          return res.status(200).send({
            msg: `${coll.itemNames.Item}, kurio id:${mainData[0]}, pašalintas`,
            id: mainData[0]
          });
        } else {
          throw {
            status: 400,
            msg: `Neištrintas, id:${
              mainData[0]
            } nėra arba yra kažkieno redaguotas`
          };
        }
      })
      .catch(next);
  }
);

module.exports = router;
