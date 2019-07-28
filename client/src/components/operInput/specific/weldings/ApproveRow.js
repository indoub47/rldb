import React from "react";
import ActionSelector from "../ActionSelector";
import {
  getDTString, 
  getValidationString, 
  getOperApar,
  getVietosKodas,
} from "../functions";

const PrimaryRow = ({ item, ind, changeAction, setEdit }) => {
  const main = item.main;
  const journal = item.journal;
  return (
    <tr className="approve-primary-row">
      <td className="vbudas">{main.vbudas}</td>
      <td className="vk vieta">{getVietosKodas(main)}</td> 
      <td className="data def">{journal.data}</td>
      <td className="pvd def">{journal.pvd}</td>     
      <td className="oper-apar">{getOperApar(journal)}</td>
      <td className="controls">
        <button
          className="btn btn-xs btn-light"
          data-ind={ind}
          onClick={setEdit}
        >
          <i className="fas fa-edit" data-ind={ind} />
        </button>
        <ActionSelector 
          action={item.action}
          ind={ind}
          changeAction={changeAction}
        />
      </td>
    </tr>
  );
};

const SecondaryRow = ({ item }) => {
  const main = item.main;
  const journal = item.journal;
  return (
    <tr className="approve-secondary-row">
      <td className="supplied-by">{item.oper}</td>
      <td className="supplied-when">{getDTString(item.timestamp)}</td>
      <td className="id">{main.id}</td>
      <td className="virino">{main.virino}</td>
      <td className="data0">{main.data0}</td>
      <td className="note">
        {journal.note}
      </td>
    </tr>
  );
};

const ValidationRow = ({ item }) => {
  if (!item.validation) return null;
  return (
    <tr className="approve-validation-row">
      <td className="pastaba" colSpan="6">
        {getValidationString(item.validation)}
      </td>
    </tr>
  );
};

const SingleRow = ({
  item,
  ind,
  changeAction,
  setEdit
}) => {
  return (
    <React.Fragment>
      <PrimaryRow
        item={item}
        ind={ind}
        changeAction={changeAction}
        setEdit={setEdit}
      />
      <SecondaryRow item={item} />
      <ValidationRow item={item} />
    </React.Fragment>
  );
};

const HeadRow = () => {
  return (
    <thead>
      <tr className="approve-primary-row">
        <th className="vbudas">Virinimo būdas</th>
        <th className="vk vieta">Vietos kodas</th>
        <th className="data">Data</th>
        <th className="pvd">Pavadinimas</th>
        <th className="oper-apar">Oper-Apar</th>
        <th className="controls">Actions</th>
      </tr>
      <tr className="approve-secondary-row">
        <th className="supplied-by">Pateikė</th>
        <th className="supplied-when">Kada</th>
        <th className="id">ID</th>
        <th className="virino">Kas virino</th>
        <th className="data0">Virinimo data</th>
        <th className="note">Pastaba</th>
      </tr>
    </thead>
  );
};

export { SingleRow, HeadRow };
