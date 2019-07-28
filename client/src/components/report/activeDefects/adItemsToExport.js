export const itemsToExport = report => {
  /*
    {meistrija:"...", defects: [{linija, kelias, km, pk, m, siule, kodas, pavoj, daptik, dtermin}]}
  */
  let items = [];
  report.forEach(m => {
    m.defects.forEach(def => {
      let defect = {...def}; 
      ensureAllProps(defect);
      defect.meistrija = m;
      items.push(defect)
    });
  });
  return items;  
}

const ensureAllProps = defect => {
  ["linija","kelias","km","pk","m","siule","kodas","pavoj", "daptik", "dtermin"].forEach(prop => {
    if (defect[prop] == null) defect[prop] = "";
  });
}