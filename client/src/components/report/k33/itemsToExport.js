export const itemsToExport = report => {
  return report.map(row => ({defskop: row.defskop, operat: row.operat, ...row.counts}));
  // pagalvoti, kaip daryti, jeigu kažkurio counts komponento nebus 
}