import { useSelector } from 'react-redux'

// import components
import TableBlock from '../../commonComponents/TableBlock'
import { MultipleEmployeeView } from '../../commonComponents'
import { IconHandler } from '../../commonComponents/CommonItems'

// import icons
import { FaCriticalRole } from 'react-icons/fa'

// import actions
import { getRoleBasedUserList } from '../../../services/actions/RoleManagementActions/roleAction'

const TableView = () => {
    // get state values from redux
    const { isLoading, pagination, roleBasedUserList } = useSelector(state => state.role)

    const columns = [
        {
            title: 'Role Name',
            dataIndex: 'name',
            key: 'name',
            render: (item) => <IconHandler item={item} ICON={FaCriticalRole}/>
        },
        {
            title: 'User Name',
            dataIndex: 'users',
            key: 'users',
            render: (text) => <MultipleEmployeeView items={text} dataIndex='username'/>
        },
    ]
    
    return (
        <div className={'bg-white px-4 py-3 rounded-md'}>
            <TableBlock 
                action={getRoleBasedUserList}
                columns={columns}
                dataList={roleBasedUserList}
                pagination={pagination} 
                isLoading={isLoading} 
            />
        </div>
    )
}

export default TableView