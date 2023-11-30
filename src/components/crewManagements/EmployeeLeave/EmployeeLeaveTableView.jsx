import { useSelector } from 'react-redux'

// import components
import { ScrollTableBlock, TableAction, SearchBlock, SingleItemView } from '../../commonComponents'
import { RenderApprovalStatus } from '../../commonComponents/RenderStatus'

// import redux actions
import { deleteEmployeeLeave, getEmployeeLeaveSearchList } from '../../../services/actions/CrewManagementActions/employeeLeaveAction'

const EmployeeLeaveTableView = () => {
  // get Employee Leave state values from redux
  const { isLoading, employeeLeaveList, pagination } = useSelector( (state) => state.employeeLeave )

  const columns = [
    {
      title: 'Employee Name',
      dataIndex: 'employeeName',
      key: 'employeeName',
      fixed: 'left',
      width: 150,
      render: (text) => <SingleItemView item={text} />
    },
    {
      title: 'Leave Type',
      dataIndex: 'leaveTypeName',
      key: 'leaveTypeName',
      width: 120,
    },
    {
      title: 'Start Date',
      dataIndex: 'fromDate',
      key: 'fromDate',
      width: 100,
    },
    {
      title: 'End Date',
      dataIndex: 'toDate',
      key: 'toDate',
      width: 100,
    },
    {
      title: 'Days',
      dataIndex: 'spendDays',
      key: 'spendDays',
      width: 80,
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
      width: 120,
    },
    {
      title: 'Approval Status',
      dataIndex: ['approvalResponse', 'approvalStatus'],
      key: 'approvalStatus',
      width: 100,
      render: (text) => <RenderApprovalStatus text={text} />,
    },
    {
      title: 'Actions',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (record) => (
				<TableAction
					rowInfo={record}
					deleteAction={deleteEmployeeLeave}
					pagination={pagination}
          getTableDataAction={getEmployeeLeaveSearchList}
				/>
			),
    },
  ]

  return (
    <div className={'bg-white px-4 py-3 rounded-md'}>
      <SearchBlock
				action={getEmployeeLeaveSearchList}
			/>
      <ScrollTableBlock
        action={getEmployeeLeaveSearchList}
        columns={columns}
        dataList={employeeLeaveList}
        pagination={pagination}
        isLoading={isLoading}
      />
    </div>
  )
}

export default EmployeeLeaveTableView
