  
import { createOptions } from "../../../createOptions";
  
const options = (things) => ({
  vbudas: createOptions(
    things.vbudas.sort((m1, m2) => m1.ind - m2.ind),
    "-- nenurodyta --",
    x => x.id + ", " + x.name
  ),
  virino: createOptions(
    things.virino,
    "-- nenurodyta --",
    x => x.id
  ),
  vpvd: createOptions(
    things.vpvd,
    "-- nenurodyta --",        
    x => x.pvdname,
    x => x.pvdid,
    x => x.pvdid
  ),
  siule: createOptions(
    things.siule,
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