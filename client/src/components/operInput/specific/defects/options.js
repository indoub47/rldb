  
import { createOptions } from "../../../createOptions";
  
const options = (things) => ({
  meistrija: createOptions(
    things.meistrija.sort((m1, m2) => m1.ind - m2.ind),
    "-- nenurodyta --",
    x => x.abbr + ", " + x.name
  ),
  kkateg: createOptions(
    things.kkateg,
    "-- nenurodyta --",
    x => x.id
  ),
  btipas: createOptions(
    things.btipas,
    "-- nenurodyta --",
    x => x.id
  ),
  bgamykl: createOptions(
    things.bgamykl,
    "-- nenurodyta --",
    x => x.id
  ),
  siule: createOptions(
    things.siule,
    "-- nenurodyta --",
    x => x.id
  ),
  pavoj: createOptions(
    things.pavoj.sort((p1, p2) => p1.ind - p2.ind),
    "-- nenurodyta --",
    x => x.id
  ),
  apar: createOptions(
    things.defskop.sort((d1, d2) => d1.id - d2.id),
    "-- nenurodyta --",
    x => x.id
  ),
  oper: createOptions(
    things.operat.sort((o1, o2) => o1.name - o2.name),
    "-- nenurodyta --",
    x => x.id + ", " + x.name
  )
});

export default options;