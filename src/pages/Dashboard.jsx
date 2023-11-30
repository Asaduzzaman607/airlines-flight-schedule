import {Button, Col, DatePicker, Form, Modal, Row, Select} from "antd";
import {DATE_FORMAT} from "./Calender/constants";
import dayjs from "dayjs";
import useEmployeeCalender from "./Calender/useEmployeeCalender";
import FlightCalenderSearchForm from "./Calender/FlightCalenderSearchForm";
import FlightCalenderTableHeader from "./Calender/FlightCalenderTableHeader";
import EmployeeCalenderTableBody from "./Calender/EmployeeCalenderTableBody";
import CalenderTable from "./Calender/CalenderTable";


const modalFormConfig = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 18,
    },
    initialValues: {
        date: dayjs(),
        flightId: '',
        newFlightId: '',
        employeeId: ''
    }
}

const Dashboard = () => {
    const {
        flightList,
        modalForm,
        searchForm,
        flights,
        employees,
        dates,
        isModalOpen,
        setIsModalOpen,
        submitting,
        handleEdit,
        types,
        handleAddNew,
        submitFlightAssign,
        onFinishFailed,
        searchDate,
        userTypes,
        crewTypeOptions
    } = useEmployeeCalender();



    return (
        <section className={'p-4 space-y-4 mt-1'}>
            <Modal title="Flight Assign/Shift" footer={false} open={isModalOpen} onOk={() => {
                setIsModalOpen(false);
            }} onCancel={() => {
                setIsModalOpen(false);
            }}>
                <Row>
                    <Col span={24}>
                        <Form
                            {...modalFormConfig}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            form={modalForm}
                            preserve={true}
                            onFinish={submitFlightAssign}
                        >
                            <Form.Item
                                label="Date"
                                name="date"
                                rules={[{required: true, message: 'Date is required!',},]}
                            >
                                <DatePicker allowClear={false} style={{width: '100%'}}/>
                            </Form.Item>

                            <Form.Item
                                label="Aircraft Type"
                                name="aircraftTypeId"
                                rules={[{required: true, message: "Aircraft Type is required!"}]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Select A Aircraft Type"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={userTypes}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Flight"
                                name="newFlightId"
                                rules={[{required: true, message: "Flight is required!"}]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Select A Flight"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={flightList}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Crew Type"
                                name="crewType"
                                rules={[{required: true, message: "Required!"}]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Crew Type"
                                    options={crewTypeOptions}
                                />
                            </Form.Item>

                            <Form.Item
                                wrapperCol={{
                                    offset: 6
                                }}
                            >
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Modal>
            <div className={ 'bg-white px-4 py-3 rounded-md' }>
                <FlightCalenderSearchForm
                    dateFormat={DATE_FORMAT}
                    searchForm={searchForm}
                    submitting={submitting}
                />
            </div>

            {
                flights && employees && dates && searchDate && (
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

                                    {
                                        searchDate && <FlightCalenderTableHeader
                                            dates={dates}
                                            date={searchDate}
                                        />
                                    }

                                    <EmployeeCalenderTableBody
                                        types={types}
                                        dates={dates}
                                        employees={employees}
                                        flights={flights}
                                        handleAddNew={handleAddNew}
                                        handleEdit={handleEdit}
                                    />

                                </CalenderTable>
                            </Col>
                        </Row>
                    </div>
                )
            }
        </section>
    )
}

export default Dashboard