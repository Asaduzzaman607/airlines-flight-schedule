import { useSelector } from 'react-redux'

// imports components
import { SearchBlock, TableAction, TableBlock } from '../../commonComponents'
import { IconHandler } from '../../commonComponents/CommonItems'

// import icons
import { FaCriticalRole } from 'react-icons/fa'

// import actions
import { deleteRole, getRoleSearchList } from '../../../services/actions/RoleManagementActions/roleAction'

const TableView = () => {
    // get role state values from redux
    const { isLoading, roleList, pagination } = useSelector(state => state.role)

    const columns = [
        {
            title: 'Role Name',
            dataIndex: 'name',
            key: 'name',
            render: (item) => <IconHandler item={item} ICON={FaCriticalRole}/>
        },
        {
            title: 'Role Description',
            dataIndex: 'description',
            key: 'description',
            render: (item) => <span className={' float-left text-left'}> {item} </span>
        },
        {
            title: 'Actions',
            key: 'action',
            render: (record) => <TableAction rowInfo={ record } deleteAction={ deleteRole } pagination={ pagination } />
        },
    ]

    return (
        <div className={'bg-white px-4 py-3 rounded-md'}>
            <SearchBlock action={ getRoleSearchList }/>
            <TableBlock 
                action={getRoleSearchList}
                columns={columns}
                dataList={roleList}
                pagination={pagination} 
                isLoading={isLoading} 
            />
        </div>
    )
}




export default TableView