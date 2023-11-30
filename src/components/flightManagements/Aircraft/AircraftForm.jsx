import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import comapreWithLodash from "lodash"

// import components
import { Button, Form, Input, InputNumber, Select } from 'antd'

// import actions
import { addAircraft, editAircraft } from '../../../services/actions/FlightManagementActions/aircraftAction'
import { getAircraftTypeList,  } from '../../../services/actions/FlightManagementActions/aircraftTypeAction'
import { getErrorMsg, showAlert } from '../../../services/actions/commonActions'

// import role config
import { AIRCRAFT } from '../../../config'

function AddEditForm() {
    const [rowdata,setRowdata] = useState({})
    
    const { 
        aircraft: { success, isLoadingAddUser },
        aircrafttype: { aircraftTypeList },
        auth: { routePermissions } 
    } = useSelector(state => state)

    // destructure parent path name 
    const { parent } = routePermissions

    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [form] = Form.useForm()
    

    const _onFinish = values => {
        // dispatch to add and edit action
        if(id) {
            values.id = Number(id)
            const { aircraftTypeName, ...getData } = rowdata
            if(comapreWithLodash.isEqual(values, getData)) {
                // show success message
                showAlert('success', 'Successfully Updated !!')
                return navigate(parent);
            } 

            dispatch(editAircraft(values))
        } else {
            dispatch(addAircraft(values))
        } 
    }

    //reset form data
    const _onReset = () => {
        form.resetFields()
    }

    const inputField = (type) => {
        const _components = {
            text: <Input type={'text'} placeholder="Enter here" />,
            textarea: <Input.TextArea type={'text'} placeholder="Enter details here!" />,
            number: <InputNumber type={'number'} placeholder="Enter number here!" />,
            select: (
                <Select placeholder="Select aircraft type">
                    {
                        aircraftTypeList?.map(item => <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>)
                    }
                </Select>
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

    useEffect(()=> {
        // get aircraft type list for select box
        dispatch(getAircraftTypeList({page: 0, pageSize: 200}))
    }, [])

    useEffect(() => {
        const _fetchData = async () => {
            try {
                const response = await axios.get(AIRCRAFT.GET_AIRCRAFT_LIST + '/' + id);
                setRowdata(response.data)
                form.setFieldsValue(response.data)
            } catch (err) {
                console.error(err)
                const errMsg = getErrorMsg(err) 
                
                // show error msg
                showAlert('error', errMsg)
            }
        }

        if(id) _fetchData();
    }, [id])

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
                <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:p-5'>
                    {
                        addEditInfoFields?.map(field => (
                            <Form.Item
                                key={field.id}
                                name={field.name}
                                label={field.label}
                                rules={field.rules}
                                dependencies={field.dependencies ?? []}
                            >
                                {inputField(field?.type)}
                            </Form.Item>
                        ))
                    }
                </div>
                <Form.Item style={{marginLeft: '17px'}}>
                    <Button 
                        htmlType={'submit'}    
                        type={'primary'} 
                        loading={ isLoadingAddUser } 
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

const addEditInfoFields = [
    {
        id: 2,
        name: 'aircraftTypeId',
        label: 'Aircraft Type',
        type: 'select',
        rules: [
            {
                type: 'select',
                message: 'The input is not valid',
            },
            {
                required: true,
                message: 'Aircraft type is required.',
            }
        ]
    },
    {
        id: 3,
        name: 'registrationNo',
        label: 'Registration No',
        type: 'text',
        rules: [
            {
                type: 'text',
                message: 'The input is not valid',
            },
            {
                required: true,
                message: 'Registration no is required.',
            },
        ]
    },
    {
        id: 4,
        name: 'manufactureSerialNo',
        label: 'Manufacture Serial No',
        type: 'text',
        rules: [
            {
                type: 'text',
                message: 'The input is not valid',
            },
            {
                required: true,
                message: 'Manufacture serial no is required.',
            },
        ]
    }
]