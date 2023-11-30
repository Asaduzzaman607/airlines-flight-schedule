import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import comapreWithLodash from "lodash"

// import components
import { CustomSelectBox, TagRender } from '../../commonComponents'
import { Button, Form, Input, InputNumber, Select } from 'antd'

// import actions
import { addRecency, editRecency } from '../../../services/actions/RecencyManagementActions/recencyAction'
import { getAircraftTypeList } from '../../../services/actions/FlightManagementActions/aircraftTypeAction'
import { showAlert } from '../../../services/actions/commonActions'

// import role config
import { RECENCY } from '../../../config'

function AddEditForm() {
    const [rowdata,setRowdata] = useState({})
    const { success, isLoadingAddUser } = useSelector(state => state.recency)
    const { aircraftTypeList } = useSelector(state => state.aircrafttype)
    const { routePermissions } = useSelector(state => state.auth)
  
    // destructure parent path name 
    const { parent } = routePermissions

    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [form] = Form.useForm()
  
    // Save or Submit Handler
    const _onFinish = values => {
        // dispatch to add and edit action
        if(id) {
            values.id = Number(id)
            const { aircraftTypesNames, ...getData } = rowdata
            if(comapreWithLodash.isEqual(values, getData)) {
                // show success message
                showAlert('success', 'Successfully Updated.')
                return navigate(parent);
            }

            dispatch(editRecency(values))
        } else {
            dispatch(addRecency(values))
        } 
    }

    // Reset form data
    const _onReset = () => {
        form.resetFields()
    }

    // construct validty type
    const validityTypeList = [
        {
            id: 0,
            name: 'MONTH',
            value: 'MONTH',
        },
        {
            id: 1,
            name: 'YEAR',
            value: 'YEAR',
        },
        {
            id: 2,
            name: 'DAYS',
            value: 'DAYS',
        },
    ]

    // Handle input field
    const inputField = (item) => {
        const { type, label } = item;
        const _components = {
            text: <Input type={'text'} placeholder={`Enter ${label}`} />,
            select: (
                <Select placeholder={`Select ${label}`}>
                    <Select.Option value={true} >{"YES"}</Select.Option>
                    <Select.Option value={false} >{"NO"}</Select.Option>
                </Select>
            ),
            isDone: (
                <Select placeholder={`Select ${label}`} allowClear>
                    <Select.Option value={true} >{"YES"}</Select.Option>
                    <Select.Option value={false} >{"NO"}</Select.Option>
                </Select>
            ),
            recencyType: (
                <Select placeholder={"Select Recency Type"}>
                    <Select.Option value={'COCKPIT_CREW_RECENCY'} >{"COCKPIT CREW RECENCY"}</Select.Option>
                    <Select.Option value={'CABIN_CREW_RECENCY'} >{"CABIN CREW RECENCY"}</Select.Option>
                    <Select.Option value={'COMMON_RECENCY'} >{"COMMON RECENCY"}</Select.Option>
                </Select>
            ),
            aircraftTypeIds: (
                <Select
                    showSearch
                    mode="multiple"
                    tagRender={TagRender}
                    showArrow
                    style={{
                        width: '100%',
                    }}
                    placeholder={"Select Aircraft Type"}
                    optionFilterProp="children"
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    options={aircraftTypeList.map((item) => ({label: item?.name, value: item?.id}))}
                />
            ),
            number: <InputNumber min={1} style={{minWidth: '100%'}} type={'number'} placeholder={"Enter validity"} />,
            validityType: (
                <CustomSelectBox
                    itemList={validityTypeList} 
                    label={'name'} 
                    dataIndex={'value'}
                    placeholder={`Select validity type}`}   
                    allowClear={true}             
                />
            ),
        }

        return _components[type] || null;
    }

    useEffect(() => {
        if(id) {
            // For edit form , If api response has successfully done then re-direct to parent path 
            success && navigate(parent)
        }
    }, [success])

    useEffect(() => {
        const _fetchData = async () => {
            try {
                const response =  await axios.get(RECENCY.GET_RECENCY_LIST + id)
                setRowdata(response.data)
                form.setFieldsValue(response.data)
            } catch (error) {
                console.error(error)
            }
        }

        if(id) _fetchData();
    }, [ id ])

    useEffect(()=> {
        let pageWithSize = { page: 0,  pageSize: 200 }
        dispatch(getAircraftTypeList(pageWithSize))
    },[])
    
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
            <div className={'grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:p-5'}>
                {
                    addEditInfoFeilds?.map(field => (
                        <Form.Item
                            key={field.id}
                            name={field.name}
                            label={field.label}
                            rules={field.rules}
                            dependencies={field.dependencies ?? []}
                        >
                            {inputField(field)}
                        </Form.Item>
                    ))
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

const addEditInfoFeilds = [
    {
        id: 6,
        name: 'aircraftTypeIds',
        label: 'Aircraft Type',
        type: 'aircraftTypeIds',
        rules: [
            {
            type: 'select',
            message: 'The input is not valid name',
            },
            {
            required: true,
            message: 'Aircraft type is required.',
            },
        ],
    },
    {
        id: 1,
        name: 'name',
        label: 'Recency Name',
        type: 'text',
        rules: [
        {
            type: 'text',
            message: 'The input is not valid name',
        },
        {
            required: true,
            message: 'Recency name is required.',
        },
        ],
    },
    {
        id: 5,
        name: 'recencyType',
        label: 'Recency Type',
        type: 'recencyType',
        rules: [
        {
            type: 'select',
            message: 'The input is not valid',
        },
        {
            required: true,
            message: 'Recency type is required.',
        },
        ],
    },
    {
        id: 2,
        name: 'code',
        label: 'Recency Code',
        type: 'text',
        rules: [
        {
            type: 'text',
            message: 'The input is not valid name',
        },
        {
            required: true,
            message: 'Recency Code is required.',
        },
        ],
    },
    {
        id: 7,
        name: 'validity',
        label: 'Validity',
        type: 'number',
        rules: [
        {
            type: 'number',
            message: 'Validity is not valid',
        },
        {
            required: true,
            message: 'Validity is required.',
        },
        ],
    },
    {
        id: 8,
        name: 'validityType',
        label: 'Validity Type',
        type: 'validityType',
        rules: [
        {
            type: 'select',
            message: 'Validity type is not valid',
        },
        {
            required: true,
            message: 'Validity type is required.',
        },
        ],
    },
    {
        id: 3,
        name: 'isMandatory',
        label: 'Mandatory',
        type: 'isDone',
        rules: [
        {
            type: 'select',
            message: 'Mandatory is not valid',
        },
        {
            required: true,
            message: 'Mandatory is required.',
        },
        ],
    },
]