import {CREW_TYPES_MAP} from "./constants";
import FlightCalenderTableRow from "./FlightCalenderTableRow";
import {Fragment} from "react";

export default function EmployeeCalenderTableBody({employees, types, dates, flights, handleAddNew, handleEdit}) {
    if (employees.length === 0) return null;

    return <tbody>
    {types.map(type => <Fragment key={type}>
        <tr>
            <td className="text-black font-bold text-xl" colSpan={dates.length + 1}>
                <span className="pl-1">{CREW_TYPES_MAP[type]}</span>
            </td>
        </tr>

        {employees
            .filter(employee => employee.type === type)
            .map(employee => <FlightCalenderTableRow
                type={type}
                key={employee.id}
                dates={dates}
                employee={employee}
                flights={flights}
                handleAddNew={handleAddNew}
                handleEdit={handleEdit}
            />)}
    </Fragment>)}
    </tbody>;
}