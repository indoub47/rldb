function checkPermissions(action, actionName) {
  // must go after getCollection middleware
  return function(req, res, next) {
    if (!res.locals.coll.permissions[action].includes(req.user.role)) {
      return res.status(403).send({
        ok: 0,
        reason: "no permission",
        msg: `tu neturi teisės ${actionName} ${res.locals.coll.itemNames.Item} įrašų`
      });
    } 
    next(); 
  }
}

module.exports = checkPermissions;