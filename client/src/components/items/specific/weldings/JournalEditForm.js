import React from "react";
import Alert from "../../../common/Alert";
import TextFieldGroup from "../../../common/TextFieldGroup";
import SelectInputGroup from "../../../common/SelectInputGroup";
import absent from "../../../../utils/absent-props";

const JournalEditForm = ({ jItem, onChange, options, submitJItem, cancelJItem, alert }) => {

  //console.log("jItem", jItem);
  //console.log("absent(jItem.oper), absent(jItem.apar)", absent(jItem.oper), absent(jItem.apar));
  
  return (
    <div className="container journal-info border border-primary text-center">
      <div className="form-group row text-center">
        {alert ? (
          <div className="col-12">
            <Alert message={alert.msg} type={alert.type} />
          </div>
        ) : null}
      </div>
      <div className="form-group row text-center">
        <TextFieldGroup
          label="Data"
          divClassname="form-group col-3"
          type="date"
          id="jitem-data"
          name="data"
          value={absent(jItem.data)}
          onChange={onChange}
        />
        <SelectInputGroup
          id="jitem-oper"
          name="oper"
          label="Operatorius"
          divClassname="form-group col-3"
          value={absent(jItem.oper)}
          options={options.oper}
          onChange={onChange}
        />
        <SelectInputGroup
          id="jitem-apar"
          name="apar"
          label="Defektoskopas"
          divClassname="form-group col-3"
          value={absent(jItem.apar)}
          options={options.apar}
          onChange={onChange}
        />
      </div>
      <div className="form-group row text-center">
        <SelectInputGroup
          id="jitem-pvd"
          name="pvd"
          label="Pavadinimas"
          divClassname="form-group col-3"
          value={absent(jItem.pvd)}
          options={options.vpvd}
          onChange={onChange}
        />
        <TextFieldGroup
          divClassname="form-group col-9"
          label="Pastaba"
          id="jitem-jnote"
          name="note"
          placeholder="Pastaba"
          value={absent(jItem.note)}
          onChange={onChange}
        />
      </div> 
      <div className="form-group row controls text-center">
        <div className="form-group col-3">
          <button type="submit" className="btn btn-primary" onClick={submitJItem}>
            Submit This Journal Record
          </button>
        </div>
        <div className="form-group col-3">
          <button type="submit" className="btn btn-light" onClick={cancelJItem}>
            Clear
          </button>
        </div>
      </div> 
    </div>
  );
};

export { JournalEditForm };
