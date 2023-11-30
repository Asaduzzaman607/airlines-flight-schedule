import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs'
import axios from "axios";
import comapreWithLodash from "lodash";

// import components
import { Button, Form, Input, InputNumber, DatePicker, Select, Badge, TimePicker, Checkbox } from 'antd';

// import actions
import { editFlightScheduleList, addFlightSchedule } from '../../../services/actions/FlightManagementActions/flightScheduleAction'
import { getFlightSeasonList } from '../../../services/actions/FlightManagementActions/flightSeasonAction'
import { getAircraftTypeList } from '../../../services/actions/FlightManagementActions/aircraftTypeAction'
import { getAirportPairSearchList } from '../../../services/actions/FlightManagementActions/airportPairAction'
import { getErrorMsg, showAlert } from '../../../services/actions/commonActions';

// import reducers
import { setAirportPairList } from '../../../services/reducers/FlightManagementReducers/airportPairReducer';

// flight info api config
import { FLIGHT_SCHEDULE } from '../../../config'

const CheckboxGroup = Checkbox.Group;
const plainOptions = [
    "SATURDAY",
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY"
];
const defaultCheckedList = ['Apple', 'Orange'];

function AddEditForm() {
    const [rowdata, setRowdata] = useState({})
    const [checkAircraftTypeChange, setCheckAircraftTypeChange] = useState('')
    
    // for selected days
    const [checkedList, setCheckedList] = useState(defaultCheckedList);
    const [indeterminate, setIndeterminate] = useState(false);
    const [checkAll, setCheckAll] = useState(false);

    const { routePermissions } = useSelector(state => state.auth)
    const { success, isLoading} = useSelector(state => state.flightSchedule)
    const { aircraftTypeList } = useSelector(state => state.aircrafttype)
    const { airportList } = useSelector(state => state.airport)
    const { airportPairList } = useSelector(state => state.airportpair)
    const { flightSeasonList } = useSelector(state => state.flightSeason)

    // destructure parent path name 
    const { parent } = routePermissions

    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [form] = Form.useForm()
    const aircraftTypeId = Form.useWatch('aircraftTypeId', form)


    const onChange = (list) => {
        setCheckedList(list);
        setIndeterminate(!!list.length && list.length < plainOptions.length);
        setCheckAll(list.length === plainOptions.length);
    };

    const onCheckAllChange = (e) => {
        setCheckedList(e.target.checked ? plainOptions : []);
        setIndeterminate(false);
        setCheckAll(e.target.checked);
    };

    // Save or Submit Handler
    const _onFinish = values => {
        const { departureTime, arrivalTime } = values
        const transformedValues = {
            ...values,
            selectedDays: checkedList,
            departureTime: departureTime?.format('HH:mm'),
            arrivalTime: arrivalTime?.format('HH:mm'),
        }

        // dispatch to add and edit action
        if(id) {
            transformedValues.id = Number(id)
            let { aircraftTypeName, airportPairLeg, seasonName, time, ...getData } = rowdata
            if(comapreWithLodash.isEqual(transformedValues, getData)) {
                // show success message
                showAlert('success', 'Successfully Updated !!')
                return navigate(parent);
            } 
            dispatch(editFlightScheduleList(transformedValues))
        } else {
            dispatch(addFlightSchedule(transformedValues))
        } 
    };

    //reset form data
    const _onReset = () => {
        form.resetFields()
    };

    // inutfield structure
    const addEditInfoFields = [
        {
            field_name: 'Flight Season Info',
            field: [
                {
                    id: 1,
                    name: 'seasonId',
                    label: 'Flight Season',
                    type: 'seasonId',
                    rules: [
                        {
                            type: 'select',
                            message: 'The input is not valid',
                        },
                        {
                            required: true,
                            message: 'Please select flight season.',
                        },
                    ]
                }, 
                {
                    id: 2,
                    name: 'flightNo',
                    label: 'Flight No',
                    type: 'text',
                    rules: [
                        {
                            type: 'text',
                            message: 'The input is not valid',
                        },
                        {
                            required: true,
                            message: 'Please select flight no.',
                        },
                    ]
                },
            ]
        },
        {
            field_name: 'Flight Time Info',
            field: [
                {
                    id: 1,
                    name: 'departureTime',
                    label: 'Flight Departure Time',
                    type: 'time',
                    rules: [
                        {
                            type: 'time',
                            message: 'The input is not valid',
                        },
                        {
                            required: true,
                            message: 'Please select departure time.',
                        },
                    ]
                }, 
                {
                    id: 2,
                    name: 'arrivalTime',
                    label: 'Flight Arrival Time',
                    type: 'time',
                    rules: [
                        {
                            type: 'time',
                            message: 'The input is not valid',
                        },
                        {
                            required: true,
                            message: 'Please select arrival time.',
                        },
                    ]
                },
            ]
        },
        {
            field_name: 'Aircraft Info',
            field: [
                {
                    id: 1,
                    name: 'aircraftTypeId',
                    label: 'Aircraft Type',
                    type: 'aircraftTypeId',
                    rules: [
                        {
                            type: 'select',
                            message: 'The input is not valid',
                        },
                        {
                            required: true,
                            message: 'Please select aircraft type.',
                        },
                    ]
                },
                {
                    id: 2,
                    name: 'airportPairLegId',
                    label: 'Airport Pair Leg',
                    type: 'airportPairLegId',
                    rules: [
                        {
                            type: 'select',
                            message: 'The input is not valid',
                        },
                        {
                            required: true,
                            message: 'Please select airport pair leg.',
                        },
                    ]
                },
                {
                    id: 3,
                    name: 'flightType',
                    label: 'Flight Type',
                    type: 'flightType',
                    rules: [
                        {
                            type: 'select',
                            message: 'The input is not valid username',
                        },
                        {
                            required: true,
                            message: 'Please select flight type.',
                        },
                    ]
                },
            ]
        },
        {
            field_name: 'Flight Info',
            field: [
                {
                    id: 2,
                    name: 'isLayover',
                    label: 'Layover',
                    type: 'select',
                    rules: [
                        {
                            type: 'select',
                            message: 'The input is not valid',
                        },
                        {
                            required: true,
                            message: 'Please select layover.',
                        },
                    ]
                },  
            ]

        },
    ]

    const inputField = (type) => {
        const components = {
            text:  <Input type={'text'} placeholder="Enter flight no" />,
            textarea: (
                <Input.TextArea type={'text'} placeholder="Enter details here" />
            ),
            password: (
                <Input.Password
                    type={'password'}
                    placeholder={'Enter password here!'}
                />
            ),
            number: (
                <InputNumber type={'number'} placeholder={'Enter number here'} />
            ),
            email: <Input type={'email'} placeholder={'Enter your email here'} />,
            flightdate: <DatePicker style={{ width: '100%' }} />,
            date: <DatePicker showTime style={{ width: '100%' }} />,
            time: <TimePicker style={{ width: '100%' }} format="HH:mm" />,
            seasonId: (
                <Select placeholder="Select flight season">
                    {
                    flightSeasonList?.map(item => <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>)
                    }
                </Select>
            ),
            airportPairLegId: (
                <Select
                    showSearch
                    allowClear
                    style={{
                        width: '100%',
                    }}
                    placeholder="Search to Select Airport Pair Leg"
                    optionFilterProp="children"
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    options={airportPairList?.map(item => ({label: item?.leg, value: item?.id}))}
                />
            ),
            aircraftTypeId: (
                <Select
                    showSearch
                    style={{
                        width: '100%',
                    }}
                    placeholder="Search to Select Aircraft Type"
                    optionFilterProp="children"
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    options={aircraftTypeList?.map(item => ({label: item?.name, value: item?.id}))}
                />
            ),
            fromairport: (
                <Select placeholder={'Please select starting airport'}>
                  {airportList?.map((item) => (
                    <Select.Option value={item.id} key={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
            ),
            toairport: (
            <Select placeholder={'Please select destination airport'}>
                {airportList?.map((item) => (
                    <Select.Option value={item.id} key={item.id}>
                        {item.name}
                    </Select.Option>
                ))}
            </Select>
            ),
            flightType: (
                <Select placeholder={'Please select flight type'}>
                    <Select.Option value={'INTERNATIONAL'}> INTERNATIONAL </Select.Option>
                    <Select.Option value={'DOMESTIC'}> DOMESTIC </Select.Option>
                </Select>
            ),
            select: (
                <Select placeholder={'Please select layover'}>
                    <Select.Option value={true}> YES </Select.Option>
                    <Select.Option value={false}> NO </Select.Option>
                </Select>
            ),
        };
        return components[type] || null;
    }

    useEffect(()=> {
        !id && dispatch(setAirportPairList([]))

        // dispatch this action for select box.
        let pageWithSize = { page: 0, pageSize: 500 }
        dispatch(getFlightSeasonList(pageWithSize))
        dispatch(getAircraftTypeList(pageWithSize))

        const _fetchData = async () => {
            try {
                const response = await axios.get(FLIGHT_SCHEDULE.GET_FLIGHT_SCHEDULE_LIST + id)
                let newvalues = {
                    ...response.data,
                    departureTime: dayjs(response?.data?.departureTime, 'HH:mm'),
                    arrivalTime: dayjs(response?.data?.arrivalTime, 'HH:mm'),
                }
                setRowdata(response.data)
                setCheckedList(response?.data?.selectedDays)
                setIndeterminate(response?.data?.selectedDays?.length)
                setCheckAircraftTypeChange(response?.data?.aircraftTypeId)
                form.setFieldsValue(newvalues)
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
    },[])

    useEffect(() => {
        let data = {
            value: aircraftTypeId,
            columnName: 'aircraftTypeId',
            page: 0,
            pageSize: 200
        }
        if(aircraftTypeId !== checkAircraftTypeChange) {
            form.setFieldsValue({
                airportPairLegId: null
            })
        }
        aircraftTypeId && dispatch(getAirportPairSearchList(data));
    }, [aircraftTypeId]);

    useEffect(()=> {
        if(id) {
            // For edit form , If api response has successfully done then re-direct to parent path 
            success && navigate(parent)
        }
    },[success])

    return (
        <div className='bg-white py-3 rounded-md'>
            <Form
                validateTrigger={'onChange'}
                form={form}
                onFinish={_onFinish}
                scrollToFirstError
                layout={'vertical'}
                autoComplete={'off'}
            >
                <div className={'gap-5 sm:p-5'}>
                    {
                        addEditInfoFields?.map((field, index) => {
                            return (
                                <Badge.Ribbon text={field.field_name} placement='start'>
                                    <div className={'p-4 pt-10 border-solid border-2 border-gray-200 rounded-lg shadow-inner gap-5 mb-6'}>
                                        <div key={index} className={'grid sm:grid-cols-2 lg:grid-cols-2 p-4 gap-5'}>
                                            { field.field.map(item => {
                                                if(item.id) {
                                                    return (
                                                        <div key={item.id}>
                                                            <Form.Item
                                                                key={item.id}
                                                                name={item.name}
                                                                label={item.label}
                                                                rules={item.rules}
                                                                dependencies={item.dependencies ?? []}
                                                            >
                                                                {inputField(item?.type)}
                                                            </Form.Item>
                                                        </div>
                                                    )
                                                }
                                            }) }
                                        </div>
                                        <div className='pl-4'>
                                            {
                                                (field.field_name === 'Flight Season Info') && (
                                                    <div className='flex'>
                                                        <Checkbox 
                                                            className='' 
                                                            style={{ display: 'flex', alignItems: 'center' }} 
                                                            indeterminate={indeterminate} onChange={onCheckAllChange} 
                                                            checked={checkAll}
                                                        >
                                                            Check all
                                                        </Checkbox>
                                                        <CheckboxGroup 
                                                            className='ant-checkbox-wrapper ant-checkbox-group-item' 
                                                            style={{ display: "flex", marginLeft: 0, width: '14%', border: 'none', borderBottom: 'none' }} 
                                                            options={plainOptions} value={checkedList} onChange={onChange} 
                                                        />
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </Badge.Ribbon>
                                
                            )
                        })
                    }
                </div>
                <Form.Item style={{marginLeft: '17px'}}>
                    <Button 
                        htmlType={'submit'} 
                        type={'primary'} 
                        loading={isLoading} 
                        style={{ margin: '5px' }}
                    >
                        {id ? 'Update' : 'Submit'}
                    </Button>
                    {
                        !id && <Button htmlType={'reset'} onClick={() => _onReset}>{'Reset'}</Button>
                    }
                </Form.Item>
            </Form>
        </div>
    )
}


export default AddEditForm

