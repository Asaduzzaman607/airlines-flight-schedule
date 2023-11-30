import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs'
import axios from "axios";
import comapreWithLodash from "lodash";

// import components
import { Form, Badge, Button } from 'antd';
import { CustomInput, CustomSelectBox, CustomDatePicker, CustomSelectWithSearch } from '../../commonComponents'

// import actions
import { addLicence, editLicenceList, getEmployeeList } from '../../../services/actions/SimTrainingManagementActions/licenceAction'
import { getErrorMsg, showAlert } from '../../../services/actions/commonActions';

// import reducers
import { setLicenceList } from '../../../services/reducers/SimTrainingManagementReducers/licenceReducer';

// licence api config
import { EMPLOYEE, LICENCE, DATE_FORMAT, TIME_FORMAT } from '../../../config'

function LicenceForm() {
    const [rowdata, setRowdata] = useState({})
    const [editData, setEditData] = useState(false)
    const [employeeFetch, setEmployeeFetch] = useState(false)
    const [updateLicenceFetch, setUpdateLicenceFetch] = useState(false)

    const { success, isLoading, isForeign,employeeList } = useSelector(state => state.licence)
    
    const { routePermissions } = useSelector(state => state.auth)

    // destructure parent path name 
    const { parent } = routePermissions
    const { id } = useParams()
 
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [form] = Form.useForm()

    // get input field value from Form
    const employeeId = Form.useWatch('employeeId', form)
    const licenseType = Form.useWatch('licenseType', form)
    const cftiValidityType = Form.useWatch('cftiValidityType', form)
    const dcpCValidityType = Form.useWatch('dcpCValidityType', form)
    const dcpCType = Form.useWatch('dcpCType', form)
    const elpType = Form.useWatch('elpType', form)
    const irType = Form.useWatch('irType', form)
    const lastPpcDate = Form.useWatch('lastPpcDate', form)
    const ppcValidityExpiryDate= Form.useWatch('ppcValidityExpiryDate', form)
  
    const licenceno = Form.useWatch('licenceno', form)
    const idNo = Form.useWatch('idNo', form)
    const designation = Form.useWatch('designation', form)
    const pilotType = Form.useWatch('pilotType', form)
    const employeeName = Form.useWatch('employeeName',form)
    
    useEffect(() => {
        // dispatch this action for employee list.
        let pageWithSize = { page: 0, pageSize: 500, isForeign }
        dispatch(getEmployeeList(pageWithSize))
    }, [isForeign])

    const _fetchDataa = async () => {

        try {
            //get Employee
            const { data } = await axios.get(EMPLOYEE.GET_EMPLOYEE_LIST + employeeId)

            form.setFieldsValue({
                licenceno: data?.licenceNumber,
                idNo:  data?.aircraftTypesNames[0] && data.aircraftTypesNames[0]
            })
   
            if(data?.crewType && data?.crewType){
                form.setFieldsValue({
                    designation:   data?.crewType === "COCKPIT_CREW" ? data?.cockpitCrewType : data?.cabinCrewType
                })
            }
             _fetchPPC();
        } catch (error) {
            console.error(error);
            const errMsg = getErrorMsg(error)
            // show error msg
            showAlert('error', errMsg)

        }
    }

    const _fetchPPC = async () => {

        try {         
            //get Last PPC
            const { data } = await axios.get(LICENCE.GET_LAST_PPC + employeeId)
          
            form.setFieldsValue({
                lastPpcDate: data?.lastPpcDate && data.lastPpcDate,
                ppcValidityExpiryDate: data?.ppcValidityExpiryDate && data.ppcValidityExpiryDate
            })
            if ( data?.lastPpcDate && data.lastPpcDate === null) {    
                form.setFieldsValue({
                    lastPpcDate: "N/A",
                })
              }
              if ( data?.ppcValidityExpiryDate && data.ppcValidityExpiryDate === null) {
                form.setFieldsValue({
                    ppcValidityExpiryDate: "N/A",
                })
              }
        } catch (error) {
            console.error(error);
            const errMsg = getErrorMsg(error)
            // show error msg
            showAlert('error', errMsg)

        }
    }

    useEffect(() => {
    
        setEmployeeFetch(true)
        if (employeeId) _fetchDataa();
       
        return () => {
            setEmployeeFetch(false)      
        }
    }, [employeeId])
    

    // Save or Submit Handler
    const _onFinish = values => {

        const transformedValues = {
            ...values,
            licenseExpiryDate: values?.licenseExpiryDate && values.licenseExpiryDate.format(DATE_FORMAT),
            cftiValidityExpiryDate: values?.cftiValidityExpiryDate && values.cftiValidityExpiryDate.format(DATE_FORMAT),
            dcpCValidityExpiryDate: values?.dcpCValidityExpiryDate && values.dcpCValidityExpiryDate.format(DATE_FORMAT),
            medicalExpiryDate: values?.medicalExpiryDate && values.medicalExpiryDate.format(DATE_FORMAT),
            elpExpiryDate: values?.elpExpiryDate && values.elpExpiryDate.format(DATE_FORMAT),
            irExpiryDate: values?.irExpiryDate && values.irExpiryDate.format(DATE_FORMAT),
            employeeId:id ? id : employeeId
        }

        if (id) {
            transformedValues.id = Number(id)
            const { licenceno, designation,pilotType, ppcValidityExpiryDate, lastPpcDate,...finalData } = rowdata
            if (comapreWithLodash.isEqual(transformedValues, finalData)) {
                // show success message
                showAlert('success', 'Successfully Updated.')
                return navigate(parent);
            }
            dispatch(editLicenceList(transformedValues))
        } else {
            const { licenceno, designation, pilotType, ...finalData } = transformedValues;
            dispatch(addLicence(finalData))
        }
    };

    useEffect(() => {
        !id && dispatch(setLicenceList([]))
     
        const _fetchData = async () => {
            try {
                const { data } = await axios.get(LICENCE.ADD_LICENCE + id)

                let newvalues = {
                    ...data,
                    licenseExpiryDate: data?.licenseExpiryDate && dayjs(data.licenseExpiryDate, TIME_FORMAT),
                    cftiValidityExpiryDate: data?.cftiValidityExpiryDate && dayjs(data.cftiValidityExpiryDate, TIME_FORMAT),
                    dcpCValidityExpiryDate: data?.dcpCValidityExpiryDate && dayjs(data.dcpCValidityExpiryDate, TIME_FORMAT),
                    medicalExpiryDate: data?.medicalExpiryDate && dayjs(data.medicalExpiryDate, TIME_FORMAT),
                    elpExpiryDate: data?.elpExpiryDate && dayjs(data.elpExpiryDate, TIME_FORMAT),
                    irExpiryDate: data?.irExpiryDate && dayjs(data.irExpiryDate, TIME_FORMAT),
                    lastPpcDate: data?.lastPpcDate && dayjs(data.lastPpcDate, TIME_FORMAT),
                    ppcValidityExpiryDate: data?.ppcValidityExpiryDate && dayjs(data.ppcValidityExpiryDate, TIME_FORMAT), 
             
                }
                form.setFieldsValue({
                    pilotType:data?.pilotType,
                    employeeName:data?.employeeName  
                })
                setRowdata(data)
                setEditData(true)
                form.setFieldsValue(newvalues)
            } catch (error) {
                console.error(error);

                const errMsg = getErrorMsg(error)

                // show error msg
                showAlert('error', errMsg)
            }
        }
        setUpdateLicenceFetch(true)
        if (id) {
            _fetchData()
        }
        return () => {
            setUpdateLicenceFetch(false)      
        }
    }, [id])
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

    const _selectPilotTypeHandler = (value) => {
        let pageWithSize = { page: 0, pageSize: 500,isForeign: value}
        // dispatch this action for select box.
        dispatch(getEmployeeList(pageWithSize))
    }

    const addEditInfoFields = [
        {
            id:  1,
            field_name: 'General',
            field: [
                {
                    id:  id ? null: 1,
                    name: 'pilotType',
                    label: 'Pilot Type',
                    type: 'isForeign'
                },
                {
                    id:  id ? 1: null,
                    name: 'pilotType',
                    type: 'isForeignText'  
                },
                {
                    id:   id ? null : 2,
                    name: 'employeeId',
                    label: 'Name of Pilots',
                    type: 'employeeId',
                    rules: [
                        {
                            required: true,
                            message: 'Select Name Of Pilots.',
                        },
                    ]
                },
                {
                    id:  id ? 2: null,
                    name:'employeeName',
                    type: 'employeeIdtext'  
                },
                {
                    id: employeeId ? 3 : null,
                    name:  'idNo',
                    type: 'employeeInfo',
                },
                {
                    id: employeeId ? 4 : null,
                    name:  'designation',
                    type: 'employeeInfo1',
                },
                {
                    id: employeeId ? 5 : null,
                    name:  'licenceno',
                    type: 'employeeInfo2',
                }
            ]
        },
        {
            id: 2,
            field_name: 'Certificate Info',
            field: [
                {
                    id: 1,
                    name: 'licenseType',
                    label: 'Licence Type',
                    type: 'licenseType',
                    rules: [
                        {
                            required: true,
                            message: 'Select Licence Type.',
                        },
                    ]
                },
                {
                    id: (licenseType === "EXPIRY") ? 2 : null,
                    name: 'licenseExpiryDate',
                    label: 'Licence Expire Date',
                    type: 'date',
                    rules: [
                        {
                            required: (licenseType === "EXPIRY") ? true : false,
                            message: 'Select Licence Expire Date.',
                        }
                    ]
                }
            ]
        },
        {
            id: 3,
            field_name: 'Validity Info',
            field: [
                {
                    id: 1,
                    name: 'cftiValidityType',
                    label: 'CFTI Validity Type',
                    type: 'cftiValidityType'
                },
                {
                    id: (cftiValidityType === "EXPIRY") ? 2 : null,
                    name: 'cftiValidityExpiryDate',
                    label: 'CFTI Expire Date',
                    type: 'date'
                },
                {
                    id: 3,
                    name: 'dcpCType',
                    label: 'DCP Validity Type',
                    type: 'dcpValidityType'
                },
                {
                    id:  dcpCType ? 4 : null,
                    name: 'dcpCValidityType',
                    label: 'DCP Expire Type',
                    type: 'dcpCValidityType'
                },
                {
                    id: (dcpCValidityType === "EXPIRY") ? 4 : null,
                    name: 'dcpCValidityExpiryDate',
                    label: 'DCP Expire Date',
                    type: 'date'
                },

            ]
        },
        {
            id: 4,
            field_name: 'Others Validity Info',
            field: [
                {
                    id: 1,
                    name: 'medicalExpiryDate',
                    label: 'Medical Type Expire Date',
                    type: 'date',
                    rules: [
                        {
                            required: true,
                            message: 'Select Medical Type Expire Date.',
                        },
                    ]
                },
                {
                    id: 2,
                    name: 'elpType',
                    label: 'ELP Validity Type',
                    type: 'elpType',
                    rules: [
                        {
                            required: true,
                            message: 'Select ELP Validity Type.',
                        },
                    ]
                },
                {
                    id: (elpType === "EXPIRY") ? 3 : null,
                    name: 'elpExpiryDate',
                    label: 'ELP Expire Date',
                    type: 'date',
                    rules: [
                        {
                            required: elpType === "EXPIRY",
                            message: 'Select ELP Expire Date.',
                        }
                    ]
                },
                {
                    id: 4,
                    name: 'irType',
                    label: 'IR Validity Type',
                    type: 'irType',
                    rules: [
                        {
                            required: true,
                            message: 'Select IR Validity Type.',
                        },
                    ]
                },
                {
                    id: (irType === "EXPIRY") ? 5 : null,
                    name: 'irExpiryDate',
                    label: 'IR Expire Date',
                    type: 'date',
                    rules: [
                        {
                            required: irType === "EXPIRY",
                            message: 'Select IR Expire Date.',
                        }
                    ]
                },
            ]
        },
        {
            id: 5,
            field_name: 'PPC Info',
            field: [
                {
                    id: employeeId ? 1 : null,
                    name: 'lastPpcDate',
                    type: 'lastPpcDateType'
                },
                {
                    id: 2,
                    name: 'lastPpcCaabEndorsmentType',
                    label: 'CAAB Endorsement',
                    type: 'caab',
                    rules: [
                        {
                            required: true,
                            message: 'Select CAAB Endorsement.',
                        }
                    ]
                },
                {
                    id: employeeId ? 3 : null,
                    name: 'ppcValidityExpiryDate',
                    type: 'ppcValidityExpiryDateType'
                }
            ]
        },
    ]
  
    const typeData=[
        {
            id:1,
            value:"EXPIRY"
        },
        {
            id:2,
            value:"NON_EXPIRY"
        },
    ]
    const dcpValidityData=[
        {
            id:"A",
            value:"A"
        },
        {
            id:"B",
            value:"B"
        },
        {
            id:"C",
            value:"C"
        },
        {
            id:"D",
            value:"D"
        },
    ]
    const actionData=[
        {
            id:1,
            value:"DONE"
        },
        {
            id:2,
            value:"PENDING"
        },
    ]

    const localData=[
        {
            id:1,
            value:"FALSE",
            name:"LOCAL"
        },
        {
            id:2,
            value:"TRUE",
            name:"FOREIGN"
        },
    ]

    const Items = ({ title, id }) => (
        <div className={'row mt-9 ml-4'}>
            <div className={'col-md-4'}> 
                 <b> { title } </b>
                 <span>: { id } </span>
             </div>
        </div>
    )

    const inputField = ({ type, label }) => {
        const components = {
            text: <CustomInput type={'text'} placeholder={`Enter ${label}`} />,
 
            date: <CustomDatePicker showTime={false} placeholder={`Select ${label}`} />,
            lastPpcDateType: !editData ?<Items title={'Last PPC Date'} id={lastPpcDate}/>: null,
            ppcValidityExpiryDateType:!editData ? <Items title={'PPC Validity Period'} id={ppcValidityExpiryDate} />: null,
            employeeInfo: (
                !editData ? <Items title={'Fleet'} id={idNo} /> : null
            ),
            employeeInfo1:  !editData ? <Items title={'Designation'} id={designation} /> : null,
            employeeInfo2: !editData ? <Items title={'Licence No'} id={licenceno} /> : null,
            licenseType: (
                <CustomSelectBox
                    itemList={typeData} 
                    label={'name'} 
                    dataIndex={'value'} 
                    mode={'single'}
                    placeholder={`Select ${label}`}   
                    allowClear={true}             
                />
            ),
            caab: (
                <CustomSelectBox
                    itemList={actionData} 
                    label={'name'} 
                    dataIndex={'value'} 
                    mode={'single'}
                    placeholder={`Select ${label}`} 
                    allowClear={true}               
                />
            ),
            isForeign: (
                <CustomSelectBox
                    itemList={localData} 
                    label={'name'} 
                    dataIndex={'value'} 
                    mode={'single'}
                    placeholder={`Select ${label}`}  
                    defaultValue={'LOCAL'}   
                    onChange={_selectPilotTypeHandler} 
                    allowClear={true}          
                />
            ),
            isForeignText:  <Items title={'Pilot Type'} id={pilotType} />,
            employeeId: (
                <CustomSelectWithSearch 
                    itemList={employeeList} 
                    label={'name'} 
                    dataIndex={'id'} 
                    mode={'single'}
                    placeholder={`Select ${label}`}  
                    onChange={_selectPilotTypeHandler}   
                    allowClear={true}    
                />
            ),
            employeeIdtext :<Items title={'Employee Name'} id={employeeName} />,
            cftiValidityType: (
                <CustomSelectBox
                    itemList={typeData} 
                    label={'name'} 
                    dataIndex={'value'} 
                    mode={'single'}
                    placeholder={`Select ${label}`}  
                    allowClear={true}               
                />
            ),
            medicalType: (
                <CustomSelectBox
                    itemList={typeData} 
                    label={'name'} 
                    dataIndex={'value'} 
                    mode={'single'}
                    placeholder={`Select ${label}`}  
                    allowClear={true}               
                />
            ),
            elpType: (
                <CustomSelectBox
                    itemList={typeData} 
                    label={'name'} 
                    dataIndex={'value'} 
                    mode={'single'}
                    placeholder={`Select ${label}`}  
                    allowClear={true}               
                />
            ),
            irType: (
                <CustomSelectBox
                    itemList={typeData} 
                    label={'name'} 
                    dataIndex={'value'} 
                    mode={'single'}
                    placeholder={`Select ${label}`}
                    allowClear={true}                 
                />
            ),
            ppcValidityType: (
                <CustomSelectBox
                    itemList={typeData} 
                    label={'name'} 
                    dataIndex={'value'} 
                    mode={'single'}
                    placeholder={`Select ${label}`}
                    allowClear={true}                 
                />
            ),
            dcpValidityType: (
                <CustomSelectBox
                    itemList={dcpValidityData} 
                    label={'name'} 
                    dataIndex={'value'} 
                    mode={'single'}
                    placeholder={`Select ${label}`} 
                    allowClear={true}                
                />
            ),
            dcpCValidityType: (
                <CustomSelectBox
                    itemList={typeData} 
                    label={'name'} 
                    dataIndex={'value'} 
                    mode={'single'}
                    placeholder={`Select ${label}`} 
                    allowClear={true}                
                />
            ),
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
                <>
                    <div className={'gap-5 sm:p-5'}>
                        {
                            addEditInfoFields?.length > 0 &&
                            addEditInfoFields?.map((field, index) => {
                                return (
                                    field?.id &&
                                    <Badge.Ribbon text={field?.field_name} placement='start'>
                                        <div key={index} className={'grid sm:grid-cols-2 lg:grid-cols-3 p-4 pt-10 border-solid border-2 border-gray-200 rounded-lg shadow-inner gap-5 mb-6'}>
                                            {field?.field.map(item => {
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
                            </Button>
                        }
                    </Form.Item>
                </>
            </Form>
        </div>
    )
}

export default LicenceForm

