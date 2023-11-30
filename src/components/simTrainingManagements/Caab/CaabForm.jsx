import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs'
import axios from "axios";
import comapreWithLodash from "lodash";

// import components
import { Button, Form, Badge } from 'antd';
import { CustomInput, CustomDatePicker, CustomSelectBox, CustomTextArea } from '../../commonComponents'

// import actions
import { addCaab, editCaabList } from '../../../services/actions/SimTrainingManagementActions/caabAction'
import { getErrorMsg, showAlert } from '../../../services/actions/commonActions';
import { getEmployeeSearchList } from '../../../services/actions/CrewManagementActions/employeeAction'

// import reducers
import { setCaabList, setCrewType, setCockpitCrewType, setCabinCrewType, setLicenceno, setIdNo, crewType, cockpitCrewType, cabinCrewType, licenceno, idNo } from '../../../services/reducers/SimTrainingManagementReducers/caabReducer';

// licence api config
import { EMPLOYEE, LICENCE, DATE_FORMAT, TIME_FORMAT } from '../../../config'

function CaabForm() {
    const [rowdata, setRowdata] = useState({})
    const [designationData, setDesignationData] = useState('')

    const { employeeList } = useSelector(state => state.employee)
    const { success, isLoading } = useSelector(state => state.caab)
    const { routePermissions } = useSelector(state => state.auth)

    // destructure parent path name 
    const { parent } = routePermissions

    const { id } = useParams()

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [form] = Form.useForm()

    // get input field value from Form
    const employeeId = Form.useWatch('employeeId', form)
    const actionFromCaab = Form.useWatch('actionFromCaab', form)

    useEffect(() => {
        // dispatch this action for select box.
        let pageWithSize = { page: 0, pageSize: 500 }
        dispatch(getEmployeeSearchList(pageWithSize))
    }, [])

    useEffect(() => {
        const _fetchDataa = async () => {
            try {
                //get Employee
                const { response } = await axios.get(EMPLOYEE.GET_EMPLOYEE_LIST + employeeId)

                dispatch(setCrewType(response?.data?.crewType))
                dispatch(setCockpitCrewType(response?.data?.cockpitCrewType))
                dispatch(setCabinCrewType(response?.data?.cabinCrewType))
                dispatch(setLicenceno(response?.data?.licenceNumber))
                dispatch(setIdNo(response?.data?.aircraftTypesNames[0]))


                { crewType === "COCKPIT_CREW" ? setDesignationData(cockpitCrewType) : setDesignationData(cabinCrewType) }

                form.setFieldsValue({
                    licenceno: licenceno,
                    idNo: idNo,
                    designation: designationData
                })

            } catch (error) {
                console.error(error);
                const errMsg = getErrorMsg(error)
                // show error msg
                showAlert('error', errMsg)

            }
        }

        if (employeeId) _fetchDataa();
    }, [employeeId, designationData, crewType])

    // Save or Submit Handler
    const _onFinish = values => {

        const transformedValues = {
            ...values,   
            approvalDate: values?.approvalDate && values?.approvalDate?.format(DATE_FORMAT),
            sentDate: values?.sentDate && values?.sentDate?.format(DATE_FORMAT),
        }

        if (id) {
            transformedValues.id = Number(id)
            if (comapreWithLodash.isEqual(transformedValues)) {
                // show success message
                showAlert('success', 'Successfully Updated.')
                return navigate(parent);
            }
            dispatch(editCaabList(transformedValues))
        } else {
            dispatch(addCaab(transformedValues))
        }

    };

    useEffect(() => {
        !id && dispatch(setCaabList([]))

        const _fetchData = async () => {
            try {
                const { data } = await axios.get(LICENCE.ADD_CAAB + id)
                let newvalues = {
                    ...data,
                    approvalDate: data?.approvalDate && dayjs(data?.approvalDate, TIME_FORMAT),
                    sentDate: data?.sentDate && dayjs(data?.sentDate, TIME_FORMAT),
                }
                setRowdata(data)

                form.setFieldsValue(newvalues)
            } catch (error) {
                console.error(error);

                const errMsg = getErrorMsg(error)

                // show error msg
                showAlert('error', errMsg)
            }
        }

        if (id) {
            _fetchData()
        }
    }, [])

    useEffect(() => {

        if (id) {
            // For edit form , If api response has successfully done then re-direct to parent path 
            success && navigate(parent)
        }
    }, [success])

    //reset form data
    const _onReset = () => {
        form.resetFields()
    };

    const actionFromCaabData=[
        {
            id:1,
            value:"DONE"
        },
        {
            id:2,
            value:"PENDING" 
        },
    ]
    const addEditInfoFields = [
        {
            id: 1,
            field_name: 'CAAB Corresponding Info',
            field: [
                {
                    id: 1,
                    name: 'refNo',
                    label: 'Reference No',
                    type: 'text',
                    rules: [
                        {
                            required: true,
                            message: 'Reference No. is required',
                        }
                    ]
                },
                {
                    id: 2,
                    name: 'details',
                    label: 'Details',
                    type: 'text'
                },
                {
                    id: 3,
                    name: 'sentDate',
                    label: 'Sent Date',
                    type: 'date',
                    rules: [
                        {
                            required: true,
                            message: 'Sent Date is required',
                        }
                    ]
                },
                {
                    id: 4,
                    name: 'employeeId',
                    label: 'Related Crew Name',
                    type: 'employeeId'
                },
                {
                    id: 6,
                    name: 'actionFromCaab',
                    label: 'Action from CAAB Corresponding',
                    type: 'actionFromCaab'
                },
                {
                    id: (actionFromCaab === 'DONE') ? 6 : '',
                    name: 'approvalDate',
                    label: 'Approval Date',
                    type: 'date'
                },
                {
                    id: 7,
                    name: 'remark',
                    label: 'Remark',
                    type: 'textarea'
                }
            ]
        }
    ]

    const inputField = ({ type, label }) => {
        const components = {
            text:  <CustomInput type={'text'} placeholder={`Enter ${label}`} />,
            textarea:  <CustomTextArea type={'text'} placeholder={`Enter ${label}`} />,
            date: <CustomDatePicker showTime={false} placeholder={`Select ${label}`} />,
            approvalDate: <CustomDatePicker showTime={false} placeholder={`Select ${label}`} />,
            employeeId: (
                <CustomSelectBox
                    itemList={employeeList} 
                    label={'name'} 
                    dataIndex={'id'} 
                    mode={'single'}
                    placeholder={`Select ${label}`}  
                    allowClear={true}               
                />
            ),
            actionFromCaab: (
                <CustomSelectBox
                    itemList={actionFromCaabData} 
                    label={'name'} 
                    dataIndex={'value'} 
                    mode={'single'}
                    placeholder={`Select ${label}`} 
                    allowClear={true}                
                />
            )
        };
        return components[type] || null;
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
            >
                <div className='gap-5 sm:p-5'>
                    {
                        addEditInfoFields?.length > 0 &&
                        addEditInfoFields?.map((field, index) => {
                            return (
                                field?.id &&
                                <Badge.Ribbon text={field?.field_name} placement='start'>
                                    <div key={index} className={'grid sm:grid-cols-2 lg:grid-cols-3 p-4 pt-10 border-solid border-2 border-gray-200 rounded-lg shadow-inner gap-5 mb-6'}>
                                        {field && field?.field.map(item =>{
                                            if (item?.id) {
                                                return (
                                                    <>
                                                        <Form.Item
                                                            key={item?.id}
                                                            name={item?.name ?? 'N/A'}
                                                            label={item?.label}
                                                            rules={item?.rules}
                                                            dependencies={item?.dependencies ?? []}
                                                        >
                                                            {inputField(item)}
                                                        </Form.Item>
                                                    </>
                                                )
                                            }

                                        })}
                                    </div>
                                </Badge.Ribbon>
                            )
                        })
                    }
                </div>

                <Form.Item style={{ marginLeft: '17px' }}>
                    <Button
                        htmlType={'submit'}
                        type={'primary'}
                        loading={isLoading}
                        style={{ margin: '5px' }}
                    >
                        {id ? 'Update' : 'Submit'}
                    </Button>
                    {
                      !id &&
                       <Button 
                            htmlType={'reset'} 
                            onClick={_onReset}>
                            {'Reset'}
                        </Button>}
                </Form.Item>
            </Form>
        </div>
    )
}
export default CaabForm

