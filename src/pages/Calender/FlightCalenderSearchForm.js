import {Col, DatePicker, Form, Row, Select} from "antd";
const { RangePicker } = DatePicker;


export default function FlightCalenderSearchForm({submitting, searchForm, dateFormat, disableCrewType}) {
    return (
        <div>
            <Form
                disabled={submitting}
                labelCol={{span: 8}}
                wrapperCol={{span: 14}}
                layout="horizontal"
                initialValues={{crewType: "CABIN_CREW", date: "", dateRange: []}}
                colon={false}
                form={searchForm}
            >
                <div className={ 'grid grid-cols-2' }>
                        {
                            !disableCrewType && (
                                <div>
                                    <Form.Item
                                        label="Crew Type"
                                        name="crewType"
                                        rules={[{required: true, message: "Crew type is required!"}]}
                                    >
                                        <Select>
                                            <Select.Option value="CABIN_CREW">Cabin Crew</Select.Option>
                                            <Select.Option value="COCKPIT_CREW">Cockpit Crew</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </div>
                            )
                        }
                    <div>
                        <Form.Item label="Date Range" name="dateRange" rules={[{required: true, message: "Date Range is required!"}]}>
                            <RangePicker format={dateFormat} style={{width: "100%"}}/>
                        </Form.Item>
                    </div>
                </div>
            </Form>
        </div>
        // <Row>
        //     <Col span={20}>
        //         <Form
        //             disabled={submitting}
        //             labelCol={{span: 8}}
        //             wrapperCol={{span: 14}}
        //             layout="horizontal"
        //             initialValues={{crewType: "CABIN_CREW", date: "", dateRange: []}}
        //             colon={false}
        //             form={searchForm}
        //         >
        //             <Row>
        //                 {
        //                     !disableCrewType && (
        //                         <Col span={12}>
        //                             <Form.Item label="Crew Type" name="crewType"
        //                                        rules={[{required: true, message: "Crew type is required!"}]}>
        //                                 <Select>
        //                                     <Select.Option value="CABIN_CREW">Cabin Crew</Select.Option>
        //                                     <Select.Option value="COCKPIT_CREW">Cockpit Crew</Select.Option>
        //                                 </Select>
        //                             </Form.Item>
        //                         </Col>
        //                     )
        //                 }
        //
        //                 <Col span={12}>
        //                     <Form.Item label="Date Range" name="dateRange" rules={[{required: true, message: "Date Range is required!"}]}>
        //                         <RangePicker format={dateFormat} style={{width: "100%"}}/>
        //                     </Form.Item>
        //                 </Col>
        //             </Row>
        //         </Form>
        //     </Col>
        // </Row>
    )
}