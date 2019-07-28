import React from "react";

const ItemRow = ({ inputItem, setItemEdit, deleteItem, isCurrent }) => {
  return (
    <tr className={isCurrent ? "current" : undefined}>
      <td className="data">{inputItem.data}</td>
      <td className="meistrija">{inputItem.meistrija}</td>
      <td className="km">{inputItem.km}</td>
      <td className="kodas">{inputItem.kodas}</td>
      <td className="apar">{inputItem.apar}</td>
      <td>
        <div className="button-group">
          <button
            className="btn btn-xs btn-warning"
            data-id={inputItem.id}
            onClick={setItemEdit}
          >
            <i className="fas fa-edit" data-id={inputItem.id} />
          </button>
          <button
            className="btn btn-xs btn-danger"
            data-id={inputItem.id}
            onClick={deleteItem}
          >
            <i 
              className="fas fa-trash-alt" 
              data-id={inputItem.id}
            />
          </button>
        </div>
      </td>
    </tr>
  );
}

const HeadRow = () => {
  return (
    <tr>
      <th className="data">data</th>
      <th className="meistrija">meistrija</th>
      <th className="km">km</th>
      <th className="kodas">kodas</th>
      <th className="apar">apar</th>
      <th className="controls">controls</th>
    </tr>
  );
};

export { InputRow, InputHeadRow };
