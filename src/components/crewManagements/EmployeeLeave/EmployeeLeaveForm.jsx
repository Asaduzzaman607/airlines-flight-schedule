import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import axios from 'axios';
import comapreWithLodash from 'lodash';

// import components
import { Button, Form, Radio} from 'antd';
import { CustomSelectBox, CustomSelectWithSearch, CustomDatePicker, CustomTextArea } from '../../commonComponents'

// import action
import { getErrorMsg, showAlert } from '../../../services/actions/commonActions';
import {
    addEmployeeLeave,
    editEmployeeLeaveList,
    getEmployeeListForLeave
} from '../../../services/actions/CrewManagementActions/employeeLeaveAction';

// employee leave api config
import { EMPLOYEE, DATE_FORMAT, LEAVE_TYPE } from '../../../config';

// Add edit form function
function EmployeeLeaveForm() {
    const [rowdata, setRowdata] = useState({});
    const [leaveTypeList, setLeaveTypeList] = useState([]);
    const [emptyValueOnField, setEmptyValueOnField] = useState(false);

    const { routePermissions } = useSelector((state) => state.auth);
    const { success, isLoading, employeeList } = useSelector((state) => state.employeeLeave);
 
    // destructure parent path name
    const { parent } = routePermissions;

    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    // get input field value from Form
    const employeeId = Form.useWatch('employeeId', form)

    const _onFinish = (values) => {
        const transformedValues = {
            ...values,
            fromDate: values?.fromDate && values?.fromDate?.format(DATE_FORMAT),
            toDate: values?.toDate && values?.toDate?.format(DATE_FORMAT),
            isEmergency:values?.isEmergency
        };
        // dispatch to add and edit action
        if (id) {
            transformedValues.id = Number(id);
            const { employeeCode, employeeName, ...finalData } = rowdata
            if (comapreWithLodash.isEqual(transformedValues, finalData)) {
                // show success message
                showAlert('success', 'Successfully Updated.')
                return navigate(parent);
            }

            dispatch(editEmployeeLeaveList(transformedValues));
        } else {
            dispatch(addEmployeeLeave(transformedValues));
        }
    };

    //reset form data
    const _onReset = () => {
        form.resetFields();
    };

 
    const inputField = ({ type, label }) => {
        const _components = {
            text: <CustomTextArea type={'textarea'} placeholder={`Enter ${label}`} maxLength={200} />,
            date: <CustomDatePicker showTime={false} placeholder={`Select ${label}`} />,
            leaveType : (
                <CustomSelectBox
                    itemList={leaveTypeList}
                    label={'name'}
                    dataIndex={'id'}
                    placeholder={`Select ${label}`}
                />
                ),
            employeeId : (
                <CustomSelectWithSearch 
                    itemList={employeeList} 
                    label={'name'} 
                    dataIndex={'empId'} 
                    mode={'single'}
                    placeholder={`Select ${label}`}  
                    allowClear={false}    
                />
            ),
            isEmergency: (
                <Radio.Group defaultValue={false} buttonStyle="solid" >
                    <Radio.Button value={true}>YES</Radio.Button>
                    <Radio.Button value={false}>NO</Radio.Button>
                </Radio.Group>
            ),
        }

        return _components[type] || null;
    };

    useEffect(() => {
        // dispatch this action for select box.
        dispatch(getEmployeeListForLeave({page: 0, size: 1000}))
        setLeaveTypeList([])

        const _fetchEmployeeLeaveData = async () => {
            try {
                const { data } = await axios.get(EMPLOYEE.GET_EMPLOYEE_LEAVE_LIST + id)
                setRowdata(data);
                let newvalues = {
                    ...data,
                    fromDate: data?.fromDate && dayjs(data?.fromDate),
                    toDate: data?.toDate && dayjs(data?.toDate),
                    isEmergency:data?.isEmergency
                };
                onValueChangeHander({ employeeId: data?.employeeId })
                setEmptyValueOnField(true)
                form.setFieldsValue(newvalues);
            } catch (err) {
                console.error(err)
                const errMsg = getErrorMsg(err) 
                
                // show error msg
                showAlert('error', errMsg)
            }
        }

        if (id) {
            _fetchEmployeeLeaveData();
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            // For edit form , If api response has successfully done then re-direct to parent path
            success && navigate(parent);
        }
    }, [success]);

       // input field structure
       const addEditInfoFeilds = [
        {
            id: 1,
            name: 'employeeId',
            label: 'Employee Name',
            type: 'employeeId',
            rules: [
                {
                    type: 'select',
                    message: 'Employee Name is not valid',
                },
                {
                    required: true,
                    message: 'Select Employee Name.',
                },
            ]
        },
        {
            id: employeeId ? 2 : null,
            name: 'leaveTypeId',
            label: 'Leave Type',
            type: 'leaveType',
            rules: [
                {
                    type: 'select',
                    message: 'Leave Type is not valid',
                },
                {
                    required: true,
                    message: 'Select Leave Type.',
                },
            ]
        },
        {
            id: 3,
            name: 'fromDate',
            label: 'Start Date',
            type: 'date',
            rules: [
                {
                    type: 'date',
                    message: 'Start Date is not valid',
                },
                {
                    required: true,
                    message: 'Select Start Date.',
                },
            ]
        },
        {
            id: 4,
            name: 'toDate',
            label: 'End Date',
            type: 'date',
            rules: [
                {
                    type: 'date',
                    message: 'End Date is not valid',
                },
                {
                    required: true,
                    message: 'Select End Date',
                },
            ]
        },     
        {
            id:  5,
            name:  'note',
            label: 'Note',
            type: 'text',
            rules: [
                {
                    type: 'text',
                    message: 'Note is not valid',
                },
                {
                    required: true,
                    message: 'Select Note',
                },
            ]      
        }, 
        {
            id: 6,
            name: 'isEmergency',
            label: 'Is Emergency?',
            type: 'isEmergency'
        },
      
    ];

    // onChange Handler
    const onValueChangeHander = (changedValues) => {
        const _fetchEmpData = async () => {
            try {
                // get leave type list
                const { data } = await axios.get(LEAVE_TYPE.GET_LEAVE_TYPE + 'v2', { params: { id: changedValues?.employeeId }})
                setLeaveTypeList(data?.length ? data : [])
            } catch (error) {
                console.error(error);
                const errMsg = getErrorMsg(error)
                // show error msg
                showAlert('error', errMsg)
            }

            setEmptyValueOnField(false)
        }

        if(changedValues?.employeeId) {
            !emptyValueOnField && form.setFieldsValue({
                leaveTypeId: undefined,
            });
            _fetchEmpData()
        }
    }

    return (
        <div className={"bg-white py-3 rounded-md"}>
            <Form
                validateTrigger={'onChange'}
                form={form}
                onFinish={_onFinish}
                scrollToFirstError
                layout={'vertical'}
                autoComplete={'off'}
                onValuesChange={onValueChangeHander}
            >
                <div className={"grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:p-5"}>
                    {addEditInfoFeilds?.map((field) => {
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
                        );
                    })}
                </div>
                <Form.Item style={{ marginLeft: '17px' }}>
                    <Button
                        htmlType={'submit'}
                        type={'primary'}
                        loading={isLoading}
                        style={{ margin: '5px' }}
                    >
                        { id ? 'Update' : 'Submit'}
                    </Button>
                    {
                        !id && (
                            <Button htmlType={'reset'} onClick={() => _onReset}>
                                {'Reset'}
                            </Button>
                        )
                    }
                </Form.Item>
            </Form>
        </div>
    );
}

export default EmployeeLeaveForm;
