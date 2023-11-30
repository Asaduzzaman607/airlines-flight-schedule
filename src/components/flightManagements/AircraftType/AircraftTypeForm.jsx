import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import comapreWithLodash from "lodash"

// import components
import { getErrorMsg, showAlert } from '../../../services/actions/commonActions'
import { Button, Form, Input, InputNumber } from 'antd'

// import action
import { addAircraftType, editAircraftType } from '../../../services/actions/FlightManagementActions/aircraftTypeAction'

// import aircraft type config
import { AIRCRAFT_TYPE } from '../../../config'

function AddEditForm() {
    const [rowData, setRowdata] = useState({})

    const { success, isLoadingAddUser } = useSelector(state => state.aircrafttype)
    const { routePermissions } = useSelector(state => state.auth)

    // destructure parent path name 
    const { parent } = routePermissions

    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [form] = Form.useForm()

    // Save or Submit Handler
    const _onFinish = (values) => {
        // dispatch to add and edit action
        if(id) {
            values.id = Number(id);
            if(comapreWithLodash.isEqual(values, {id: rowData.id, name: rowData.name})) {
                // show success message
                showAlert('success', 'Successfully Updated.')
                return navigate(parent);
            }

            dispatch(editAircraftType(values))
        } else {
            dispatch(addAircraftType(values))
        } 
    }

    //reset form data
    const _onReset = () => {
        form.resetFields()
    }

    const inputField = (type) => {
        const _components = {
            text: <Input type={'text'} placeholder="Enter here!" />,
            textarea: <Input.TextArea type={'text'} placeholder="Enter details here!" />,
            password: <Input.Password type={'password'} placeholder="Enter password here!" />,
            number: <InputNumber type={'number'} placeholder="Enter number here!" />,
            email: <Input type={'email'} placeholder="Enter your email here!" />,
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
        const _fetchData = async () => {
            try {
                const { data } = await axios.get(AIRCRAFT_TYPE.GET_AIRCRAFT_TYPE_LIST + id)
                setRowdata(data)
                form.setFieldsValue(data)
            } catch (err) {
                console.error(err)
                const errMsg = getErrorMsg(err) 
                
                // show error msg
                showAlert('error', errMsg)
            }
        }

        // get single row data for edit
        if(id) {
            _fetchData()
        }
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
                        aircraftTypeFields?.map(field => (
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
                <Form.Item style={{ marginLeft: '17px' }}>
                    <Button 
                        htmlType={ 'submit' } 
                        type={ 'primary' } 
                        loading={ isLoadingAddUser } 
                        style={{ margin: '5px' }}
                    >
                        { id ? 'Update' : 'Submit' }
                    </Button>
                    {
                        !id && <Button htmlType={ 'reset' } onClick={() => _onReset}>{ 'Reset' }</Button>
                    }
                </Form.Item>
            </Form>
        </div>
    )
}

// export add edit form
export default AddEditForm

// define aircraft type field
const aircraftTypeFields = [
    {
        id: 1,
        name: 'name',
        label: 'Aircraft Type',
        type: 'text',
        rules: [
            {
                type: 'text',
                message: 'The input is not valid',
            },
            {
                required: true,
                message: 'Please input aircraft type!',
            }
        ]
    },
]