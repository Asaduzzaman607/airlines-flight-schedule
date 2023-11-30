import {getEmployees} from "../calenderHelpers";
import {useMemo} from "react";
import CalenderBadge from "../CalenderBadge";
import dayjs from "dayjs";
import { HistoryOutlined } from "@ant-design/icons";

export default function FlightCalenderEmployeesForSingleDate({flight, employees, date}) {

    const flightDateEmployees = useMemo(() => getEmployees(date, flight.id, employees), [date, flight, employees]);

    return <td>
        {
            flightDateEmployees[0]?.actualDepartureTime && (
                <div className={'flex justify-end mt-1 mr-0.5'}>
                    <div className={'inline-block'}>
                        <div
                            className={'bg-red-100 border border-red-200 flex items-center space-x-1 px-2 text-center rounded-full text-[11px] font-medium text-red-600'}
                        >
                            <HistoryOutlined />
                            <div>{_formatDateToOnlyTime(flightDateEmployees[0]?.actualDepartureTime)}</div>
                        </div>
                    </div>
                </div>
            )
        }
        {
            flightDateEmployees?.map(employee => <CalenderBadge key={ employee?.id }>
                {employee.name}
                {
                    employee?.type && _transformEmployeeIntoShortenString(employee.type)
                }
            </CalenderBadge>)
        }
    </td>;

}

const _formatDateToOnlyTime = date => {
    // date format using dayjs.js
    return dayjs(date).format('HH:mm');
}

// transform employee type
function _transformEmployeeIntoShortenString(str) {
    // Create a map of abbreviations
    const abbreviationMap = {
        PURSER: " (P)",
        JUNIOR_PURSER: " (JP)",
        GENERAL_CREW: " (GC)",
        CAPTAIN: " (C)",
        FIRST_OFFICER: " (FO)",
        INSTRUCTOR: " (I)",
        TRAINEE_FO: " (TF)"
    };

    // Check if the input string is in the map
    if (abbreviationMap[str]) {
        // If it is, return the corresponding abbreviation
        return abbreviationMap[str];
    } else {
        // If it isn't, return the original string
        return str;
    }
}