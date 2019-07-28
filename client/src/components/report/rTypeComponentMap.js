import ActiveDefectsTable from './activeDefects/ActiveDefectsTable';
import ActiveDefectsParamsCollector from './activeDefects/ActiveDefectsParamsCollector';
import {itemsToExport as adItemsToExport} from './activeDefects/adItemsToExport';
import {itemCount as adItemCount} from './activeDefects/adItemCount';
import ActiveDefectsCountTable from './activeDefects/ActiveDefectsCountTable';
import {itemsToExport as adCountItemsToExport} from './activeDefects/adCountItemsToExport';
import {itemCount as adCountItemCount} from './activeDefects/adCountItemCount';
import K33Table from './k33/K33Table';
import K33ParamsCollector from './k33/K33ParamsCollector';
import {itemCount as k33ItemCount} from './k33/itemCount';
import {itemsToExport as k33ItemsToExport} from './k33/itemsToExport';
import ToInspectTable from './toInspect/ToInspectTable';
import ToInspectParamsCollector from './toInspect/ToInspectParamsCollector';
import {itemsToExport as toInspectItemsToExport} from './toInspect/itemsToExport';
import {itemCount as toInspectItemCount} from './toInspect/itemCount';

import * as rtypes from '../../reportTypes';

const rTypeComponentMap = {
  [rtypes.defectsUndone]: {
    title: "Keliuose esantys defektai.",
    subtitle: "Tik pradelsti arba visi",
    paramsCollector: ActiveDefectsParamsCollector,    
    reportTable: ActiveDefectsTable,
    itemsToExportFormat: adItemsToExport, 
    itemCount: adItemCount
  },
  [rtypes.defectsUndoneCount]: {
    title: "Keliuose esančių defektų skaičiai.",
    subtitle: "Tik pradelstų arba visų",
    paramsCollector: ActiveDefectsParamsCollector,
    reportTable: ActiveDefectsCountTable,
    itemsToExportFormat: adCountItemsToExport,
    itemCount: adCountItemCount
  },
  [rtypes.k33]: {
    title: "Per periodą atliktas darbas.",
    subtitle: "Ataskaita K-33",
    paramsCollector: K33ParamsCollector,
    reportTable: K33Table,
    itemsToExportFormat: k33ItemsToExport,
    itemCount: k33ItemCount
  },
  [rtypes.toInspect]: {
    title: "Suvirinimai, kuriuos galima tikrinti.",
    subtitle: "",
    paramsCollector: ToInspectParamsCollector,
    reportTable: ToInspectTable,
    itemsToExportFormat: toInspectItemsToExport,
    itemCount: toInspectItemCount
  },
};

export default rTypeComponentMap;