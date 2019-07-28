function checkIfVMatch(foundV, mainV, res, ref) {
// check if versions match
  ref.result = true;
  if (foundV !== mainV) {
    ref.result = false;
    return res.status(409).send({
      ok: 0,
      reason: "bad criteria",
      msg: `${coll.itemNames.Item}, kurio ID ${mainId}, nepakeistas, nes skiriasi versijos; galbūt jis ką tik buvo redaguotas kažkieno kito`
    });
  }  
}

module.exports = checkIfVMatch;