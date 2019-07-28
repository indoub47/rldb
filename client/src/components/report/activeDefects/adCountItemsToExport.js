export const itemsToExport = report => {
  //{meistrija: {kkateg: {..., pavoj[{..., count: x}]}}}

  let items = [];
  report.forEach(meistrija => {
    meistrija.kkateg.forEach(kkateg => {
      kkateg.pavoj.forEach(pavoj => {
        items.push({ meistrija, kkateg, pavoj, count: pavoj.count });
      });
    });
  });
  return items;
};
