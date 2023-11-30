import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

// import components
import { CustomInput, CustomTimePicker, CustomDatePicker, CustomSelectWithSearch } from '../../commonComponents'
import { Button, Form, Space } from 'antd'

// import action
import { addReceiveAssign } from '../../../services/actions/VehicleManagementActions/receiveAssignAction'
import { getEmployeeList } from '../../../services/actions/CrewManagementActions/employeeAction'

// import icon
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

// receive assignment api config
import { DATE_FORMAT, TIME_FORMAT } from '../../../config'

// Addeditform function
function ReceiveAssignmentForm() {
    const [searchvalue, setSerchValue] = useState([])
    const { routePermissions } = useSelector(state => state.auth)
    const { success, isLoadingAddUser } = useSelector(state => state.receiveassign)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [form] = Form.useForm()
 
    // destructure parent path name 
    const { parent } = routePermissions


    const { employeeList } = useSelector(state => state.employee)

    // save or submit handler
    const _onFinish = values => {
        const { startTime, endTime, dates, reciveTime, employeesIds } = values
        const dateList = dates && dates?.map(item => (
            item.dates && item.dates?.format(DATE_FORMAT)
        ))

        const transformedValues = {
            ...values,
            reciveTime: reciveTime && reciveTime?.format(TIME_FORMAT),
            startTime: startTime && startTime?.format(TIME_FORMAT),
            endTime: endTime && endTime?.format(TIME_FORMAT),
            dates: dateList,
            employeesIds: employeesIds
        }
        // dispatch to add action
        dispatch(addReceiveAssign(transformedValues))
        return navigate(parent);

    };

    // input field structure
    const addEditInfoFields = [
        {
            id: 1,
            name: 'routeName',
            label: 'Route Name',
            type: 'text',
            rules: [
                {
                    type: 'text',
                    message: 'Route Name is not valid',
                },
                {
                    required: true,
                    message: 'Select Route Name.',
                },
            ],
        },
        {
            id: 2,
            name: 'startTime',
            label: 'Start Time',
            type: 'time',
            rules: [
                {
                    type: 'time',
                    message: 'Start Time is not valid',
                },
                {
                    required: true,
                    message: 'Select Start Time.',
                },
            ],
        },
        {
            id: 3,
            name: 'endTime',
            label: 'End Time',
            type: 'time',
            rules: [
                {
                    type: 'time',
                    message: 'End Time is not valid',
                },
                {
                    required: true,
                    message: 'Select End Time.',
                },
            ],
        },
        {
            id: 4,
            name: 'reciveTime',
            label: 'Receive Time',
            type: 'time',
            rules: [
                {
                    type: 'time',
                    message: 'Receive Time is not valid',
                },
                {
                    required: true,
                    message: 'Select Receive Time.',
                },
            ],
        },
        {
            id: 5,
            name: 'employeesIds',
            label: 'Employee',
            type: 'employeesIds',
            rules: [
                {
                    type: 'select',
                    message: 'Employee is not valid',
                },
                {
                    required: true,
                    message: 'Select Employee(s)',
                },
            ]
        },

    ]

    // Handle input field
    const inputField = ({ type, label }) => {
        const _components = {
            text: <CustomInput
                type={'text'}
                placeholder={`Enter ${label}`}
            />,
            time: <CustomTimePicker 
                format={TIME_FORMAT}
                style={{
                    width: '100%',
                }}
            />,
            employeesIds: (
                <CustomSelectWithSearch
                    itemList={employeeList} 
                    label={'name'} 
                    dataIndex={'id'} 
                    mode={'multiple'}
                    tagRender={null}
                    placeholder={`Select ${label}`}
                    style={{
                        width: '100%',
                    }}                 
                />
            )
        }
        return _components[type] || null;
    }

    useEffect(() => {
        // dispatch action for select box.
        let pageWithSize = { page: 0, pageSize: 500 }
        dispatch(getEmployeeList(pageWithSize))
    }, [])


    // for construct employeeList
    useEffect(() => {
        let data = employeeList.map((item) => ({
            label: item?.name + ` (BatchId: ${item?.id})`,
            value: item?.id
        }))
        setSerchValue(data)
    }, [employeeList])

    const dates = [
        {
            key: 0,
            dates: null
        }
    ]

    return (
        <div className={'bg-white py-3 rounded-md'}>
            <Form
                validateTrigger={'onChange'}
                form={form}
                onFinish={_onFinish}
                scrollToFirstError
                layout={'vertical'}
                autoComplete={'off'}
                initialValues={{ dates: dates }}
            >
                <div className={'grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:p-5'}>
                    {
                        addEditInfoFields?.map(field => {
                            return (
                                <Form.Item
                                    key={field.id}
                                    name={field.name}
                                    label={field.label}
                                    rules={field.rules}
                                    dependencies={field.dependencies ?? []}
                                >
                                    {inputField(field)}
                                </Form.Item>
                            )
                        })
                    }
                </div>
                <div className={'sm:p-5'}>

                    <Form.List name="dates">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space
                                        key={key}
                                        style={{
                                            marginBottom: 8,
                                        }}
                                        align="baseline"
                                    >
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'dates']}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Required Dates',
                                                },
                                            ]}
                                        >
                                            <CustomDatePicker showTime={false} placeholder='Select Dates' />
                                        </Form.Item>
                                        {
                                            fields.length > 1 ? 
                                            <MinusCircleOutlined 
                                                className={'pr-5'}
                                                onClick={() => remove(name)} 
                                            /> 
                                            : null
                                        }
                                    </Space>
                                ))}
                                <div>
                                    <Form.Item>
                                        <Button 
                                            type="dashed" 
                                            onClick={() => add()} block
                                            icon={<PlusOutlined />}
                                            style={{
                                                width: '15%',
                                            }}
                                        >Add Date</Button>

                                    </Form.Item>
                                </div>
                            </>
                        )}
                    </Form.List>
                </div>

                <Form.Item style={{ marginLeft: '17px' }}>
                    <Button
                        htmlType={'submit'}
                        type={'primary'}
                        loading={isLoadingAddUser}
                        style={{ margin: '5px' }}
                    >
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}


export default ReceiveAssignmentForm
