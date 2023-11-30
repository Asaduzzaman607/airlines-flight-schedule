import {getFlights} from "./calenderHelpers";
import FlightCalenderSingleDateFlights from "./FlightCalenderSingleDateFlights";

export default function FlightCalenderTableRow({dates, employee, flights, handleAddNew, handleEdit, type}) {
    return <tr>
        <td className="pl-1">
            {employee.name} &nbsp;
            {
                employee.batchNo && `(B-${employee.batchNo})`
            }

            &nbsp;

            ({ employee.areaCode})
        </td>
        {
            dates.map((date, index) => <FlightCalenderSingleDateFlights
                type={type}
                handleAddNew={handleAddNew}
                date={date}
                employee={employee}
                handleEdit={handleEdit}
                key={index}
                flights={getFlights(date, employee.id, flights)}
            />)
        }
    </tr>
}