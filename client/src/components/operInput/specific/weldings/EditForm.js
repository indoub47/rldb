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
      <div className="form-group row general-data text-center">
        <SelectInputGroup
          id="welding-vbudas"
          divClassname="form-group col-4"
          name="main.vbudas"
          label="Virinimo būdas"
          value={absentMulti(item, "main", "vbudas")}
          options={options.vbudas}
          onChange={onChange}
          disabled={edit}
          error={errors.vbudas}
        />
        <SelectInputGroup
          id="welding-virino"
          divClassname="form-group col-4"
          name="main.virino"
          label="Kas virino"
          value={absentMulti(item, "main", "virino")}
          options={options.virino}
          onChange={onChange}
          disabled={edit}
          error={errors.virino}
        />
        <TextFieldGroup
          divClassname="form-group col-4"
          type="date"
          label="Virinimo data"
          id="welding-data0"
          name="main.data0"
          value={absentMulti(item, "main", "data0")}
          onChange={onChange}
          readonly={edit}
          error={errors.data0}
        />
      </div>

      <div className="form-group row vieta text-center">
        <TextFieldGroup
          label="Linija"
          divClassname="form-group col-4"
          id="welding-linija"
          name="main.linija"
          placeholder="Linija"
          value={absentMulti(item, "main", "linija")}
          onChange={onChange}
          readonly={edit}
          error={errors.linija}
        />
        <TextFieldGroup
          label="Kelias"
          divClassname="form-group col-4"
          id="welding-kelias"
          name="main.kelias"
          placeholder="Kelio Nr."
          value={absentMulti(item, "main", "kelias")}
          onChange={onChange}
          readonly={edit}
          error={errors.kelias}
        />
        <TextFieldGroup
          label="km"
          divClassname="form-group col-4"
          id="welding-km"
          name="main.km"
          placeholder="km"
          value={absentMulti(item, "main", "km")}
          onChange={onChange}
          readonly={edit}
          error={errors.km}
        />
        <TextFieldGroup
          label="pk"
          divClassname="form-group col-4"
          id="welding-pk"
          name="main.pk"
          placeholder="pk"
          value={absentMulti(item, "main", "pk")}
          onChange={onChange}
          readonly={edit}
          error={errors.pk}
        />
        <TextFieldGroup
          label="m"
          divClassname="form-group col-4"
          id="welding-m"
          name="main.m"
          placeholder="m"
          value={absentMulti(item, "main", "m")}
          onChange={onChange}
          readonly={edit}
          error={errors.m}
        />
        <SelectInputGroup
          id="welding-siule"
          divClassname="form-group col-4"
          name="main.siule"
          label="Siūlė"
          value={absentMulti(item, "main", "siule")}
          options={options.siule}
          onChange={onChange}
          disabled={edit}
          error={errors.siule}
        />
      </div>
      <div className="form-group row specific-data text-center">
        <TextFieldGroup
          label="Data"
          divClassname="form-group col-4"
          type="date"
          id="welding-data"
          name="journal.data"
          value={absentMulti(item, "journal", "data")}
          onChange={onChange}
          error={errors.data}
        />
        <SelectInputGroup
          id="welding-oper"
          name="journal.oper"
          label="Operatorius"
          divClassname="form-group col-4"
          value={absentMulti(item, "journal", "oper")}
          options={options.oper}
          onChange={onChange}
          error={errors.oper}
        />
        <SelectInputGroup
          id="welding-apar"
          name="journal.apar"
          label="Defektoskopas"
          divClassname="form-group col-4"
          value={absentMulti(item, "journal", "apar")}
          options={options.apar}
          onChange={onChange}
          error={errors.apar}
        />
      </div>
      <div className="form-group row description text-center">
        <SelectInputGroup
          id="welding-pvd"
          name="journal.pvd"
          label="Tikrinimo pavadinimas"
          divClassname="form-group col-3"
          value={absentMulti(item, "journal", "pvd")}
          options={options.vpvd}
          onChange={onChange}
          error={errors.pvd}
        />
        <TextFieldGroup
          label="Pastaba"
          divClassname="form-group col-9"
          id="welding-note"
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
