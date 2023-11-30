import { useSelector } from 'react-redux'

// import components
import { SearchBlock, TableAction, TableBlock } from '../../commonComponents'

// import icons
import { FaCriticalRole } from 'react-icons/fa'

// import actions
import { deleteUserType, getUserTypeSearchList } from '../../../services/actions/UserManagementActions/userTypeAction'
import { IconHandler } from '../../commonComponents/CommonItems'

const TableView = () => {
    // get aircraft state values from redux
    const { isLoading, userTypeList, pagination } = useSelector(state => state.userType)

    // column list for search
    const searchableColumnLists = [
        {
            id: 0,
            label: 'User Type Name',
            value: 'name'
        },
    ]

    const columns = [
        {
            title: 'User Type Name',
            dataIndex: 'name',
            key: 'name',
            render: (item) => <IconHandler item={item} ICON={FaCriticalRole}/>
        },
        {
            title: 'Actions',
            key: 'action',
            render: (record) => <TableAction rowInfo={ record } deleteAction={ deleteUserType } pagination={ pagination } />
        },
    ]

    return (
        <div className={'bg-white px-4 py-3 rounded-md'}>
            <SearchBlock action={ getUserTypeSearchList } searchableColumnLists={ searchableColumnLists }/>
            <TableBlock 
                action={getUserTypeSearchList}
                columns={columns}
                dataList={userTypeList}
                pagination={pagination} 
                isLoading={isLoading} 
            />
        </div>
    )
}

export default TableView