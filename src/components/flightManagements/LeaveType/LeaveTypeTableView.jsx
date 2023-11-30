import { useSelector } from 'react-redux'

// import components
import { SearchBlock, TableBlock, TableAction } from '../../commonComponents'

// import actions 
import { deleteLeaveType, getLeaveTypeSearchList } from '../../../services/actions/FlightManagementActions/leaveTypeAction'


const LeaveTypeTableView = () => {
    // get Driver state values from redux
    const { isLoading, leaveTypeList, pagination } = useSelector(state => state.leaveType)
    
    const columns = [
        {
            title: 'Name',
            dataIndex: "name",
            key: "name",
            width: 140
        },
        {
            title: 'Allocation Days',
            dataIndex: 'allocationDays',
            key: 'allocationDays',
            width: 140
        },
        {
            title: 'Leave Period',
            dataIndex: 'leavePeriodName',
            key: 'leavePeriodName',
            width: 140
        },
        {
            title: 'Actions',
            key: 'action',
            width: 140,
            render: (record) => <TableAction rowInfo={record} deleteAction={deleteLeaveType} pagination={pagination} />
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
            <SearchBlock action={getLeaveTypeSearchList} searchableColumnLists={searchableColumnLists} />
            <TableBlock
                action={getLeaveTypeSearchList}
                columns={columns}
                dataList={leaveTypeList}
                pagination={pagination}
                isLoading={isLoading}
                rowKey="id"
                rowClassName={(record) => (!record.checked ? 'inactive-row' : '')}
            />
        </div>
    )
}

export default LeaveTypeTableView