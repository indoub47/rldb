function fetchResult(msgAtliktas) {
  // must go after getCollections middleware!
  return function(req, res) {
    const {coll, mainId, draftMain, draftJournal, db} = res.locals;
    try {
      const resultMain = db.prepare(`SELECT * FROM ${coll.tables.main.name} WHERE id = ?`).get(mainId);
      const resultJournal = db.prepare(`SELECT * FROM ${coll.tables.journal.name} WHERE mainid = ?`).all(mainId);
      return res.status(200).send({
        ok: 1,
        msg: `${coll.itemNames.Item}, kurio ID ${mainId}, sėkmingai ${msgAtliktas}`,
        item: {main: resultMain, journal: resultJournal}
      });
    } catch (error) {
      console.error(error);
      return res.status(200).send({
        ok: 0,
        reason: "server error",
        msg: `${coll.itemNames.Item}, kurio ID ${mainId}, buvo ${msgAtliktas}, bet mėginant atsisiųsti įrašą iš DB, įvyko DB klaida. Siūloma atnaujinti įrašus programoje`,
        item: {draftMain, drafJournal}
      });
    }
  }
}

module.exports = fetchResult;
