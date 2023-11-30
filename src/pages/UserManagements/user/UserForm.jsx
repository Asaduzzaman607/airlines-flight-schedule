import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import comapreWithLodash from 'lodash'

// import components
import { Button, Form, Input, InputNumber, Select } from 'antd'

// import actions
import { addUser, EditUser } from '../../../services/actions/UserManagementActions/userAction'
import { getUserTypeList } from '../../../services/actions/UserManagementActions/userTypeAction'
import { getErrorMsg, showAlert } from '../../../services/actions/commonActions'

// import user config
import { USER } from '../../../config'

const UserForm = () => {
    const [rowdata,setRowdata] = useState({})

    const { routePermissions } = useSelector(state => state.auth)
    const { isLoadingAddUser } = useSelector(state => state.user)
    const { userTypeList } = useSelector(state => state.userType)

    // destructure page path name and parent path name 
    const { parent } = routePermissions

    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [form] = Form.useForm()


    const _onFinish = async (values) => {
        if(id) {
            values.id = Number(id)
            values.email = values.email?.trim()
            const { userTypeName, isPassReset, isPassResetRequested, ...finalRowData } = rowdata
            
            // if user doesn't change form value we re-direct to parent path.
            if(comapreWithLodash.isEqual(values, finalRowData)) {
                // show success message
                showAlert('success', 'Successfully Updated.')
                return navigate(parent);
            }

            // dispatch edit action
            const result = await dispatch(EditUser(values))
            if(result?.success) {
                navigate(parent)
            }
        } else {      
            // Dispatch the addUser action and wait for it to complete
            const result = await dispatch(addUser(values));

            // Check the result returned by the addUser action
            if (result?.success) {
                // If addUser succeeds, Form will be reset.
                form.resetFields()
            }
          
        } 
    };

    //reset form data
    const _onReset = () => {
        form.resetFields()
    };

    // Define Input Field
    const inputField = (type) => {
        const _components = {
            text: <Input type={'text'} placeholder="Enter here!" />,
            textarea: <Input.TextArea type={'text'} placeholder="Enter details here!" />,
            password: <Input.Password type={'password'} placeholder="Enter password here!" />,
            number: <InputNumber min={0} style={{width: '100%'}} type={'number'} placeholder="Enter number here!" />,
            email: <Input type={'email'} placeholder="Enter your email here!" />,
            userTypeId: (
                <Select
                    showSearch
                    allowClear
                    style={{
                    width: '100%',
                    }}
                    placeholder="Search to Select"
                    optionFilterProp="children"
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    options={userTypeList?.map(item => ({label: item?.name, value: item?.id}))}
                />
            ),
        }

        return _components[type] || null;
    }

    useEffect(() => {
        dispatch(getUserTypeList({page: 0, pageSize: 200}))

        const _fetchData = async () => {
            try {
                const response = await axios.get(USER.GET_USER_LIST + id);
                setRowdata(response.data)
                form.setFieldsValue(response.data)
            } catch (err) {
                console.error(err)
                const errMsg = getErrorMsg(err) 
                
                // show error msg
                showAlert('error', errMsg)
            }
        }

        // fethch data for edit user info
        if(id) {
            _fetchData()
        }
    }, [])

    // define input field model
    const addEditInfoFeilds = [
        {
          id: 1,
          name: 'username',
          label: 'User Name',
          type: 'text',
          rules: [
            {
              type: 'text',
              message: 'The input is not valid',
            },
            {
                required: true,
                validator: async (_, names) => {
                    if (!names || names?.includes(" ")) {
                        return Promise.reject(new Error(`${!names ? 'User name is required.' : names?.includes(" ") && 'No spaces allowed.'}`));
                    }
                },
            },
          ],
        },
        {
          id: 9,
          name: 'userTypeId',
          label: 'User Type',
          type: 'userTypeId',
          rules: [
            {
              type: 'select',
              message: 'The input is not valid',
            },
            {
              required: true,
              message: 'Please select user type!',
            }
            
          ],
        },
        {
          id: 2,
          name: 'mobile',
          label: 'Mobile Number',
          type: 'text',
          rules: [
            {
              type: 'text',
              message: 'The input is not valid',
            },
            {
              required: false,
              message: 'Please enter mobile no!',
            },
            {
              validator: (_, value) =>
                !value.includes(" ")
                  ? Promise.resolve()
                  : Promise.reject(new Error("No spaces allowed"))
            }
          ],
        },
        {
          id: 4,
          name: 'email',
          label: 'Email',
          type: 'email',
          rules: [
            {
              type: 'email',
              message: 'The input is not valid',
            },
            {
              required: true,
              message: 'Please enter email!',
            },
            {
              validator: (_, value) =>
                !value.includes(" ")
                  ? Promise.resolve()
                  : Promise.reject(new Error("No spaces allowed"))
            }
            
          ],
         
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
                autoComplete={ 'off' }
            >
                <div className={'grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:p-5'}>
                    {
                        addEditInfoFeilds?.map(feild => (
                            <Form.Item
                                key={feild.id}
                                name={feild.name}
                                label={feild.label}
                                rules={feild.rules}
                                dependencies={feild.dependencies ?? []}
                            >
                                {inputField(feild?.type)}
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

export default UserForm


