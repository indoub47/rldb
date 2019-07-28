import React from 'react';
import SelectInputGroup from "../../SelectInputGroup";
import { createOptions } from "../../../createOptions";

const QuerySelect = ({queries, onChange, value}) => {
      return (
          <SelectInputGroup
            options={createOptions(queries, "Filter-Sort Queries")}
            name="fsqueries"
            value={value || ''}
            placeholder='Queries'
            onChange={onChange}
            size="6"
            style={{ fontSize: ".95rem" }}
          /> 
      );
  }

export default QuerySelect;
