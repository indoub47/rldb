const express = require("express");
const router = express.Router();
const passport = require("passport");

const { Client, Pool } = require("pg");
const pool = new Pool();

const Database = require("better-sqlite3");
const db = new Database("./db/dnbl.sqlite", {
  verbose: console.log,
  fileMustExist: true
});
//const collectionOptions = require("../../config/collections");
const SQLStmts = require("../SQLStatements");
const getCollection = require("../middleware/getCollection");
const checkPermissions = require("../middleware/checkPermissions");
const checkSamePlace = require("../middleware/checkSamePlace").fullReqRes;
const checkIfExists = require("../middleware/checkIfExists").queryObject;
const checkIfVMatch = require("../middleware/checkIfVMatch");
const fetchResult = require("../middleware/fetchResult");
const transactions = require("../transactions");
const validateItem = require("../../validation/validate").validateItem;

const begin = db.prepare("BEGIN");
const commit = db.prepare("COMMIT");
const rollback = db.prepare("ROLLBACK");

//db.defaultSafeIntegers();

// A function that always runs in a transaction
function asTransactionSQLITE(func) {
  return function(...args) {
    begin.run();
    try {
      func(...args);
      commit.run();
    } finally {
      if (db.inTransaction) rollback.run();
    }
  };
}

function asTransaction(func) {

}

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
    return res.status(stmt.error.status).send({
      ok: 0,
      reason: "bad criteria",
      msg: stmt.error.message
    });
  }

  pool
    .query(stmt)
    .then(succ => {
      if (succ.rows.length === 0) {
        res.status(400).send({
          ok: 1,
          msg: "Rezultatų nerasta."
        });
      } else if (succ.rows.length > 20) {
        res.status(400).send({
          ok: 1,
          msg: "Per daug rezultatų. Siaurinkite užklausą."
        });
      } else {
        res.status(200).send(succ.rows);
      }
    })
    .catch(error => {
      res.status(500).send(error);
    });
});

// @route GET api/items
// @desc Get nepanaikinti items
// @access Public
router.get("/", (req, res, next) => {
  const tableName = req.query.all
    ? res.locals.coll.tables.viewAllLastJ.name
    : res.locals.coll.tables.viewActiveLastJ.name;
  const filter = "regbit = $1";
  const stmtText = `SELECT * FROM ${tableName} WHERE ${filter}`;
  pool
    .query(stmtText, [req.user.regbit])
    .then(succ => res.status(200).send(succ.rows))
    .catch(error => {
      console.error(error);
      res.status(500).send(error);
    });
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
    console.log("-- start draft validation");
    // validate draft here. returns either {errors: []} or {item: {}}
    const result = validateItem(req.body.main, req.body.journal, itype, false);

    // result.errors = "1"; // imituojama validation errors

    console.log("-- draft validation ended");
    if (result.errors) {
      console.log("-- draft validated with errors");
      return res.status(400).json({
        ok: 0,
        reason: "bad draft",
        errors: result.errors
      });
    }    
    console.log("-- draft validated ok");
    // throw "error before transaction";
    // apdoroja default hander, meta html
    let main = result.item.main;
    main.regbit = req.user.regbit;
    let journal = result.item.journal;
    const mainId = main.id;
    const tableMain = coll.tables.main.name;
    const tableJournal = coll.tables.journal.name;

    // patikrinti ar vis dar egzistuoja
    console.log("-- bus mėginama tikrinti ar vis dar egzistuoja");
    console.log("-- bus vykdoma pool.connect, čia dar neturėtų būti kliento");
    console.log("-- 0. pool all, idle, waiting", pool.totalCount, pool.idleCount, pool.waitingCount);
    // transaction
    pool.connect()
      .then(client => {
        // ŠITO BLOKO VIDUJE YRA CLIENT, RESULT, INTRANSACTION
        console.log("-- įvykdyta pool.connect, čia turėtų būti klientas");
        console.log("-- 1. pool all, idle, waiting", pool.totalCount, pool.idleCount, pool.waitingCount);
        let location = "before transaction";
        let result = {errors: [], item: null};
        console.log("-- ruošiamasi async tikrinti ar vis dar egzistuoja");
        // throw "prieš tikrinant ar egzistuoja"; // nereleasina kliento
        client.query(`SELECT * FROM ${tableMain} WHERE id = $1 AND regbit = $2`, [mainId, req.user.regbit])
          .then(succ => {
            //throw "error in async2";   
            console.log("-- 2. pool all, idle, waiting", pool.totalCount, pool.idleCount, pool.waitingCount);       
            console.log("-- tikrinama ar vis dar egzistuoja - parsisiųstas main");
            if (succ.rows.length === 0) {
              console.log("-- įrašas nerastas, matyt ištrintas, throwing");
              throw {
                status: 404,
                ok: 0,
                reason: "bad criteria",
                msg: `${coll.itemNames.Item}, kurio ID ${mainId}, nepakeistas, nes yra ištrintas iš serverio`
              }
            }
            console.log("-- įrašas vis dar egzistuoja, OK")
            const found = succ.rows[0];
            console.log("-- tikrinamos versijos");
            // patikrinti versiją
            if (found.v !== main.v) {
              console.log("-- versijos nesutampa, throwing");
              throw {
                status: 409,
                ok: 0,
                reason: "bad criteria",
                msg: `${coll.itemNames.Item}, kurio ID ${mainId}, nepakeistas, nes skiriasi versijos; galbūt jis ką tik buvo redaguotas kažkieno kito`
              }
            }
            console.log("-- versijos sutampa, OK")
            //throw "dėl viso pikto";

            // patikrinti ar toje pačioje vietoje nėra įrašo
            const samePlaceFilter = `${coll.samePlaceFilter["update"]} AND ${coll.notPanaikinta}`;
            const spStmtText = `SELECT * FROM ${tableMain} ${samePlaceFilter}`;
            const spValues = [
              main.linija,
              main.kelias,
              main.km,
              main.pk,
              main.m,
              main.siule,
              mainId,
              req.user.regbit
            ];
            console.log("-- ruošiamasi async tikrinti, ar toje pačioje vietoje nėra įrašo");        
            return client.query(spStmtText, spValues);
          })
          .then(succ => {
            console.log("-- 3. pool all, idle, waiting", pool.totalCount, pool.idleCount, pool.waitingCount);
            //throw "error in async 3";
            // succ.rows.push({id: "bla bla bla"});
            if (succ.rows.length > 0) {
              console.log("-- toje pačioje vietoje įrašas yra, throwing");
              throw {
                status: 400,
                ok: 0,
                reason: "bad draft",
                msg: `Šitoje vietoje jau yra įrašas, jo ID: ${succ.rows[0].id}`
              }
            }
            console.log("-- toje pačioj vietoje įrašo nėra, OK");

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

            console.log("-- PRADEDAMA UPDATE TRANSAKCIJA");
            console.log("-- ruošiamasi async BEGIN");
            // transaction
            return client.query('BEGIN');
          })
          .then(() => {   
            location = "in transaction";    
            console.log("-- 4. pool all, idle, waiting", pool.totalCount, pool.idleCount, pool.waitingCount);
            console.log("-- transaction has BEGUN"); 
            const updateMainStmt = SQLStmts.UPDATE_stmtFactory(itype, "main");
            const updateMain = updateMainStmt(main);
            updateMain.values = [...updateMain.values, main.id, main.regbit];
            //console.log("--- updateMain.text", updateMain.text);
            //console.log("--- updateMain.values", updateMain.values);
            //throw "transakcijos veiksmai neprasidėjo, bet begin buvo paleistas";
            console.log("-- ruošiamasi async update main"); 
            //throw "error trans then.then1"  ; 
            return client.query(updateMain);
          })
          .then(() => {
            console.log("-- 5. pool all, idle, waiting", pool.totalCount, pool.idleCount, pool.waitingCount);
            console.log("-- main updated"); 
            //throw "kitas transakcijos veiksmas ruošiamas";              
            if (journal.update) {
              const journalUpdateStmt = SQLStmts.UPDATE_stmtFactory(itype, "journal");
              return Promise.all(journal.update.map(j => {
                const journalUpdate = journalUpdateStmt(j);
                journalUpdate.values = [...journalUpdate.values, j.jid, main.id];
                //console.log("--- journalUpdate.text", journalUpdate.text);
                //console.log("--- journalUpdate.values", journalUpdate.values);
                console.log("-- ruošiamasi async journal update");
                return client.query(journalUpdate);
              }));
            }
            console.log("-- no journal update, grąžinamas tuščias promise");
          })
          .then(() => {
            console.log("-- 6. pool all, idle, waiting", pool.totalCount, pool.idleCount, pool.waitingCount);
            console.log("-- journal updated"); 
            //throw "kitas transakcijos veiksmas ruošiamas";
            if (journal.insert) {
              const journalInsertStmt = SQLStmts.INSERT_stmtFactory(itype, "journal");
              console.log("-- 3. client inside", client != null);        
              return Promise.all(journal.insert.map(j => {
                const journalInsert = journalInsertStmt(j);
                //console.log("--- journalInsert.text", journalInsert.text);
                //console.log("--- journalInsert.values", journalInsert.values);
                console.log("-- ruošiamasi async journal insert"); 
                return client.query(journalInsert);
              }));
            }
            console.log("-- no journal insert, grąžinamas tuščias promise");
          })
          .then(() => {          
            console.log("-- 7. pool all, idle, waiting", pool.totalCount, pool.idleCount, pool.waitingCount);
            console.log("-- journal inserted");
            if (journal.delete) {
              const deleteSomeJournalStmt = SQLStmts.DELETE_SOME_JOURNAL_stmt(itype, journal.delete, main.id);
              console.log("-- ruošiamasi async journal delete");  
              return client.query(deleteSomeJournalStmt);
            }
            throw "4 transakcijos veiksmas ruošiamas";
            console.log("-- no journal delete, grąžinamas tuščias promise");
          })
          .then(() => {
            console.log("-- 8. pool all, idle, waiting", pool.totalCount, pool.idleCount, pool.waitingCount);
            console.log("-- ruošiamasi async COMMIT"); 
            return client.query('COMMIT');
          })
          .then(() => { 
            console.log("-- 9. pool all, idle, waiting", pool.totalCount, pool.idleCount, pool.waitingCount);
            console.log("-- transaction COMMITTED");
            location = "in fetch result";
            const fetchMain = {text: `SELECT * FROM ${tableMain} WHERE id = $1`, values: [mainId]};
            console.log("-- ruošiamasi async fetch Main"); 
            return client.query(fetchMain);              
          })
          .then(succ => {
            console.log("-- 10. pool all, idle, waiting", pool.totalCount, pool.idleCount, pool.waitingCount);
            console.log("-- result main fetched");
            result.item = {main: succ.rows[0]};
            const fetchJournal = {text: `SELECT * FROM ${tableJournal} WHERE mainid = $1`, values: [mainId]};
            console.log("-- ruošiamasi async fetch journal");
            return client.query(fetchJournal);
          })
          .then(succ => {
            console.log("-- 11. pool all, idle, waiting", pool.totalCount, pool.idleCount, pool.waitingCount);
            console.log("-- result journal fetched");
            result.item.journal = succ.rows;
            console.log("-- result suformuotas, grąžinamas tuščias promise");
          })
          .catch(e => {
            // pasigaunama async veiksmų error;
            console.log("-- CATCH-1 pool all, idle, waiting", pool.totalCount, pool.idleCount, pool.waitingCount);
            console.log("KLAIDA " + location);
            console.error(e);
            console.log("-- toliau bus daroma push errors.push(e)");
            result.errors.push(e.message ? e.message : e); // išsaugoma, nes po to, kai klientas bus releasintas, reikės rethrowinti
            console.log("-- buvo atlikta errors.push(e)");
            if (location === "in transaction") {
              console.log("-- kadangi in transaction, ruošiamasi async ROLLBACK");
              location = "during rollback";
              return client.query('ROLLBACKkkk');
              console.log("****** ŠITO NETURI BŪTI");
            }
            console.log("-- rollback nereikia, grąžinamas tuščias promise");
          })
          .then(() => {
            console.log("-- CATCH1-THEN pool all, idle, waiting", pool.totalCount, pool.idleCount, pool.waitingCount);
            console.log("-- rollback success (if needed), changing location");
            console.log("-- returning empty promise");
          })
          .catch(e => {
            console.error(e);
            console.log("-- CATCH2 pool all, idle, waiting", pool.totalCount, pool.idleCount, pool.waitingCount);
            console.log("-- rollback error, pushing into result.errors");
            result.errors.push(e.message ? e.message : e);
          })
          .then(() => {
            console.log("-- CATCH2-THEN pool all, idle, waiting", pool.totalCount, pool.idleCount, pool.waitingCount);
            console.log("-- async release client");            
            return client.release('aaaa');
          })
          .then(() => {
            console.log("-- CATCH2-THEN2 pool all, idle, waiting", pool.totalCount, pool.idleCount, pool.waitingCount);
            console.log("-- release success");
            console.log("-- returning empty promise");
          })
          .catch(error => {
            console.log("-- CATCH3 pool all, idle, waiting", pool.totalCount, pool.idleCount, pool.waitingCount);
            console.log("-- release error, showing in console");
            console.error(error);
          })
          .then(() => {
            console.log("-- CATCH3-THEN pool all, idle, waiting", pool.totalCount, pool.idleCount, pool.waitingCount);
            console.log("-- returning result or error to client");
            if (result.errors.length) {
              return res.status(400).send(result);
            }
            return res.status(200).send(result);
          })
          .catch(e => {
            console.log("-- CATCH4 pool all, idle, waiting", pool.totalCount, pool.idleCount, pool.waitingCount);
            console.log("-- SOME WEIRD ERROR");
            console.error(e);
          });
      })
      .catch(error => { // pool.connect
        console.log("-- OUTER CATCH pool all, idle, waiting", pool.totalCount, pool.idleCount, pool.waitingCount);
        res.status(500).send("pool connect error");
      });
  });


// @route POST api/items/update
// @desc Update item and increment version
// @access Public
router.post(
  "/update-sqlite",
  checkPermissions("update", "redaguoti"),
  (req, res, next) => {
    const coll = res.locals.coll;
    const itype = res.locals.itype;

    // validate draft here. returns either {errors: []} or {item: {}}
    const result = validateItem(req.body.main, req.body.journal, itype, false);

    if (result.errors) {
      return res.status(400).json({
        ok: 0,
        reason: "bad draft",
        errors: result.errors
      });
    }

    let main = result.item.main;
    main.regbit = req.user.regbit;
    let journal = result.item.journal;
    const mainId = main.id;

    // just check if still exists
    let ref = {};
    checkIfExists(mainId, req, res, db, ref);
    if (!ref.result) return;
    const found = ref.result;

    // check if draft version equals db version
    checkIfVMatch(found.v, main.v, res, ref);
    if (!ref.result) return;

    // check if there exist some record with the same place
    checkSamePlace(main, "update", "neredaguotas", res, req, db, ref);
    if (ref.result) return; // ref.result = true or error

    // same place not found, update item
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
    const updateItem = asTransaction(transactions.update);
    let returnRef = {};
    //console.log("journal.insert before update", journal.insert);
    try {
      updateItem(itype, main, journal, returnRef, db);
    } catch (err) {
      console.error(err);
      return res.status(500).send({
        ok: 0,
        reason: "server error",
        msg: "Nepavyko redaguoti objekto DB"
      });
    }

    res.locals.mainId = mainId;
    res.locals.draftMain = main;
    res.locals.draftJournal = journal;
    res.locals.db = db;
    next();
  },
  fetchResult("redaguotas")
);

// @route PUT api/items/insert
// @desc Insert item
// @access Public
router.put(
  "/insert",
  checkPermissions("insert", "kurti"),
  (req, res, next) => {
    //console.log("res.locals", res.locals);

    const coll = res.locals.coll;
    const itype = res.locals.itype;

    // validate draft here. returns either {errors: []} or {item: {}}
    // console.log("draft before validation", req.body.draft);
    const result = validateItem(req.body.main, req.body.journal, itype, true);

    if (result.errors) {
      // console.log("validation result", result);
      return res.status(400).send({
        ok: 0,
        reason: "bad draft",
        errors: result.errors
      });
    }

    let main = result.item.main;
    let journal = result.item.journal;
    // delete journal.jid; // nėra reikalo, nes yra exclude

    main.regbit = req.user.regbit;
    main.v = 0;
    // delete main.id; // nėra reikalo, nes yra exclude

    // check if there exist some record with the same place
    let ref = {};
    checkSamePlace(main, "insert", "nesukurtas", res, req, db, ref);
    if (ref.result) return;

    const insertItem = asTransaction(transactions.insert);
    let returnRef = {};

    try {
      insertItem(itype, main, journal, returnRef, db);
    } catch (err) {
      console.error(err);
      return res.status(500).send({
        ok: 0,
        reason: "server error",
        msg: "Nepavyko įrašyti naujo objekto į DB"
      });
    }

    res.locals.mainId = returnRef.mainInfo.lastInsertRowid;
    res.locals.draftMain = main;
    res.locals.draftJournal = journal;
    res.locals.db = db;
    next();
  },
  fetchResult("sukurtas")
);

// @route DELETE api/items/delete
// @desc Delete item
// @access Public
router.delete(
  "/delete",
  checkPermissions("delete", "naikinti"),
  (req, res, next) => {
    const coll = res.locals.coll;
    const itype = res.locals.itype;

    let returnRef = {};
    const mainData = {
      id: parseInt(req.query.id),
      v: parseInt(req.query.v),
      regbit: req.user.regbit
    };

    const deleteItem = asTransaction(transactions.delete);

    deleteItem(itype, mainData, returnRef, db);
    if (returnRef.mainInfo.changes < 1) {
      return res.status(500).send({
        ok: 0,
        reason: "unknown",
        msg: `${coll.itemNames.Item} nebuvo pašalintas, nes arba įvyko serverio klaida, arba toks id nerastas, arba nesutampa versijos.`
      });
    } else {
      return res.status(200).send({
        ok: 1,
        msg: `${coll.itemNames.Item}, kurio id ${req.query.id}, pašalintas`,
        id: parseInt(req.query.id)
      });
    }
  }
);

module.exports = router;
