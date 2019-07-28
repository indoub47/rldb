const collectionOptions = require("../../config/collections");

function getCollection(req, res, next) {
  const itype = req.body.itype || req.query.itype;
  const coll = collectionOptions[itype];
  if (!coll) return res.status(400).send({
    ok: 0,
    reason: "bad criteria",
    msg: "no collection " + itype
  });
  //let locals = res.locals || {};
  res.locals.coll = coll;
  res.locals.itype = itype;
  
  //res.locals = locals;
  next();
}

module.exports = getCollection;


