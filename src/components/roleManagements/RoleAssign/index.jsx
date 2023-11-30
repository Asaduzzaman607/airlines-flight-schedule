import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

// import components
import { TagRender } from '../../commonComponents'
import { Button, Form, Select } from 'antd'

//import custom css for role assign
import './custom_checkbox_design.css'

// import action
import { getRoleList, assignRole } from '../../../services/actions/RoleManagementActions/roleAction'
import { getAircraftTypeList } from '../../../services/actions/FlightManagementActions/aircraftTypeAction'
import { getUserTypeList } from '../../../services/actions/UserManagementActions/userTypeAction'

// IMPORT API CONFIG
import { ROLE_ASIGN } from '../../../config'
import { showAlert } from '../../../services/actions/commonActions'

const  RoleAssign = () => {
    // define state checkedlist, checkall, indeterminate for role list
    const [children,setChildren] = useState([])
    const [newAircraftTypeList,setNewAircraftTypeList] = useState([])

    // get data from store
    const { roleList, isLoadingAddUser } = useSelector(state => state.role)
    const { aircraftTypeList } = useSelector(state => state.aircrafttype)
    const { userTypeList } = useSelector(state => state.userType)

    const dispatch = useDispatch()
    const [form] = Form.useForm()

    // get input field value from Form
    const employeeType = Form.useWatch('employeeType', form)
    const selectedUser = Form.useWatch('selected_user', form)
    
    // Submit action
    const _onFinish = async (values) => {
        let obj = {
            userIds: values.selected_user,
            roleIds: values.roleIds,
            aircraftTypeIds: values.aircraftTypes
        }

        // dispatch to save action
        const result = await dispatch(assignRole(obj))

        // Check the result returned by the assignRole action
        if (result?.success) {
            // If assignRole succeeds, Form will be reset.
            form.resetFields()
        }
    }
  
    // reset form data
    const _onReset = () => {
        form.resetFields()
    }

    // It trigger when change user type
    useEffect(()=> {
        userTypeList?.length === 0 && dispatch(getUserTypeList({page: 0, pageSize: 200}))
        employeeType && dispatch(getRoleList({page: 0, pageSize: 200}))

        const _fetchData = async () => {
            try {
                const { data } = await axios.get(ROLE_ASIGN.GET_USER_LIST + `?userType=${employeeType}`)
                let userList = data?.map(item => ({label: item.username, value: item.id}))
                setChildren(userList)
            } catch (err) {
                console.error(err)
                showAlert('error', 'Something Went Wrong.')
            }
        }

        if(employeeType){
            form.setFieldsValue({
                subTypeName: null,
                selected_user: []
            })
            _fetchData();
        } else if(!employeeType){
            // reset designation name and selected user
            form.setFieldsValue({
                subTypeName: null,
                selected_user: []
            })
        } 

        aircraftTypeList?.length <= 0 && dispatch(getAircraftTypeList({page: 0, pageSize: 200}))

        let newAircraftList = aircraftTypeList?.map(item => ({label: item.name, value: item.id}))
        setNewAircraftTypeList(newAircraftList)
    },[employeeType])

    // get default checked role
    useEffect(()=> {
        const _fetchData = async () => {
            try {
                const { data } = await axios.post(ROLE_ASIGN.GET_ASSIGNED_ROLE,{userIds: selectedUser})
                let roles = [], aircraftType = []
                data?.model?.map(item => item?.roles.map(value => roles.push(value.id)))
                data?.model?.map(item => item?.aircraftTypes.map(value => aircraftType.push(value.id)))
                
                form.setFieldsValue({
                    aircraftTypes: aircraftType,
                    roleIds: roles
                })
            } catch (err) {
                console.error(err)
                showAlert('error', 'Something Went Wrong.')
            }
        }

        if(selectedUser?.length) _fetchData();
    },[selectedUser])

  
    return (
        <div className='bg-white py-3 rounded-md flex justify-center'>
            <Form
                validateTrigger={'onChange'}
                form={form}
                onFinish={_onFinish}
                scrollToFirstError
                autoComplete={'off'}
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                style={{
                    minWidth: 600,
                    maxWidth: 800
                }}
            >
                <Form.Item
                    name='employeeType'
                    label='User Type'
                    rules={
                        [
                            {
                                type: 'select',
                                message: 'The input is not valid',
                            },
                            {
                                required: true,
                                message: 'Please select user type.',
                            },
                        ]
                    }
                >
                    <Select
                        showSearch
                        allowClear
                        style={{
                            width: '100%',
                        }}
                        placeholder="Search to select user type"
                        optionFilterProp="children"
                        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        options={userTypeList?.map(item => ({label: item?.name, value: item?.id}))}
                    />
                </Form.Item>
                
                { employeeType && (
                    <div >
                        <Form.Item
                            name='selected_user'
                            label='User'
                            rules={[
                                {
                                    type: 'select',
                                    message: 'The input is not valid',
                                },
                                {
                                    required: true,
                                    message: 'Please select user.',
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                mode="multiple"
                                tagRender={TagRender}
                                style={{
                                    width: '100%',
                                }}
                                placeholder="Search to select user"
                                optionFilterProp="children"
                                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                filterSort={(optionA, optionB) =>
                                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                }
                                options={children}
                                showArrow
                            />
                        </Form.Item>
                        { selectedUser?.length > 0 && 
                            <Form.Item
                                name='roleIds'
                                label='Role'
                                rules={
                                    [
                                        {
                                            type: 'select',
                                            message: 'The input is not valid',
                                        },
                                        {
                                            required: true,
                                            message: 'Please select role.',
                                        },
                                    ]
                                }
                                >
                                <Select
                                    showSearch
                                    allowClear
                                    showArrow
                                    mode="multiple"
                                    tagRender={TagRender}
                                    style={{
                                        width: '100%',
                                    }}
                                    placeholder="Search to select role"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                    }
                                    options={roleList?.map(item => ({label: item?.name, value: item?.id}))}
                                />
                            </Form.Item>
                        }

                    </div>
                )}

                {(selectedUser?.length > 0) && (
                    <Form.Item
                        name='aircraftTypes'
                        label='Aircraft Type'
                        rules={[
                            {
                                type: 'select',
                                message: 'The input is not valid',
                            },
                            {
                                required: true,
                                message: 'Please select aircraft type.',
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            mode="multiple"
                            tagRender={TagRender}
                            style={{
                                width: '100%',
                            }}
                            placeholder="Search to select aircraft type"
                            optionFilterProp="children"
                            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                            filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                            }
                            options={newAircraftTypeList}
                            showArrow
                        />
                    </Form.Item>
                )}
                
                <Form.Item 
                    style={{marginLeft: '17px'}}
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button 
                        htmlType={'submit'} 
                        type={'primary'} 
                        loading={isLoadingAddUser} 
                        style={{ margin: '5px' }}
                    >
                        {'Submit'}
                    </Button>
                    <Button htmlType={'reset'} onClick={() => _onReset}>{'Reset'}</Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default RoleAssign
