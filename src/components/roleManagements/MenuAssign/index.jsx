import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

// import components
import { Badge, Button, Form, Select, Tree } from 'antd'

// import action
import { getRoleSearchList } from '../../../services/actions/RoleManagementActions/roleAction'
import { tranformIntoMenuList, getMenuList, addMenu } from '../../../services/actions/menuAction'
import { getErrorMsg, showAlert } from '../../../services/actions/commonActions'

// IMPORT API CONFIG
import { MENU } from '../../../config'

const  MenuAssign = () => {
    // for user menu 
    const [disabelCheck, setDisabelCheck] = useState(true)
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [checkedKeys, setCheckedKeys] = useState([]);
    const [defaultCheckedKeys, setDefaultCheckedKeys] = useState([]);
    const [selectedParentKeys, setSelectedParentKeys] = useState([]);
    const [autoExpandParent, setAutoExpandParent] = useState(true);

    // for approval menu
    const [disabelCheckApprovalMenu, setDisabelCheckApprovalMenu] = useState(true)
    const [expandedKeysApprovalMenu, setExpandedKeysApprovalMenu] = useState([]);
    const [checkedKeysApprovalMenu, setCheckedKeysApprovalMenu] = useState([]);
    const [selectedParentKeysApprovalMenu, setSelectedParentKeysApprovalMenu] = useState([]);
    const [autoExpandParentApprovalMenu, setAutoExpandParentApprovalMenu] = useState(true);
    const [approvalMenuChangeStatus, setApprovalMenuChangeStatus] = useState(false);

    const [defaultUserModules, setDefaultUserModule] = useState([]);
    const [defaultApprovalModules, setDefaultApprovalModule] = useState([]);

    const dispatch = useDispatch()
    const [form] = Form.useForm()
    
    const { roleList, isLoadingAddUser } = useSelector(state => state.role)
    const { allmenuList } = useSelector(state => state.auth)

    // get input field value from Form
    const roleType = Form.useWatch('roles', form)

    // for user menu
    const onExpand = (expandedKeysValue) => {
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        setExpandedKeys(expandedKeysValue);
        setAutoExpandParent(false);
    };
    const onCheck = (checkedKeysValue, { halfCheckedKeys }) => {
        setCheckedKeys(checkedKeysValue);
        setSelectedParentKeys(halfCheckedKeys)
    }; 

    // for approval menu
    const onExpandApprovalMenu = (expandedKeysValue) => {
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        setExpandedKeysApprovalMenu(expandedKeysValue);
        setAutoExpandParentApprovalMenu(false);
    };
    const onCheckApprovalMenu = (checkedKeysValue, { halfCheckedKeys }) => {
        setCheckedKeysApprovalMenu(checkedKeysValue);
        setSelectedParentKeysApprovalMenu(halfCheckedKeys)
        setApprovalMenuChangeStatus(true)
    }; 
  
    // Submit Handler
    const _onFinish = values => {
        // generate response for user menu
        let userModules = [], userMenus = []
        const _menuList = [...checkedKeys, ...selectedParentKeys]
        _menuList?.map(item => {
            if(item.includes('module')) {
                userModules.push(Number(item?.split('/')[1]))
            } else if(item.includes('menu')) {
                userMenus.push(Number(item?.split('/')[1]))
            }
        })

        // generate response for approval menu
        const _approvalMenuList = [...selectedParentKeysApprovalMenu, ...checkedKeysApprovalMenu];
        // sort the list by parent name
        _approvalMenuList.sort((a, b) => {
            const parentA = a.split('/')[0];
            const parentB = b.split('/')[0];
            
            if (parentA > parentB) {
                return -1;
            } else if (parentA < parentB) {
                return 1;
            } else {
                return 0;
            }
        });

        // initialize an empty object to store approval menus
        const approvalMenus = {};

        // loop through the checked keys and extract the necessary information
        _approvalMenuList.forEach(key => {
            const [parent, menuId, nestedMenuId] = key.split('/');
            
            if (parent === 'parent') {
                // create a new approval menu object if one doesn't exist
                if (!approvalMenus[menuId]) {
                    approvalMenus[menuId] = {
                        approvalMenuId: parseInt(menuId),
                        menuIds: []
                    };
                }
            } else {
                // add the menuId to the appropriate approval menu object
                const approvalMenu = approvalMenus[parent];
                if (approvalMenu) {
                    approvalMenu.menuIds.push(parseInt(nestedMenuId));
                }
            }
        });

        // convert the object of approval menus to an array
        const approvalSettings = Object.values(approvalMenus);
        const result = {
            roles: values.roles,
            userModules: userModules?.length > 0 ? userModules : defaultUserModules,
            userMenus,
            approvalSettings: approvalMenuChangeStatus ? approvalSettings : defaultApprovalModules
        }
        dispatch(addMenu(result))
    }

    // formate the menuList
    const userMenuItems = tranformIntoMenuList(allmenuList?.userMenus, disabelCheck)
    const approvalMenuItems = tranformIntoMenuList(allmenuList?.approvalMenus, disabelCheckApprovalMenu)

    // reset form data
    const _onReset = () => {
        form.resetFields()
    }

    // set item
    useEffect(()=> {
        setApprovalMenuChangeStatus(false)
        const _fetchData = async () => {
            try {
                const { data } = await axios.get(MENU.GET_MODULE_BY_ID + Number(roleType))
                // for user menu
                setAutoExpandParent(false);
                setExpandedKeys(data?.module_menu_ids ?? [])
                setCheckedKeys(data?.module_menu_ids ?? [])
                setDefaultCheckedKeys(data?.module_menu_ids ?? [])

                // for approval menu
                setAutoExpandParentApprovalMenu(false);
                setExpandedKeysApprovalMenu(data?.approval_menu_ids ?? [])
                setCheckedKeysApprovalMenu(data?.approval_menu_ids ?? [])

                // get dafault module_ids
                setDefaultUserModule(data?.user_module_ids ?? [])
                setDefaultApprovalModule(data?.approval_menu_object ?? [])
                
            } catch (error) {
                console.error(error);

                const errMsg = getErrorMsg(error)

                // show error msg
                showAlert('error', errMsg)
            }
        }
        if(roleType) {
            _fetchData()
            setDisabelCheck(false)
            setDisabelCheckApprovalMenu(false)
        } else {
            setDisabelCheck(true)
            setDisabelCheckApprovalMenu(true)
        }
    },[roleType])

    useEffect(()=> {
        dispatch(getRoleSearchList({ page: 0, pageSize: 500 }))
        dispatch(getMenuList())
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
                    <Form.Item
                        name='roles'
                        label='User Role'
                        rules={[
                            {
                                type: 'select',
                                message: 'The input is not valid',
                            },
                            {
                                required: true,
                                message: 'User Role is Required.',
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            allowClear
                            style={{
                                width: '100%',
                            }}
                            placeholder="Select Role"
                            optionFilterProp="children"
                            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                            filterSort={(optionA, optionB) =>
                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                            }
                            options={roleList?.map(item => ({label: item?.name, value: item?.id}))}
                        /> 
                    </Form.Item>
                </div>
                <div className={'grid sm:grid-cols-2 lg:grid-cols-2 gap-5 sm:p-5 sm:pt-0'}>
                    <Badge.Ribbon text={'Select User Menu'} placement='start'>
                        <div className={'max-h-[60vh] overflow-y-auto'}>
                            <Form.Item
                                name='menu'
                                label={null}
                                style={{border: '2px solid #dcdedc', borderRadius: '5px', padding: '5px', paddingTop: '40px'}}
                                rules={[
                                    {
                                        type: 'checkbox',
                                        message: 'The input is not valid',
                                    },
                                    {
                                        required: checkedKeys?.length > 0 ? false : true,
                                        message: 'Please select user menu.',
                                    },
                                ]}
                            >
                            <Tree
                                checkable
                                onExpand={onExpand}
                                expandedKeys={expandedKeys}
                                autoExpandParent={autoExpandParent}
                                onCheck={onCheck}
                                checkedKeys={checkedKeys}
                                treeData={userMenuItems}
                                selectable={false}
                            /> 
                            </Form.Item>
                        </div>
                    </Badge.Ribbon>
                    <Badge.Ribbon text={'Select Approval Menu'} placement='start'>
                        <div className={'max-h-[450px] overflow-y-auto'}>
                            <Form.Item
                                name='menu'
                                label={null}
                                style={{border: '2px solid #dcdedc', borderRadius: '5px', padding: '5px', paddingTop: '40px'}}
                                rules={[
                                    {
                                        type: 'checkbox',
                                        message: 'The input is not valid',
                                    },
                                    {
                                        required: false,
                                        message: 'Please select approval menu.',
                                    },
                                ]}
                            >
                            <Tree
                                checkable
                                onExpand={onExpandApprovalMenu}
                                expandedKeys={expandedKeysApprovalMenu}
                                autoExpandParent={autoExpandParentApprovalMenu}
                                onCheck={onCheckApprovalMenu}
                                checkedKeys={checkedKeysApprovalMenu}
                                treeData={approvalMenuItems}
                                selectable={false}
                            /> 
                            </Form.Item>
                        </div>
                    </Badge.Ribbon>
                </div>

                <Form.Item style={{marginLeft: '17px'}}>
                    <Button 
                        htmlType={'submit'} 
                        type={'primary'} 
                        style={{ margin: '5px' }} 
                        loading={isLoadingAddUser}
                        disabled={JSON.stringify(defaultCheckedKeys) === JSON.stringify(checkedKeys)}
                    >
                        {'Submit'}
                    </Button>
                    <Button htmlType={'reset'} onClick={() => _onReset}>{'Reset'}</Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default MenuAssign 
