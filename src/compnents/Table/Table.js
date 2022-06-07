import React from 'react'
import './table.css'
const Table = ({ countries }) => {
  return (
     <div className="table">
      {countries.map((country,cases) => (
        <tr>
          <td>{country.country}</td>
          <td>
            <strong>{country.cases}</strong>
          </td>
        </tr>
      ))}
    </div>
  )
}

export default Table