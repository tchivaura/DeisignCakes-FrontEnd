import React, { useState } from 'react';

function SearchableList({ data, renderRow, headers, searchFields = [] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(item =>
    searchFields.some(field =>
      String(item[field] || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  );

  return (
    <>
      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            {headers.map((head, i) => (
              <th key={i}>{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => renderRow(item, index))
          ) : (
            <tr>
              <td colSpan={headers.length} className="text-center text-muted">
                No results found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}

export default SearchableList;
