import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import comapreWithLodash from "lodash"

// import antd componets
import { CustomInput, CustomInputNumber, CustomSelectWithSearch } from '../../commonComponents'
import { Badge, Button, Form, Select } from 'antd'

// import action
import { getAircraftTypeSearchList } from '../../../services/actions/FlightManagementActions/aircraftTypeAction'
import { getErrorMsg, showAlert } from '../../../services/actions/commonActions'

// import api config
import { FLYINGTIME, EMPLOYEE } from '../../../config'
import { addFlyingTime, editFlyingTime } from '../../../services/actions/CrewManagementActions/flyingTimeAction'

function FlyingTimeForm() {
    const [rowdata,setRowdata] = useState({})
    const [sortedEmployeeList, setSortedEmployeeList] = useState([]);

    const { success, isLoading } = useSelector(state => state.flyingTime)
    const { aircraftTypeList } = useSelector(state => state.aircrafttype)
    const { routePermissions } = useSelector(state => state.auth)

    // destructure parent path name 
    const { parent } = routePermissions

    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [form] = Form.useForm()

    // get form values
	const crewTypes = Form.useWatch('crewType', form)

    // save or submit handler
    const _onFinish = values => {
        // dispatch to add and edit action
        if(id) {
            values.id = Number(id)
            if(comapreWithLodash.isEqual(values, rowdata)) {
                // show success message
                showAlert('success', 'Successfully Updated.')
                return navigate(parent)
            } 

            dispatch(editFlyingTime(values))
        } else {
            dispatch(addFlyingTime(values))
        } 
    }

    //reset form data
    const _onReset = () => {
        form.resetFields()
    }

    const inputField = ({ type, label }) => {
        const _components = {
            text: <CustomInput type={'text'} placeholder={`Enter ${label}`} />,
            number: <CustomInputNumber type={'text'} placeholder={`Enter ${label}`} />,
            aircraftTypeId: (
                <CustomSelectWithSearch 
                    itemList={aircraftTypeList} 
                    label={'name'} 
                    dataIndex={'id'} 
                    mode={'single'}
                    tagRender={null}
                    allowClear={false}
                    placeholder={`Select ${label}`}
                />
            ),
            employeeId: (
                <CustomSelectWithSearch 
                    itemList={sortedEmployeeList} 
                    label={'name'} 
                    dataIndex={'id'} 
                    mode={'single'}
                    tagRender={null}
                    placeholder={`Select ${label}`}
                />
            ),
            crewType: (
                <Select placeholder={`Select ${label}`}>
                    <Select.Option value={'CABIN_CREW'}>{'Cabin Crew'}</Select.Option>
                    <Select.Option value={'COCKPIT_CREW'}>{'Cockpit Crew'}</Select.Option>
				</Select>
			),
            cabinCrewType: (
                <Select placeholder={`Select ${label}`}>
                    <Select.Option value={'PURSER'}>{'PURSER'}</Select.Option>
                    <Select.Option value={'JUNIOR_PURSER'}>{'JUNIOR PURSER'}</Select.Option>
                    <Select.Option value={'GENERAL_CREW'}>{'GENERAL CREW'}</Select.Option>
                </Select>
            ),
			cockpitCrewFlightRoleType: (
                <Select placeholder={`Select ${label}`}>
                    <Select.Option value={'CAPTAIN'}>{'CAPTAIN'}</Select.Option>
                    <Select.Option value={'FIRST_OFFICER'}>{'FIRST OFFICER'}</Select.Option>
                    <Select.Option value={'INSTRUCTOR'}>{'INSTRUCTOR'}</Select.Option>
                    <Select.Option value={'ROUTE_TRAINING'}>{'ROUTE TRAINING'}</Select.Option>
                    <Select.Option value={'ROUTE_CHECK'}>{'ROUTE CHECK'}</Select.Option>
                    <Select.Option value={'IRC'}>{'IRC'}</Select.Option>
                    <Select.Option value={'EVE'}>{'EVE'}</Select.Option>
                    <Select.Option value={'SAFETY'}>{'SAFETY'}</Select.Option>
				</Select>
			),
			cockpitCrewFlightCommandType: (
                <Select placeholder={`Select ${label}`}>
                    <Select.Option value={'PIC'}>{'PIC'}</Select.Option>
                    <Select.Option value={'SIC'}>{'SIC'}</Select.Option>
				</Select>
			),
			isPresent: (
                <Select placeholder={`Select ${label}`}>
                    <Select.Option value={true}>{'YES'}</Select.Option>
                    <Select.Option value={false}>{'NO'}</Select.Option>
				</Select>
			),
        }
        
        return _components[type] || null
    }

    // structure input field
    const addEditInfoFields = [
        {
          field_name: 'Employee Info',
          field: [
            {
                id: 3,
                name: 'crewType',
                label: 'Crew Type',
                type: 'crewType',
                category: 'employee_type_info',
                rules: [
                    {
                        type: 'select',
                        message: 'Crew type is not valid',
                    },
                    {
                        required: true,
                        message: 'Crew type is required.',
                    },
                ],
            },
            {
                id: (crewTypes === 'CABIN_CREW') ? 4 : null,
                name: 'cabinCrewType',
                label: 'Cabin Crew Type',
                type: 'cabinCrewType',
                category: 'employee_type_info',
                rules: [
                    {
                        type: 'select',
                        message: 'Cabin crew type is not valid',
                    },
                    {
                        required: true,
                        message: 'Cabin crew type is required.',
                    },
                ],
            },
            {
                id: (crewTypes === 'COCKPIT_CREW') ? 5 : null,
                name: 'cockpitCrewFlightRoleType',
                label: 'Cockpit Crew Type',
                type: 'cockpitCrewFlightRoleType',
                category: 'employee_type_info',
                rules: [
                    {
                        type: 'select',
                        message: 'Cockpit crew type is not valid',
                    },
                    {
                        required: true,
                        message: 'Cockpit crew type is required.',
                    },
                ],
            },
            {
                id: (crewTypes === 'COCKPIT_CREW') ? 6 : null,
                name: 'cockpitCrewFlightCommandType',
                label: 'Cockpit Crew Flight Command Type',
                type: 'cockpitCrewFlightCommandType',
                category: 'employee_type_info',
                rules: [
                    {
                        type: 'select',
                        message: 'Command Type is not valid',
                    },
                    {
                        required: true,
                        message: 'Command Type is required.',
                    },
                ],
            },
            {
                id: 1,
                name: 'aircraftTypeId',
                label: 'Aircraft Type',
                type: 'aircraftTypeId',
                rules: [
                    {
                        type: 'select',
                        message: 'Aircraft type is not valid',
                    },
                    {
                        required: true,
                        message: 'Aircraft type is required.',
                    },
                ],
            },
            {
                id: 2,
                name: 'employeeId',
                label: 'Employee',
                type: 'employeeId',
                rules: [
                    {
                        type: 'select',
                        message: 'Employee is not valid',
                    },
                    {
                        required: true,
                        message: 'Employee is required.',
                    },
                ],
            },
            {
                id: 7,
                name: 'isPresent',
                label: 'Present Airlines',
                type: 'isPresent',
                category: 'employee_type_info',
                rules: [
                    {
                        type: 'select',
                        message: 'Present Airlines is not valid',
                    },
                    {
                        required: true,
                        message: 'Present Airlines is required.',
                    },
                ],
            },
          ],
        },
        {
          field_name: 'Flying Time',
          field: [
            {
                id: 1,
                name: 'hour',
                label: 'Hour',
                type: 'number',
                category: 'flying_time',
                rules: [
                    {
                        type: 'number',
                        message: 'Hour is not valid',
                    },
                    {
                        required: true,
                        message: 'Hour is required.',
                    },
                ],
            },
            {
                id: 1,
                name: 'min',
                label: 'Minute',
                type: 'number',
                category: 'flying_time',
                rules: [
                    {
                        type: 'number',
                        message: 'Minute is not valid',
                    },
                    {
                        required: true,
                        message: 'Minute is required.',
                    },
                ],
            },
          ],
        },
    ];

    useEffect(() => {
        if(id) {
            // For edit form , If api response has successfully done then re-direct to parent path 
            success && navigate(parent)
        }
    }, [ success ])

    useEffect(()=> {
        !aircraftTypeList?.length && dispatch(getAircraftTypeSearchList({ page: 0, pageSize: 200 }));

        const _fetchData = async () => {
            try {
                const { data } = await axios.get(FLYINGTIME.GET_FLYINGTIME + id)
                onValueChangeHander({ crewType: data.crewType }, '')
                setRowdata(data)
                form.setFieldsValue(data)
            } catch (error) {
                console.error(error);
                const errMsg = getErrorMsg(error)

                // show error msg
                showAlert('error', errMsg)
            }
        }

        if(id) {
            _fetchData()
        }
    }, [id])

    const onValueChangeHander = (changedValues) => {
        const _fetchData = async () => {
            try {
                const { data } = await axios.post(EMPLOYEE.GET_EMPLOYEE_LIST + 'search', { crewType: changedValues?.crewType }, { params: { page: 0, size: 1000 } })
                const dataList = data?.model?.length ? data.model : []

                setSortedEmployeeList(dataList ?? [])
            } catch (error) {
                console.error(error);
                const errMsg = getErrorMsg(error)

                // show error msg
                showAlert('error', errMsg)
            }
        }

        if(changedValues?.crewType) {
            form.setFieldsValue({ employeeId: undefined })
            _fetchData()
        }
    } 

    return (
        <div className={'bg-white py-3 rounded-md'}>
            <Form
                validateTrigger={'onChange'}
                form={form}
                onFinish={_onFinish}
                scrollToFirstError
                layout={'vertical'}
                autoComplete={'off'}
                onValuesChange={onValueChangeHander}
            >
            <div className={'gap-5 sm:p-5'}>
                { addEditInfoFields?.length > 0 &&
                addEditInfoFields.map((field, index) => (
                    <Badge.Ribbon text={field?.field_name} placement={'start'}>
                        <div
                            key={index}
                            className={
                                'grid sm:grid-cols-2 lg:grid-cols-3 p-4 pt-10 border-solid border-2 border-gray-200 rounded-lg shadow-inner gap-5 mb-6'
                            }
                        >
                            { field.field.map((item) => (
                                (item?.id !== null) && (
                                    <Form.Item
                                        key={item?.id}
                                        name={item?.name ?? 'N/A'}
                                        label={item?.label}
                                        rules={item?.rules}
                                        dependencies={item?.dependencies ?? []}
                                    >
                                        { inputField(item) }
                                    </Form.Item>
                                )
                            )) }
                        </div>
                    </Badge.Ribbon>
                ))}
            </div>
            <Form.Item style={{marginLeft: '17px'}}>
                <Button 
                    htmlType={'submit'} 
                    type={'primary'} 
                    loading={ isLoading } 
                    style={{ margin: '5px' }}
                >
                    { id ? 'Update' : 'Submit' }
                </Button>
                { !id && 
                    <Button htmlType={'reset'} onClick={() => _onReset}>
                        { 'Reset' }
                    </Button>
                }
            </Form.Item>
            </Form>
        </div>
    )
}

export default FlyingTimeForm
