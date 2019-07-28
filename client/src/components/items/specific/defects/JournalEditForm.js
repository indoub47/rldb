import React from "react";
import Alert from "../../../common/Alert";
import TextFieldGroup from "../../../common/TextFieldGroup";
import SelectInputGroup from "../../../common/SelectInputGroup";
import absent from "../../../../utils/absent-props";

const JournalEditForm = ({ jItem, onChange, options, submitJItem, cancelJItem, alert }) => {
  
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
          divClassname="form-group col-4"
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
          divClassname="form-group col-4"
          value={absent(jItem.oper)}
          options={options.oper}
          onChange={onChange}
        />
        <SelectInputGroup
          id="jitem-apar"
          name="apar"
          label="Defektoskopas"
          divClassname="form-group col-4"
          value={absent(jItem.apar)}
          options={options.apar}
          onChange={onChange}
        />
      </div>
      <div className="form-group row text-center">
        <TextFieldGroup
          label="Kodas"
          divClassname="form-group col-3"
          id="jitem-kodas"
          name="kodas"
          placeholder="Kodas"
          value={absent(jItem.kodas)}
          onChange={onChange}
        />
        <TextFieldGroup
          label="L"
          divClassname="form-group col-2"
          id="jitem-dl"
          name="dl"
          placeholder="L"
          value={absent(jItem.dl)}
          onChange={onChange}
        />
        <TextFieldGroup
          label="H"
          divClassname="form-group col-2"
          id="jitem-dh"
          name="dh"
          placeholder="H"
          value={absent(jItem.dh)}
          onChange={onChange}
        />
        <SelectInputGroup
          id="jitem-pavoj"
          name="pavoj"
          label="Pavojingumas"
          divClassname="form-group col-2"
          value={absent(jItem.pavoj)}
          options={options.pavoj}
          onChange={onChange}
        />
        <TextFieldGroup
          label="Terminas"
          divClassname="form-group col-3"
          type="date"
          id="jitem-termin"
          name="dtermin"
          value={absent(jItem.dtermin)}
          onChange={onChange}
        />
      </div>
      <div className="form-group row pastaba text-center">
        <TextFieldGroup
          label="Pastaba"
          divClassname="form-group col-12"
          placeholder="Pastaba"
          id="jitem-note"
          name="note"
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
