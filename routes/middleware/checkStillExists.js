/*
const textFactory = coll =>
  `SELECT * FROM ${coll.tables.main.name} WHERE id = $1 AND regbit = $2`;

const queryObject = (mainId, coll, regbit) => ({
  text: queryFactory(coll),
  values: [mainId, regbit]
});

function checkIfExists(mainId, req, res, db, ref) {
  // just check if still exists
  const coll = res.locals.coll;
  ref.result = null;
  try {
    const found = queryIfItemExists(mainId, coll, req.user.regbit, db);
    if (!found) {
      return res.status(404).send({
        ok: 0,
        reason: "bad criteria",
        msg: `${coll.itemNames.Item}, kurio ID ${mainId}, nepakeistas, nes yra ištrintas iš serverio`
      });
    }
    ref.result = found;
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: 0,
      reason: "server error",
      msg: "Serverio klaida, mėginant atsisiųsti originalų objektą"
    });
  }
}
*/

function checkStillExists(db, tableName, id, regbit) {
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM ${tableName} WHERE id = $1 AND regbit = $2`, [id, regbit])
      .then(succ => {
        if (succ.rowCount === 0) {
          reject({
            status: 404,
            reason: "bad criteria",
            msg: `Operacija neatlikta, nes įrašas ištrintas iš db`
          });
        } else resolve(succ.rows[0]);
      })
      .catch(err => reject(err));
  });
}

// module.exports.textFactory = textFactory;
// module.exports.queryObject = queryObject;
// module.exports.fullReqRes = checkIfExists;
module.exports = checkStillExists;
