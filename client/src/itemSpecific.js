import * as defectReplacements from "./actions/functions/filterSort/replacements/defect";
import * as weldingReplacements from "./actions/functions/filterSort/replacements/welding";

import * as defectMainDataForm from "./components/items/specific/defects/MainDataForm";
import * as weldingMainDataForm from "./components/items/specific/weldings/MainDataForm";

import * as defectSingleRow from "./components/items/specific/defects/SingleRow";
import * as weldingSingleRow from "./components/items/specific/weldings/SingleRow";

import * as defectJournalEditForm from "./components/items/specific/defects/JournalEditForm";
import * as weldingJournalEditForm from "./components/items/specific/weldings/JournalEditForm";

import * as defectJournalRow from "./components/items/specific/defects/JournalRow";
import * as weldingJournalRow from "./components/items/specific/weldings/JournalRow";
import * as iTypes from "./itypes";


export default {
  [iTypes.defect]: {
        replacements: defectReplacements,
        mainDataForm: defectMainDataForm.MainDataForm,
        singleRow: defectSingleRow,
        journalEditForm: defectJournalEditForm.JournalEditForm,
        journalRow: defectJournalRow.JournalRow,
        journalListHead: defectJournalRow.JournalHeadRow,
        listPath: "/defects",
        panaikinta: item => !!item.dstop
      },
  [iTypes.welding]: {
        replacements: weldingReplacements,
        mainDataForm: weldingMainDataForm.MainDataForm,
        singleRow: weldingSingleRow,
        journalEditForm: weldingJournalEditForm.JournalEditForm,
        journalRow: weldingJournalRow.JournalRow,
        journalListHead: weldingJournalRow.JournalHeadRow,
        listPath: "/weldings",
        panaikinta: item => item.dstop === 0 || item.dstop === "0"
      }
};