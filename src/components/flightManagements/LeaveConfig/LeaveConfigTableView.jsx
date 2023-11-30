import { useSelector } from 'react-redux'
// import components
import { SearchBlock, TableBlock, TableAction } from '../../commonComponents'

// import actions 
import { deleteLeaveConfig, getLeaveConfigSearchList } from '../../../services/actions/FlightManagementActions/leaveConfigAction'

const LeaveConfigTableView = () => {
    // get Config Table state values from redux
    const { isLoading, leaveConfigList, pagination } = useSelector(state => state.leaveConfig)

    const columns = [
        {
            title: 'Employee Type',
            dataIndex: "employeeTypeName",
            key: "employeeTypeId",
            width: 140
        },
        {
            title: 'Leave Type',
            dataIndex: 'leaveTypeName',
            key: 'leaveTypeId',
            width: 140
        },
        {
            title: 'Actions',
            key: 'action',
            width: 140,
            render: (record) => <TableAction rowInfo={record} deleteAction={deleteLeaveConfig} pagination={pagination} />
        },
    ]
 
    // column list for search
    const searchableColumnLists = [
        {
            id: 0,
            label: 'Name',
            value: 'name'
        }
    ]

    return (
        <div className={'bg-white px-4 py-3 rounded-md'}>
            <SearchBlock action={getLeaveConfigSearchList} searchableColumnLists={searchableColumnLists} />
            <TableBlock
                action={getLeaveConfigSearchList}
                columns={columns}
                dataList={leaveConfigList}
                pagination={pagination}
                isLoading={isLoading}
                rowKey="id"
            />
        </div>
    )
}

export default LeaveConfigTableView