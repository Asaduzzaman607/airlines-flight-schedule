import CalenderBadge from "../CalenderBadge";
import FlightCalenderEmployeesForSingleDate from "./FlightCalenderEmployeesForSingleDate";

export default function FlightCalenderTableBody({flights, dates, employees, handleAddNew, handleEdit}) {
    return (
        <tbody>
        {
            flights.length > 0 && flights.map(flight => <tr key={flight.id}>
                <td>{flight.flightNo}</td>
                {
                    dates.map(date => <FlightCalenderEmployeesForSingleDate flight={flight} employees={employees} date={date} />)
                }
            </tr>)
        }
        </tbody>
    );
}