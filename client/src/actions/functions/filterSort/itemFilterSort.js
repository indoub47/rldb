import {
  getFilterFunc,
  getSortFunc
} from "./functions/fsRoutines";
import itemSpecific from "../../../itemSpecific";




const funcCreator = (filterString, sortString, itype) => {
  const replacements = itemSpecific[itype].replacements;
  return {
    filter: getFilterFunc(filterString, replacements.filterReplacements),
    sort: getSortFunc(sortString, replacements.getSortingReplacement)
  };
}

export default funcCreator;