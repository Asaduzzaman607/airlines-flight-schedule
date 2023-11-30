import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import comapreWithLodash from "lodash"
import dayjs from 'dayjs'

// import components
import { CustomDatePicker, CustomSelectWithSearch } from '../../commonComponents/CustomFormField'
import { Button, Form, Input, InputNumber, Select } from 'antd'

// import actions
import { addRecencyAssign, editRecencyAssign } from '../../../services/actions/RecencyManagementActions/recencyAssignAction'
import { getAircraftTypeList } from '../../../services/actions/FlightManagementActions/aircraftTypeAction'
import { getAirportPairSearchList } from '../../../services/actions/FlightManagementActions/airportPairAction'
import { getErrorMsg, showAlert } from '../../../services/actions/commonActions'

// import reducers
import { setRecencyList } from '../../../services/reducers/RecencyManagementReducers/recencyReducer'

// import recency config
import { RECENCY } from '../../../config'

function AddEditForm() {
    const [rowdata, setRowdata] = useState({})
    const [completedValue, setCompletedValue] = useState(null)
    const [employeeListByAircraftType, setEmployeeListByAircraftType] = useState([])
    const [crewRecencyList, setCrewRecencyList] = useState([])
    const [aircraftTypeChangeStatus, setAircraftTypeChangeStatus] = useState(true)
    const [employeeChangeStatus, setEmployeeChangeStatus] = useState(true)
    const [validityDetails, setValidityDetails] = useState([])

    const { success, isLoadingAddUser } = useSelector(state => state.recencyassign)
    const { routePermissions } = useSelector(state => state.auth)
    const { aircraftTypeList } = useSelector(state => state.aircrafttype)
    const { airportPairList } = useSelector(state => state.airportpair)

    // destructure parent path name 
    const { parent } = routePermissions

    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [form] = Form.useForm()

    // get form value
    const isDoneValue = Form.useWatch('isDone', form)
    const aircraftTypeId = Form.useWatch('aircraftTypeId', form)
    const employeeId = Form.useWatch('employeeId', form)


    const _onFinish = values => {
        const { dateOfExam, fromDateTime, toDateTime, certificateDate, validFrom, validTill } = values
        const transformedValues = {
            ...values,
            employeeId: Number(values.employeeId),
            dateOfExam: dateOfExam?.format('YYYY-MM-DD'),
            fromDateTime: fromDateTime?.format('YYYY-MM-DD HH:mm'),
            toDateTime: toDateTime?.format('YYYY-MM-DD HH:mm'),
            certificateDate: certificateDate?.format('YYYY-MM-DD'),
            validFrom: validFrom?.format('YYYY-MM-DD'),
            validTill: validTill?.format('YYYY-MM-DD'),
        }

        // dispatch to add and edit action
        if(id) {
            transformedValues.id = Number(id)
            const { ...getData } = rowdata
            if(comapreWithLodash.isEqual(values, getData)) {
                // show success message
                showAlert('success', 'Successfully Updated.')
                return navigate(parent);
            }

            dispatch(editRecencyAssign(transformedValues))
        } else {
            dispatch(addRecencyAssign(transformedValues))
        } 
    }

    //reset form data
    const _onReset = () => {
        form.resetFields()
    }

    // onChange Handler
    const onValueChangeHander = (changedValues, _) => {
        const _fetchData = async () => {
            try {
                const { data } = await axios.get(RECENCY.GET_CREW_RECENCY_VALIDITY, { params: { id: changedValues?.crewRecencyId} })
                setValidityDetails(data ?? {})
            } catch (error) {
                console.error(error);
                const errMsg = getErrorMsg(error)

                // show error msg
                showAlert('error', errMsg)
            }
        }

        if(changedValues?.crewRecencyId) {
            _fetchData()
        }
        if(changedValues?.toDateTime) { 
            const modifiedValideTillDate = changedValues?.toDateTime?.format('YYYY-MM-DD HH:mm')?.split(' ')?.[0]?.split('-')
            
            if(validityDetails?.YEAR) {
                modifiedValideTillDate[0] = Number(modifiedValideTillDate?.[0])  + validityDetails?.YEAR
            } else if(validityDetails?.MONTH) {
                modifiedValideTillDate[1] = Number(modifiedValideTillDate?.[1])  + validityDetails?.MONTH
            } else if(validityDetails?.DAYS) {
                modifiedValideTillDate[2] = Number(modifiedValideTillDate?.[2])  + validityDetails?.DAYS
            }
            
            form.setFieldsValue({ 
                validFrom: changedValues?.toDateTime && dayjs(changedValues.toDateTime, "YYYY-MM-DD"), 
                validTill: modifiedValideTillDate && dayjs(modifiedValideTillDate.toString(), "YYYY-MM-DD"), 
            })
        }
    } 

    const inputField = ({ type, label }) => {
        const _components = {
            text: <Input type={'text'} placeholder="Enter here!" />,
            textarea: <Input.TextArea type={'text'} placeholder="Enter details here!" />,
            password: <Input.Password type={'password'} placeholder="Enter password here!" />,
            number: <InputNumber type={'number'} placeholder="Enter number here!" />,
            email: <Input type={'email'} placeholder="Enter your email here!" />,
            date: <CustomDatePicker format={"YYYY-MM-DD HH:mm"} showTime={true} placeholder={`Enter ${label}`} />,
            validFormTill: <CustomDatePicker showTime={false} placeholder={`Enter ${label}`} />,
            employeeId: (
                <Select
                    showSearch
                    allowClear
                    style={{
                        width: '100%',
                    }}
                    placeholder="Select employee"
                    optionFilterProp="children"
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    options={ employeeListByAircraftType.map((item) => ({label: item?.employeeName, value: item?.id})) }
                />
            ),
            crewRecencyId: (
                <Select
                    showSearch
                    allowClear
                    style={{
                        width: '100%',
                    }}
                    placeholder="Select recency name"
                    optionFilterProp="children"
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    options={ crewRecencyList.map((item) => ({label: item?.recencyName, value: item?.recencyId})) }
                />
            ),
            aircraftTypeId: (
                <CustomSelectWithSearch 
                    itemList={aircraftTypeList} 
                    label={'name'} 
                    dataIndex={'id'} 
                    mode={'single'}
                    placeholder={`Select ${label}`}
                />
            ),
            isDone: (
                <Select placeholder="Select recency status" allowClear>
                    <Select.Option value={true} >{"Complete"}</Select.Option>
                    <Select.Option value={false} >{"Incomplete"}</Select.Option>
                </Select>
            ),
            leg: (
                <CustomSelectWithSearch 
                    itemList={airportPairList} 
                    label={'leg'} 
                    dataIndex={'id'} 
                    mode={'single'}
                    placeholder={`Select ${label}`}
                />
            )
        }

        return _components[type] || null;
    }

    useEffect(() => {
        setCompletedValue(isDoneValue)
        if(id) {
            // For edit form , If api response has successfully done then re-direct to parent path 
            success && navigate(parent)
        }
    }, [success, isDoneValue, completedValue])

    useEffect(()=> {
        dispatch(setRecencyList([]))

        // dispatch action for select box
        let pageWithSize = { page: 0, pageSize: 500 }
        dispatch(getAircraftTypeList(pageWithSize))

        const _fetchData = async () => {
            try {
                const { data } = await axios.get(RECENCY.RECENCY_ASSIGNMENT + id)
                let newvalues = {
                    ...data,
                    dateOfExam: data?.dateOfExam && dayjs(data?.dateOfExam),
                    fromDateTime: data?.fromDateTime && dayjs(data?.fromDateTime, "YYYY-MM-DD HH:mm"),
                    toDateTime: data?.toDateTime && dayjs(data?.toDateTime, "YYYY-MM-DD HH:mm"),
                    certificateDate: data.certificateDate && dayjs(data?.certificateDate),
                    validFrom: data.validFrom && dayjs(data?.validFrom, "YYYY-MM-DD"),
                    validTill: data.validTill && dayjs(data?.validTill, "YYYY-MM-DD"),
                }
                onValueChangeHander({ crewRecencyId: data.crewRecencyId }, '')
                setCompletedValue(data?.isDone)
                setRowdata(data)
                setAircraftTypeChangeStatus(false)
                setEmployeeChangeStatus(false)
                form.setFieldsValue(newvalues)
            } catch (error) {
                console.error(error)
                const errMsg = getErrorMsg(error)

                // show error msg
                showAlert('error', errMsg)
            }
        }

        if(id) {
            // get single row data for edit
            _fetchData()
        }
    },[])

    // get Employee Name Based on Aircraft Type
    useEffect(()=> {
        if(aircraftTypeId) {
            if(aircraftTypeChangeStatus) {
                form.setFieldsValue({
                    crewRecencyId: null,
                    employeeId: null,
                })
                setCrewRecencyList([])
            }

            const _fetchEmployeeData = async () => {
                try {
                    const response = await axios.get(RECENCY.GET_EMPLOYEE_BY_AIRCRAFTTYPE + aircraftTypeId + `?page=${0}&size=${500}` )
                    setEmployeeListByAircraftType(response?.data?.model)
                    
                } catch (error) {
                    console.error(error)
                    const errMsg = getErrorMsg(error)

                    // show error msg
                    showAlert('error', errMsg)
                }
            }

            _fetchEmployeeData()
            setAircraftTypeChangeStatus(true)

            // get Leg based on Aircraft Type
            let data = {
                value: aircraftTypeId,
                columnName: 'aircraftTypeId',
                page: 0,
                pageSize: 200
            }
            !id && form.setFieldsValue({
                airportPairId: undefined
            })
            aircraftTypeId && dispatch(getAirportPairSearchList(data));
        }
    },[aircraftTypeId])

    // get Crew recency Name Based on Aircraft Type and Employee Name
    useEffect(()=> {
        if(employeeId) {
            if(employeeChangeStatus) {
                form.setFieldsValue({
                    crewRecencyId: null,
                })
                setCrewRecencyList([])
            }
            const employeeData = employeeListByAircraftType?.find((item) => item.id === employeeId)
            const _fetchCrewRecencyData = async () => {
                try {
                    const { data: { model } } = await axios.get(RECENCY.GET_CREW_RECENCY + `?id=${aircraftTypeId}&type=${employeeData?.crewType}&page=${0}&size=${500}`)
                    setCrewRecencyList(model?.length ? model : [])
                    
                } catch (error) {
                    console.error(error)
                    const errMsg = getErrorMsg(error)

                    // show error msg
                    showAlert('error', errMsg)
                }
            }
            if(employeeData?.crewType) {
                _fetchCrewRecencyData()
            }
            employeeListByAircraftType.length && setEmployeeChangeStatus(true)
        }
    },[employeeId, employeeListByAircraftType])

    // form field type
    const addEditInfoFields = [
        {
            id: 3,
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
                    message: 'Please select aircraft type!',
                },
            ],
        },
        {
            id: 1,
            name: 'employeeId',
            label: 'Employee Name',
            type: 'employeeId',
            rules: [
                {
                    type: 'select',
                    message: 'The input is not valid',
                },
                {
                    required: true,
                    message: 'Please select employee!',
                },
            ]
        },
        {
            id: 2,
            name: 'crewRecencyId',
            label: 'Recency Name',
            type: 'crewRecencyId',
            rules: [
                {
                    type: 'select',
                    message: 'The input is not valid',
                },
                {
                    required: true,
                    message: 'Please select recency name',
                },
            ]
        },
        {
            id: 5,
            name: 'fromDateTime',
            label: 'Start Course Date',
            type: 'date',
            rules: [
                {
                    type: 'date',
                    message: 'Start course date is not valid',
                },
                {
                    required: true,
                    message: 'Please select start course date',
                },
            ]
        },
        {
            id: 6,
            name: 'toDateTime',
            label: 'End Course Date',
            type: 'date',
            rules: [
                {
                    type: 'date',
                    message: 'End course date is not valid',
                },
                {
                    required: true,
                    message: 'Please select end course date',
                },
            ]
        },
        {
            id: 10,
            name: 'airportPairId',
            label: 'Leg',
            type: 'leg',
            rules: [
                {
                    type: 'select',
                    message: 'The input is not valid',
                },
                {
                    required: false,
                    message: 'Please select any one!',
                },
            ]
        },
        {
            id: 11,
            name: 'isDone',
            label: 'Recency Status',
            type: 'isDone',
            rules: [
                {
                    type: 'select',
                    message: 'Recency status is not valid',
                },
                {
                    required: true,
                    message: 'Please select recency status!',
                },
            ]
        },
        {
            id: completedValue ? 8 : null,
            name: 'validFrom',
            label: 'Valid From',
            type: 'validFormTill',
            rules: [
                {
                    type: 'date',
                    message: 'The input is not valid',
                },
                {
                    required: true,
                    message: 'Please select valid from!',
                },
            ]
        },
        {
            id: completedValue ? 9 : null,
            name: 'validTill',
            label: 'Valid Till',
            type: 'validFormTill',
            rules: [
                {
                    type: 'date',
                    message: 'The input is not valid',
                },
                {
                    required: true,
                    message: 'Please select valid till!',
                },
            ]
        },
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
                onValuesChange={onValueChangeHander}
            >
            <div className={'grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:p-5'}>
                {
                    addEditInfoFields?.map(field => {
                        // If completed is done then cetificate date, valid form and valid till field will be show. 
                        if(field.id) {
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
                        }
                    })
                }
            </div>
            <Form.Item style={{marginLeft: '17px'}}>
                <Button 
                    htmlType={'submit'} 
                    type={'primary'} 
                    loading={isLoadingAddUser} 
                    style={{ margin: '5px' }}
                >
                    { id ? 'Update' : 'Submit' }
                </Button>
                {!id && <Button htmlType={'reset'} onClick={() => _onReset}>{'Reset'}</Button>}
            </Form.Item>
            </Form>
        </div>
    )
}

export default AddEditForm
