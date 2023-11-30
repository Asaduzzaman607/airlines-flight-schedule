import CalenderBadge from "./CalenderBadge";
import styled from "styled-components";
import {useCallback, useMemo} from "react";
import dayjs from "dayjs";

const EmptyTd = styled.td`
  cursor: pointer;
`

export default function FlightCalenderSingleDateFlights({handleAddNew, handleEdit, flights, date, employee, type}) {

    const extractTime = useCallback((dateTime) => {
        return dayjs(dateTime, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')
    }, [])

    return (
        <EmptyTd onClick={handleAddNew(date, employee)}>
            {
                flights?.map((flight, index) => (
                    <CalenderBadge
                        onClick={handleEdit(date, flight, employee)}
                        key={flight.id + "-" + index}
                        type={type}
                    >
                        <div>
                            {flight.flightNo}
                        </div>

                        <div className="text-xs">
                            {extractTime(flight.actualDepartureDateTime)} - {extractTime(flight.actualArrivalDateTime)}
                        </div>
                    </CalenderBadge>
                ))
            }
        </EmptyTd>
    )
}