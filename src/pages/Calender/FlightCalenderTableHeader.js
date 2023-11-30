import CalenderSingleDate from "./CalenderSingleDate";
import FlightCalenderTableMonth from "./FlightCalenderTableMonth";

export default function FlightCalenderTableHeader({ dates, date }) {
    if (dates.length === 0 || !date) return null;
    return <thead className="">

        <tr>
            <FlightCalenderTableMonth colSpan={dates.length + 1}>
                {date.format('MMMM YYYY')}
            </FlightCalenderTableMonth>
        </tr>

        <tr style={{
            height: '48px'
        }}>
            <th/>
            {
                dates.map(date => <th key={date}>
                    <CalenderSingleDate date={date}/>
                </th>)
            }
        </tr>

    </thead>
}