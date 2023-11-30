import { useSelector } from 'react-redux'

// import components
import { SearchBlock, SingleItemView, TableAction, TableBlock } from '../commonComponents'
import { Tag } from 'antd'

// import icons
import { HiOutlineMail } from 'react-icons/hi'
import { FaCriticalRole } from 'react-icons/fa'
import { ImMobile } from 'react-icons/im'

// import actions
import { deleteUser, getUserSearchList } from '../../services/actions/UserManagementActions/userAction'
import { IconHandler } from '../commonComponents/CommonItems'

const UserTableView = () => {
    // get user state values from redux
    const { isLoading, userList, pagination } = useSelector(state => state.user)
    const { routePermissions } = useSelector(state => state.auth)
    const { actions } = routePermissions

    // column list for search
    const searchableColumnLists = [
        {
            id: 0,
            label: 'User Name',
            value: 'userName'
        },
        {
            id: 1,
            label: 'Email',
            value: 'email'
        },
        {
            id: 2,
            label: 'Mobile',
            value: 'mobile'
        },
    ]

    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            width: 220,
            render: (text) => <SingleItemView item={text}/>
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 260,
            render: (item) => <IconHandler item={item} ICON={HiOutlineMail} />
        },
        {
            title: 'User Type',
            dataIndex: 'userTypeName',
            key: 'userTypeName',
            width: 200,
            render: (item) => <IconHandler item={item} ICON={FaCriticalRole}/>
        },
        {
            title: 'Mobile',
            dataIndex: 'mobile',
            key: 'mobile',
            width: 150,
            render: (item) => <IconHandler item={item} ICON={ImMobile}/>
        },
        {
            title: 'Reset Password Requested',
            dataIndex: 'isPassResetRequested',
            key: 'isPassResetRequested',
            width: 120,
            render: (text) => <Tag color={text ? 'success' : 'warning'}>
                <span> {text ? 'TRUE' : 'FALSE'} </span>
            </Tag> 
        },
        {
            title: 'Reset Password',
            dataIndex: 'isPassReset',
            key: 'isPassReset',
            width: 120,
            render: (text) => <Tag color={text ? 'success' : 'warning'}>
                <span> {text ? 'YES' : 'NO'} </span>
            </Tag> 
        },
        {
            title: 'Actions',
            key: 'action',
            width: 100,
            render: (record) => <TableAction rowInfo={ record } deleteAction={ deleteUser } pagination={ pagination } />
        },
    ]
    const _columns = _getColumns(columns, actions)

    return (
        <div className={'bg-white px-4 py-3 rounded-md'}>
            <SearchBlock action={ getUserSearchList } searchableColumnLists={ searchableColumnLists }/>
            <TableBlock 
                action={getUserSearchList}
                columns={_columns}
                dataList={userList}
                pagination={pagination} 
                isLoading={isLoading} 
            />
        </div>
    )
}

const _getColumns = (cols, actions) => (actions && actions?.length > 0 && cols && cols?.length > 0) ? cols : cols.slice(0, -1)

export default UserTableView