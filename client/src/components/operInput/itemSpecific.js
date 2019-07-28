import * as iTypes from "../../itypes";

import * as defectApproveRow from "./specific/defects/ApproveRow";
import * as defectForm from "./specific/defects/EditForm";
import * as defectInputRow from "./specific/defects/InputRow";
import * as defectSearchForm from "./specific/defects/SearchForm";
import * as defectSearchResultRow from "./specific/defects/SearchResultRow";
import defectOptions from "./specific/defects/options";
import * as defectModel from "./specific/defects/model";

import * as weldingApproveRow from "./specific/weldings/ApproveRow";
import * as weldingForm from "./specific/weldings/EditForm";
import * as weldingInputRow from "./specific/weldings/InputRow";
import * as weldingSearchForm from "./specific/weldings/SearchForm";
import * as weldingSearchResultRow from "./specific/weldings/SearchResultRow";
import weldingOptions from "./specific/weldings/options";
import * as weldingModel from "./specific/weldings/model";


export default {
  [iTypes.defect]: {
        approveRow: defectApproveRow,
        inputForm: defectForm,
        iApproveEditForm: defectForm,
        inputRow: defectInputRow,
        searchForm: defectSearchForm,
        searchResultRow: defectSearchResultRow,
        model: defectModel,
        options: defectOptions
      },
  [iTypes.welding]: {
        approveRow: weldingApproveRow,
        inputForm: weldingForm,
        iApproveEditForm: weldingForm,
        inputRow: weldingInputRow,
        searchForm: weldingSearchForm,
        searchResultRow: weldingSearchResultRow,
        model: weldingModel,
        options: weldingOptions
      },
};