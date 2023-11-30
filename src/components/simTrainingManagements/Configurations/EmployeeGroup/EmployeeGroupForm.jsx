import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import comapreWithLodash from "lodash"

// import antd componets
import { CustomSelectWithSearch, TagRender } from '../../../commonComponents'
import { Button, Form, Input } from 'antd'

// import action
import { addEmployeeGroup, editEmployeeGroupList } from '../../../../services/actions/SimTrainingManagementActions/employeeGroupAction'
import { getAircraftTypeSearchList } from '../../../../services/actions/FlightManagementActions/aircraftTypeAction'
import { getErrorMsg, showAlert } from '../../../../services/actions/commonActions'

// import api config
import { RECENCY, SIM_TRAINING } from '../../../../config'

function EmployeeGroupForm() {
    const [rowdata,setRowdata] = useState({})
    const [sortedEmployeeList, setSortedEmployeeList] = useState([]);

    const { success, isLoading } = useSelector(state => state.employeeGroup)
    const { aircraftTypeList } = useSelector(state => state.aircrafttype)
    const { routePermissions } = useSelector(state => state.auth)

    // destructure parent path name 
    const { parent } = routePermissions

    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [form] = Form.useForm()

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

            dispatch(editEmployeeGroupList(values))
        } else {
            dispatch(addEmployeeGroup(values))
        } 
    }

    //reset form data
    const _onReset = () => {
        form.resetFields()
    }

    const inputField = ({ type, label }) => {
        const _components = {
            text: <Input type={'text'} placeholder={`Enter ${label}`} />,
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
            employeesIds: (
                <CustomSelectWithSearch 
                    itemList={sortedEmployeeList} 
                    label={'employeeName'} 
                    dataIndex={'id'} 
                    mode={'multiple'}
                    tagRender={TagRender}
                    placeholder={`Select ${label}`}
                />
            ),
        }
        
        return _components[type] || null
    }

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
                const { data } = await axios.get(SIM_TRAINING.GET_EMPLOYEE_GROUP + id)
                onValueChangeHander({ aircraftTypeId: data.aircraftTypeId }, '')
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

    const onValueChangeHander = (changedValues, allValues) => {
        const _fetchData = async () => {
            try {
                const { data } = await axios.get(RECENCY.GET_EMPLOYEE_BY_AIRCRAFTTYPE + changedValues?.aircraftTypeId, { params: { page: 0, size: 1000 } })
                const dataList = data?.model?.length ? data.model : []

                setSortedEmployeeList(dataList ?? [])
            } catch (error) {
                console.error(error);
                const errMsg = getErrorMsg(error)

                // show error msg
                showAlert('error', errMsg)
            }
        }

        if(changedValues?.aircraftTypeId) {
            form.setFieldsValue({ employeesIds: undefined })
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
            <div className={'grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:p-5'}>
                {
                addEditInfoFields?.map(field => (
                    <Form.Item
                        key={field.id}
                        name={field.name}
                        label={field.label}
                        rules={field.rules}
                        dependencies={field.dependencies ?? []}
                    >
                        { inputField(field) }
                    </Form.Item>
                ))
                }
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

export default EmployeeGroupForm

// initial input field and value
const addEditInfoFields = [
    {
        id: 1,
        name: 'name',
        label: 'Group Name',
        type: 'text',
        rules: [
            {
                type: 'text',
                message: 'The input is not valid',
            },
            {
                required: true,
                message: 'Group name is required.',
            },
        ],
    },
    {
        id: 2,
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
                message: 'Aircraft type is required.',
            },
        ],
    },
    {
        id: 3,
        name: 'employeesIds',
        label: 'Employee',
        type: 'employeesIds',
        rules: [
            {
                type: 'select',
                message: 'The input is not valid',
            },
            {
                required: true,
                message: 'Employee is required.',
            },
        ],
    },
]