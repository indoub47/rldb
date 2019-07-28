import React from "react";
import TextFieldGroup from "../../../common/TextFieldGroup";
import SelectInputGroup from "../../../common/SelectInputGroup";
import Alert from "../../../common/Alert";
import absent from "../../../../utils/splitAbsent";

const EditForm = ({ item, onChange, options, errors }) => {
  //console.log("item in EditForm", item);
  //console.log("absent meistrija", absent(item, "main", "meistrija"));
  const edit = item && item.main && item.main.id > 0;
  
  return (
    <form>
      {errors.common && <Alert message={errors.common} type="error" />}
      <div className="form-group row main-data text-center">
        <SelectInputGroup
          id="defect-meistrija"
          name="main.meistrija"
          label="Meistrija"
          divClassname="form-group col-4"
          value={absent(item, "main", "meistrija")}
          options={options.meistrija}
          onChange={onChange}
          disabled={edit}
          error={errors.meistrija}
        />
        <SelectInputGroup
          id="defect-kkateg"
          name="main.kkateg"
          label="Kelio kategorija"
          divClassname="form-group col-4"
          value={absent(item, "main", "kkateg")}
          options={options.kkateg}
          onChange={onChange}
          disabled={edit}
          error={errors.kkateg}
        />
      </div>
      <div className="form-group row begis text-center">
        <SelectInputGroup
          id="defect-btipas"
          divClassname="form-group col-4"
          name="main.btipas"
          label="Bėgio tipas"
          value={absent(item, "main", "btipas")}
          options={options.btipas}
          onChange={onChange}
          disabled={edit}
          error={errors.btipas}
        />
        <SelectInputGroup
          id="defect-bgamykl"
          divClassname="form-group col-4"
          name="main.bgamykl"
          label="Bėgio gamykla"
          value={absent(item, "main", "bgamykl")}
          options={options.bgamykl}
          onChange={onChange}
          disabled={edit}
          error={errors.bgamykl}
        />
        <TextFieldGroup
          divClassname="form-group col-4"
          label="Bėgio gam. metai"
          id="defect-bmetai"
          name="main.bmetai"
          placeholder="Bėgio gam. metai"
          value={absent(item, "main", "bmetai")}
          onChange={onChange}
          readonly={edit}
          error={errors.bmetai}
        />
      </div>

      <div className="form-group row vieta text-center">
        <TextFieldGroup
          label="Linija"
          divClassname="form-group col-2"
          id="defect-linija"
          name="main.linija"
          placeholder="Linija"
          value={absent(item, "main", "linija")}
          onChange={onChange}
          readonly={edit}
          error={errors.linija}
        />
        <TextFieldGroup
          label="Kelias"
          divClassname="form-group col-2"
          id="defect-kelias"
          name="main.kelias"
          placeholder="Kelio Nr."
          value={absent(item, "main", "kelias")}
          onChange={onChange}
          readonly={edit}
          error={errors.kelias}
        />
        <TextFieldGroup
          label="km"
          divClassname="form-group col-2"
          id="defect-km"
          name="main.km"
          placeholder="km"
          value={absent(item, "main", "km")}
          onChange={onChange}
          readonly={edit}
          error={errors.km}
        />
        <TextFieldGroup
          label="pk"
          divClassname="form-group col-2"
          id="defect-pk"
          name="main.pk"
          placeholder="pk"
          value={absent(item, "main", "pk")}
          onChange={onChange}
          readonly={edit}
          error={errors.pk}
        />
        <TextFieldGroup
          label="m"
          divClassname="form-group col-2"
          id="defect-m"
          name="main.m"
          placeholder="m"
          value={absent(item, "main", "m")}
          onChange={onChange}
          readonly={edit}
          error={errors.m}
        />
        <SelectInputGroup
          id="defect-siule"
          divClassname="form-group col-2"
          name="main.siule"
          label="Siūlė"
          value={absent(item, "main", "siule")}
          options={options.siule}
          onChange={onChange}
          disabled={edit}
          error={errors.siule}
        />
      </div>
      <div className="form-group row text-center">
        <TextFieldGroup
          label="Data"
          divClassname="form-group col-4"
          type="date"
          id="defect-data"
          name="journal.data"
          value={absent(item, "journal", "data")}
          onChange={onChange}
          error={errors.data}
        />
        <SelectInputGroup
          id="defect-oper"
          name="journal.oper"
          label="Operatorius"
          divClassname="form-group col-4"
          value={absent(item, "journal", "oper")}
          options={options.oper}
          onChange={onChange}
          error={errors.oper}
        />
        <SelectInputGroup
          id="defect-apar"
          name="journal.apar"
          label="Defektoskopas"
          divClassname="form-group col-4"
          value={absent(item, "journal", "apar")}
          options={options.apar}
          onChange={onChange}
          error={errors.apar}
        />
      </div>
      <div className="form-group row text-center">
        <TextFieldGroup
          label="Kodas"
          divClassname="form-group col-3"
          id="defect-kodas"
          name="journal.kodas"
          placeholder="Kodas"
          value={absent(item, "journal", "kodas")}
          onChange={onChange}
          error={errors.kodas}
        />
        <TextFieldGroup
          label="L"
          divClassname="form-group col-3"
          id="defect-dl"
          name="journal.dl"
          placeholder="L"
          value={absent(item, "journal", "dl")}
          onChange={onChange}
          error={errors.dl}
        />
        <TextFieldGroup
          label="H"
          divClassname="form-group col-3"
          id="defect-dh"
          name="journal.dh"
          placeholder="H"
          value={absent(item, "journal", "dh")}
          onChange={onChange}
          error={errors.dh}
        />
        <SelectInputGroup
          id="defect-pavoj"
          name="journal.pavoj"
          label="Pavojingumas"
          divClassname="form-group col-3"
          value={absent(item, "journal", "pavoj")}
          options={options.pavoj}
          onChange={onChange}
          error={errors.pavoj}
        />
      </div>
      <div className="form-group row text-center">
        <TextFieldGroup
          label="Terminas"
          divClassname="form-group col-3"
          type="date"
          id="defect-dtermin"
          name="journal.dtermin"
          value={absent(item, "journal", "dtermin")}
          onChange={onChange}
          error={errors.termin}
        />
        <TextFieldGroup
          label="Pastaba"
          divClassname="form-group col-9"
          id="defect-note"
          name="journal.note"
          placeholder="Pastaba"
          value={absent(item, "journal", "note")}
          onChange={onChange}
          error={errors.note}
        />
      </div>
    </form>
  );
};

export default EditForm;
