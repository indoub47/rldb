function liko(defect) {
  if (!defect.dtermin || defect.dstop) return "";
  return Math.floor((Date.parse(defect.dtermin) - Date.now())/86400000)
}

export {liko};