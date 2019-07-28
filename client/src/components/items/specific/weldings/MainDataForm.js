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
          divClassname="form-group col-3"
          label="Senasis ID"
          id="item-oldid"
          name="oldid"
          placeholder="Senasis ID"
          readonly={true}
          value={absent(item.oldid)}
        />
        <TextFieldGroup
          divClassname="form-group col-2"
          label="Regionas"
          id="item-regbit"
          name="regbit"
          placeholder="Regionas"
          readonly={true}
          value={absent(item.regbit)}
        />
      </div>

      <div className="form-group row virino text-center">
        <TextFieldGroup
          id="item-data0"
          divClassname="form-group col-4"
          type="date"
          name="data0"
          label="Virinimo data"
          value={absent(item.data0)}
          onChange={onChange}
        />
        <SelectInputGroup
          id="item-virino"
          divClassname="form-group col-4"
          name="virino"
          label="Kas virino"
          value={absent(item.virino)}
          options={options.virino}
          onChange={onChange}
        />
        <SelectInputGroup
          id="item-vbudas"
          divClassname="form-group col-4"
          name="vbudas"
          label="Virinimo būdas"
          value={absent(item.vbudas)}
          options={options.vbudas}
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

        <TextFieldGroup
          label="Suvir. Nr."
          divClassname="form-group col-2"
          id="item-suvnr"
          name="suvnr"
          placeholder="suv nr"
          value={absent(item.suvnr)}
          onChange={onChange}
        />
        <TextFieldGroup
          label="Nr. pagal schemą"
          divClassname="form-group col-2"
          id="item-nrschema"
          name="nrschema"
          placeholder="nrschema"
          value={absent(item.nrschema)}
          onChange={onChange}
        />
      </div>

      <div className="form-group row datos text-center">
        <SelectInputGroup
          id="item-dstop"
          divClassname="form-group col-3"
          name="dstop"
          label="Būsena"
          value={absent(item.dstop)}
          options={options.itemStatus}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export { MainDataForm };
