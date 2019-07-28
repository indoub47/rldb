import * as rtypes from "../../reportTypes";
import {UDDataDefectsTransformer} from "./defectsUndone/UDDataDefectsTransformer";
import {UDDataNumberTransformer} from "./defectsUndone/UDDataNumberTransformer";
import {K33DataTransformer} from "./k33/K33DataTransformer";
import {ToInspectDataTransformer} from "./toInspect/ToInspectDataTransformer";

const reporterMap = {
  [rtypes.defectsUndone]: {
     apiUrl: "/api/report/defects-undone",
     DataTransformerClass: UDDataDefectsTransformer
  },
  [rtypes.defectsUndoneCount]: {
     apiUrl: "/api/report/defects-undone-count",
     DataTransformerClass: UDDataNumberTransformer
  },
  [rtypes.k33]: {
     apiUrl: "/api/report/k33",
     DataTransformerClass: K33DataTransformer
  },
  [rtypes.toInspect]: {
     apiUrl: "/api/report/to-inspect",
     DataTransformerClass: ToInspectDataTransformer
  }
}

export default reporterMap;