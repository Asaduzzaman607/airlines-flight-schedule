import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import comapreWithLodash from "lodash"

// import components
import { Button, Form, Input } from 'antd'

// import actions
import { addUserType, editUserType } from '../../../services/actions/UserManagementActions/userTypeAction'
import { showAlert } from '../../../services/actions/commonActions'

// import role config
import { USER_TYPE } from '../../../config'

function AddEditForm() {
    const [rowdata,setRowdata] = useState({})

    const { isLoading } = useSelector(state => state.userType)
    const { routePermissions } = useSelector(state => state.auth)

    // destructure parent path name 
    const { parent } = routePermissions

    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [form] = Form.useForm()

    const _onFinish = async (values) => {
        // dispatch to add and edit action
        if(id) {
            values.id = Number(id)
            if(comapreWithLodash.isEqual(values, rowdata)) {
                // show success message
                showAlert('success', 'Successfully Updated.')
                return navigate(parent);
            } 

            const result = await dispatch(editUserType(values))
            if(result.success) {
                navigate(parent)
            }
        } else {
            // Dispatch the addUserType action and wait for it to complete
            const result = await dispatch(addUserType(values));

            // Check the result returned by the addUserType action
            if (result.success) {
                // If addUserType succeeds, Form will be reset.
                form.resetFields()
            }
        } 
    }

    // reset form data
    const _onReset = () => {
        form.resetFields()
    }

    const inputField = (type) => {
        const _components = {
            text: <Input type={'text'} placeholder="Enter user type name." />,
            textarea: <Input.TextArea type={'text'} placeholder="Enter details here!" />,
        }

        return _components[type] || null;
    }

    useEffect(() => {
        const _fetchData = async () => {
            try {
                const response = await axios.get(USER_TYPE.GET_USER_TYPE + id);
                setRowdata(response.data)
                form.setFieldsValue(response.data)
            } catch (error) {
                showAlert('error','Something Went Wrong.')
            }
        }

        if(id) _fetchData();
    }, [id])

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
                        loading={ isLoading } 
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
        id: 1,
        name: 'name',
        label: 'User Type Name',
        type: 'text',
        rules: [
            {
                type: 'text',
                message: 'The input is not valid.',
            },
            {
                required: true,
                message: 'Please enter user type name.',
            }
        ]
    },
]