// const queryFactory = require("../SQLStatements").QUERY_IF_SAME_LOCATION_stmtFactory;

// function queryIfSamePlace(coll, action, main, regbit, db) {
//   return queryFactory(db, coll, action).get(main, regbit);
// }

// // check if there exist some record with the same place
// function checkSamePlaceSqlite(main, action, msgUndone, res, req, db, ref) {
//   ref.result = false;
//   const coll = res.locals.coll;
//   if (coll.samePlace) {
//     try {
//       const samePlaceItem = queryIfSamePlace(coll, action, main, req.user.regbit, db);
//       if (samePlaceItem) {
//         ref.result = true;
//         return res.status(400).send({
//           ok: 0,
//           reason: "bad draft",
//           msg: `${coll.itemNames.Item} ${msgUndone} - šitoje vietoje jau yra įrašas, jo ID: ${samePlaceItem.id}`
//         });
//       }
//     } catch (error) {
//       ref.result = error;
//       console.error(error);
//       return res.status(500).send({
//         ok: 0,
//         reason: "server error",
//         msg: `Serverio klaida, mėginant patikrinti, ar toje pačioje vietoje yra kitas ${coll.itemNames.item}`
//       });
//     }    
//   }
// } 

function checkSamePlace(db, config, action, main, regbit) {
// patikrinti ar toje pačioje vietoje nėra įrašo
// jeigu įrašas yra, išmeta klaidą
// o jeigu įrašo nėra, grąžina false
  return new Promise((resolve, reject) => {
    const filter = `${config.samePlaceFilter[action].text} AND ${
      config.notPanaikinta
    }`;
    const spStmtText = `SELECT * FROM ${config.tables.main.name} ${filter}`;
    const spValues = [
      ...config.samePlaceFilter[action].mainKeys.map(k => main[k]),
      regbit
    ];
    db.query(spStmtText, spValues)
      .then(succ => {
        if (succ.rowCount > 0) {
          reject({
            status: 400,
            reason: "bad draft",
            msg: `Šitoje vietoje jau yra įrašas, jo id: ${succ.rows[0].id}`
          });
        } else {
          resolve(false);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}

// module.exports.queryFactory = queryFactory;
// module.exports.bareQuery = queryIfSamePlace;
// module.exports.fullReqRes = checkSamePlaceSqlite;
module.exports = checkSamePlace;


