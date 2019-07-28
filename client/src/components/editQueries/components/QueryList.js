import React from 'react';
import QueryRow from './QueryRow';

const QueryList = ({queries, remove, setItemForEditing}) => {
  // console.log("queries", queries);
 
  const queryRows = queries.map(q => 
      <QueryRow 
        key={q.id} 
        query={q} 
        remove={remove}
        setForEditing={setItemForEditing}
      />
  );

  return (
    <div className="row">
      <div className="col-12">
        <table className="table table-sm table-striped table-bordered query-list-table" style={{fontSize: ".95rem"}}>
          <thead>
            <tr>
              <th className="id">id</th>
              <th className="filter">filter</th>
              <th className="sort">sort</th>
              <th className="name">name</th>
              <th className="controls">controls</th>
            </tr>
          </thead>
          <tbody>
            {queryRows}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default QueryList;