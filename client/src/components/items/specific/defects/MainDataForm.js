import React from "react";
import TextFieldGroup from "../../../common/TextFieldGroup";
import SelectInputGroup from "../../../common/SelectInputGroup";
import absent from "../../../../utils/absent-props";

const MainDataForm = ({ item, onChange, options }) => {
  return (
    <div className="container item-info border border-primary text-center">
      <div className="form-group row main-data text-center">
        <TextFieldGroup
          divClassname="form-group col-3"
          label="ID"
          id="item-id"
          name="id"
          placeholder="Defekto ID"
          readonly={true}
          value={absent(item.id)}
        />
        <TextFieldGroup
          divClassname="form-group col-1"
          label="Regionas"
          id="item-regbit"
          name="regbit"
          placeholder="Regionas"
          readonly={true}
          value={absent(item.regbit)}
        />
        <TextFieldGroup
          divClassname="form-group col-3"
          label="ID1"
          id="item-id1"
          name="id1"
          placeholder="Defekto ID1"
          value={absent(item.id1)}
          onChange={onChange}
        />
        <SelectInputGroup
          id="item-meistrija"
          name="meistrija"
          label="Meistrija"
          divClassname="form-group col-3"
          value={absent(item.meistrija)}
          options={options.meistrija}
          onChange={onChange}
        />
        <SelectInputGroup
          id="item-kkateg"
          name="kkateg"
          label="Kelio kategorija"
          divClassname="form-group col-2"
          value={absent(item.kkateg)}
          options={options.kkateg}
          onChange={onChange}
        />
      </div>

      <div className="form-group row begis text-center">
        <SelectInputGroup
          id="item-btipas"
          divClassname="form-group col-4"
          name="btipas"
          label="Bėgio tipas"
          value={absent(item.btipas)}
          options={options.btipas}
          onChange={onChange}
        />
        <SelectInputGroup
          id="item-bgamykl"
          divClassname="form-group col-4"
          name="bgamykl"
          label="Bėgio gamykla"
          value={absent(item.bgamykl)}
          options={options.bgamykl}
          onChange={onChange}
        />
        <TextFieldGroup
          divClassname="form-group col-4"
          label="Bėgio gam. metai"
          id="item-bmetai"
          name="bmetai"
          placeholder="Bėgio gam. metai"
          value={absent(item.bmetai)}
          onChange={onChange}
        />
      </div>

      <div className="form-group row vieta text-center">
        <TextFieldGroup
          label="Linija"
          divClassname="form-group col-2"
          id="item-linija"
          name="linija"
          placeholder="Linija"
          value={absent(item.linija)}
          onChange={onChange}
        />
        <TextFieldGroup
          label="Kelias"
          divClassname="form-group col-2"
          id="item-kelias"
          name="kelias"
          placeholder="Kelio Nr."
          value={absent(item.kelias)}
          onChange={onChange}
        />
        <TextFieldGroup
          label="km"
          divClassname="form-group col-2"
          id="item-km"
          name="km"
          placeholder="km"
          value={absent(item.km)}
          onChange={onChange}
        />
        <TextFieldGroup
          label="pk"
          divClassname="form-group col-2"
          id="item-pk"
          name="pk"
          placeholder="pk"
          value={absent(item.pk)}
          onChange={onChange}
        />
        <TextFieldGroup
          label="m"
          divClassname="form-group col-2"
          id="item-m"
          name="m"
          placeholder="m"
          value={absent(item.m)}
          onChange={onChange}
        />
        <SelectInputGroup
          id="item-siule"
          divClassname="form-group col-2"
          name="siule"
          label="Siūlė"
          value={absent(item.siule)}
          options={options.siule}
          onChange={onChange}
        />
      </div>

      <div className="form-group row datos text-center">
        <TextFieldGroup
          label="Galutinio panaikinimo data"
          divClassname="form-group col-3"
          type="date"
          id="item-daction"
          name="dstop"
          placeholder="Panaikinimo data"
          value={absent(item.dstop)}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export { MainDataForm };
