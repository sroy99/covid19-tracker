import React from "react";
import "../Table.css";

import { addCommas } from "../util";

function Table(props) {
  return (
    <div className={`table ${props.dark && "table-dark"}`}>
      {props.countries.map(({ country, cases }) => (
        <tr>
          <td>{country}</td>
          <td>
            <strong>{addCommas(cases)} </strong> cases
          </td>
        </tr>
      ))}
    </div>
  );
}

export default Table;
