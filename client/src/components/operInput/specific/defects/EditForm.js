import React from "react";
import TextFieldGroup from "../../../common/TextFieldGroup";
import SelectInputGroup from "../../../common/SelectInputGroup";
import Alert from "../../../common/Alert";
import {absentMulti} from "../../../../utils/absentProps";

const EditForm = ({ item, onChange, options, errors }) => {
  //console.log("item in EditForm", item);
  //console.log("absent meistrija", absentMulti(item, "main", "meistrija"));
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
          value={absentMulti(item, "main", "meistrija")}
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
          value={absentMulti(item, "main", "kkateg")}
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
          value={absentMulti(item, "main", "btipas")}
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
          value={absentMulti(item, "main", "bgamykl")}
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
          value={absentMulti(item, "main", "bmetai")}
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
          value={absentMulti(item, "main", "linija")}
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
          value={absentMulti(item, "main", "kelias")}
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
          value={absentMulti(item, "main", "km")}
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
          value={absentMulti(item, "main", "pk")}
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
          value={absentMulti(item, "main", "m")}
          onChange={onChange}
          readonly={edit}
          error={errors.m}
        />
        <SelectInputGroup
          id="defect-siule"
          divClassname="form-group col-2"
          name="main.siule"
          label="Siūlė"
          value={absentMulti(item, "main", "siule")}
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
          value={absentMulti(item, "journal", "data")}
          onChange={onChange}
          error={errors.data}
        />
        <SelectInputGroup
          id="defect-oper"
          name="journal.oper"
          label="Operatorius"
          divClassname="form-group col-4"
          value={absentMulti(item, "journal", "oper")}
          options={options.oper}
          onChange={onChange}
          error={errors.oper}
        />
        <SelectInputGroup
          id="defect-apar"
          name="journal.apar"
          label="Defektoskopas"
          divClassname="form-group col-4"
          value={absentMulti(item, "journal", "apar")}
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
          value={absentMulti(item, "journal", "kodas")}
          onChange={onChange}
          error={errors.kodas}
        />
        <TextFieldGroup
          label="L"
          divClassname="form-group col-3"
          id="defect-dl"
          name="journal.dl"
          placeholder="L"
          value={absentMulti(item, "journal", "dl")}
          onChange={onChange}
          error={errors.dl}
        />
        <TextFieldGroup
          label="H"
          divClassname="form-group col-3"
          id="defect-dh"
          name="journal.dh"
          placeholder="H"
          value={absentMulti(item, "journal", "dh")}
          onChange={onChange}
          error={errors.dh}
        />
        <SelectInputGroup
          id="defect-pavoj"
          name="journal.pavoj"
          label="Pavojingumas"
          divClassname="form-group col-3"
          value={absentMulti(item, "journal", "pavoj")}
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
          value={absentMulti(item, "journal", "dtermin")}
          onChange={onChange}
          error={errors.termin}
        />
        <TextFieldGroup
          label="Pastaba"
          divClassname="form-group col-9"
          id="defect-note"
          name="journal.note"
          placeholder="Pastaba"
          value={absentMulti(item, "journal", "note")}
          onChange={onChange}
          error={errors.note}
        />
      </div>
    </form>
  );
};

export default EditForm;
