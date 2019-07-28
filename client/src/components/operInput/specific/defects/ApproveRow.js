import React from "react";
import ActionSelector from "../ActionSelector";
import {
  getDTString, 
  getValidationString, 
  getOperApar, 
  getHL, 
  getVietosKodas, 
  getBegis
} from "../functions";

const PrimaryRow = ({ item, ind, changeAction, setEdit }) => {
  const main = item.main;
  const journal = item.journal;
  return (
    <tr className="approve-primary-row">
      <td className="meistrija vieta">{main.meistrija}</td>
      <td className="vk vieta">{getVietosKodas(main)}</td>      
      <td className="oper-apar">{getOperApar(journal)}</td>
      <td className="data def">{journal.data}</td>
      <td className="kodas def">{journal.kodas}</td>
      <td className="hl">{getHL(journal)}</td>
      <td className="kkateg def">{main.kkateg}</td>
      <td className="pavoj def">{journal.pavoj}</td>
      <td className="dtermin def">{journal.dtermin}</td>
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
      <td className="begis">{getBegis(main)}</td>
      <td className="note" colSpan="6">
        {journal.note}
      </td>
    </tr>
  );
};

const ValidationRow = ({ item }) => {
  if (!item.validation) return null;
  return (
    <tr className="approve-validation-row">
      <td className="pastaba" colSpan="10">
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
        <th className="meistrija vieta">Meistrija</th>
        <th className="vk vieta">Vietos kodas</th>
        <th className="oper-apar">Oper-Apar</th>
        <th className="data def">Data</th>
        <th className="kodas def">Kodas</th>
        <th className="hl">H/L</th>
        <th className="kkateg def">KKateg</th>
        <th className="pavoj def">Pavoj</th>
        <th className="dtermin def">Terminas</th>
        <th className="controls">Actions</th>
      </tr>
      <tr className="approve-secondary-row">
        <th className="supplied-by">Pateikė</th>
        <th className="supplied-when">Kada</th>
        <th className="id">ID</th>
        <th className="begis">Bėgis</th>
        <th className="note" colSpan="7">
          Pastaba
        </th>
      </tr>
    </thead>
  );
};

export { SingleRow, HeadRow };
