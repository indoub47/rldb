import React from "react";
import TextFieldGroup from "../../../common/TextFieldGroup";
import SelectInputGroup from "../../../common/SelectInputGroup";
import absent from "../../../../utils/absent-props";

const SearchForm = ({onChange, searchInput, options, errors }) => {
  
  return (
    <form>
      <div className="form-group row">      
        <SelectInputGroup
          id="welding-search-vbudas"
          name="vbudas"
          label="Virinimo būdas"
          classname="form-group col-12"
          value={absent(searchInput.vbudas)}
          options={options.vbudas}
          onChange={onChange}
          error={errors.vbudas}
        />
      </div> 
      <div className="form-group row">
        <TextFieldGroup
          label="Linija"
          id="welding-search-linija"
          name="linija"
          placeholder="Linija"
          classname="form-group col-12"
          value={absent(searchInput.linija)}
          onChange={onChange}
          error={errors.linija}
        />
      </div>
      <div className="form-group row">      
        <TextFieldGroup
          label="Kelias"
          id="welding-search-kelias"
          name="kelias"
          placeholder="kelias"
          classname="form-group col-12"
          value={absent(searchInput.kelias)}
          onChange={onChange}
          error={errors.kelias}
        />
      </div>
      <div className="form-group row">      
        <TextFieldGroup
          label="km"
          id="welding-search-km"
          name="km"
          placeholder="km"
          classname="form-group col-12"
          value={absent(searchInput.km)}
          onChange={onChange}
          error={errors.km}
        />
      </div>
      <div className="form-group row">      
        <TextFieldGroup
          label="pk"
          id="welding-search-pk"
          name="pk"
          placeholder="pk"
          classname="form-group col-12"
          value={absent(searchInput.pk)}
          onChange={onChange}
          error={errors.pk}
        />
      </div>
      <div className="form-group row">      
        <TextFieldGroup
          label="m"
          id="welding-search-m"
          name="m"
          placeholder="m"
          classname="form-group col-12"
          value={absent(searchInput.m)}
          onChange={onChange}
          error={errors.m}
        />
      </div>
      <div className="form-group row">      
        <SelectInputGroup
          id="welding-search-siule"
          name="siule"
          label="Siūlė"
          classname="form-group col-12"
          value={absent(searchInput.siule)}
          options={options.siule}
          onChange={onChange}
          error={errors.siule}
        />
      </div> 
    </form>
  );
};

export default SearchForm;
