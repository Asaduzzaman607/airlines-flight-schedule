import {Col, DatePicker, Form, Row} from "antd";
import {DATE_FORMAT} from "../constants";
import useFlightCalender from "../useFlightCalender";
import CalenderTable from "../CalenderTable";
import FlightCalenderTableHeader from "../FlightCalenderTableHeader";
import FlightCalenderTableBody from "./FlightCalenderTableBody";
import FlightCalenderSearchForm from "../FlightCalenderSearchForm";

export default function FlightCalender() {

    const {
        searchForm,
        submitting,
        searchDate,
        dates,
        flights,
        employees
    } = useFlightCalender();


    return <section className={'p-4 space-y-4 mt-1'}>

        <div className={ 'bg-white px-4 py-3 rounded-md' }>
            <FlightCalenderSearchForm
                disableCrewType={true}
                dateFormat={DATE_FORMAT}
                searchForm={searchForm}
                submitting={submitting}
            />
        </div>
        {
            flights && dates && employees && searchDate && (
                <div className={'px-4 py-3 rounded-md bg-white'}>
                    <Row>
                        <Col
                            span={24}
                            style={{
                                overflowX: 'auto',
                                maxHeight: 'calc(100vh - 220px)',
                            }}
                        >
                            <CalenderTable>
                                <FlightCalenderTableHeader
                                    dates={dates}
                                    date={searchDate}
                                />
                                <FlightCalenderTableBody
                                    flights={flights}
                                    dates={dates}
                                    employees={employees}
                                />

                            </CalenderTable>
                        </Col>
                    </Row>
                </div>
            )
        }

    </section>
}