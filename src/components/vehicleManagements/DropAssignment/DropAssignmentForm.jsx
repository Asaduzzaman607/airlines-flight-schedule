import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import axios from "axios"
import comapreWithLodash from "lodash"

// import components
import { CustomInput,CustomTimePicker, CustomSelectWithSearch, CustomDatePicker } from '../../commonComponents'
import { getErrorMsg, showAlert } from '../../../services/actions/commonActions'
import { Button, Form, Space } from 'antd'

// import icon
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

// import action
import { editDropAssign, addDropAssign } from '../../../services/actions/VehicleManagementActions/dropAssignAction'
import { getEmployeeList } from '../../../services/actions/CrewManagementActions/employeeAction'

// drop assignment api config
import { VCC, DATE_FORMAT, TIME_FORMAT } from '../../../config'


// Addeditform function
function DropAssignmentForm() {
    const [rowdata, setRowdata] = useState({})
    const [searchvalue, setSerchValue] = useState([])
    const { routePermissions } = useSelector(state => state.auth)
    const { success, isLoadingAddUser } = useSelector(state => state.dropassign)
    const { employeeList } = useSelector(state => state.employee)

    // destructure parent path name
    const { parent } = routePermissions

    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [form] = Form.useForm()  

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

        // dispatch to add and edit action
        if (id) {
            transformedValues.id = Number(id)
            if (comapreWithLodash.isEqual(transformedValues, rowdata)) {
                // show success message
                showAlert('success', 'Successfully Updated.')
                return navigate(parent);
            }

            dispatch(editDropAssign(transformedValues))
        } else {
            dispatch(addDropAssign(transformedValues))
            return navigate(parent);
        }

    };

    //reset form data
    const _onReset = () => {
        form.resetFields()
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
            label: 'Drop Time',
            type: 'time',
            rules: [
                {
                    type: 'time',
                    message: 'Drop Time is not valid',
                },
                {
                    required: true,
                    message: 'Select Drop Time.',
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
                    message: 'Select Employee(s).',
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

        const _fetchData = async () => {
            try {
                const { data } = await axios.get(VCC.GET_DROP_ASSIGN_LIST + id);
                
                let newvalues = {
                    ...data,
                    reciveTime: data?.reciveTime && dayjs(data?.reciveTime, TIME_FORMAT),
                    startTime: data?.startTime && dayjs(data?.startTime, TIME_FORMAT),
                    endTime: data?.endTime && dayjs(data?.endTime, TIME_FORMAT),
                    employeesIds: data?.employeesIds,
                    dates: data?.dates && data?.dates?.map(item => ({
                        dates:item && dayjs(item)
                    }))
                }
                setRowdata(data)
                form.setFieldsValue(newvalues)
            } catch (err) {
                console.error(err)
                const errMsg = getErrorMsg(err)

                // show error msg
                showAlert('error', errMsg)
            }
        }

        if (id) {
            _fetchData();
        }
    }, [])

    useEffect(() => {
        if (id) {
            // For edit form , If api response has successfully done then re-direct to parent path
            success && navigate(parent)
        }
    }, [success])

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
                        {id ? 'Update' : 'Submit'}
                    </Button>
                    {!id && <Button htmlType={'reset'} onClick={() => _onReset}>{'Reset'}</Button>}
                </Form.Item>
            </Form>
        </div>
    )
}


export default DropAssignmentForm
