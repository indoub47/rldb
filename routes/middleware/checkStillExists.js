const fetchMainStmt = require('../SQLStatements').FETCH_MAIN_stmt;

module.exports = (db, itype, id, regbit) =>
  new Promise((resolve, reject) => {
    db.query(fetchMainStmt(id, itype, regbit))
      .then(succ => {
        if (succ.rowCount === 0) {
          reject({
            status: 404,
            reason: "not found",
            msg: "Operacija neatlikta, nes įrašas ištrintas iš db"
          });
        } else {
          resolve(succ.rows[0]);
        }
      })
      .catch(err => reject(err));
  });