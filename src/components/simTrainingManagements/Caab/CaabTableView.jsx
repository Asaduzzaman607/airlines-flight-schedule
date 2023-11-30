import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'

// import components
import { Card, Table, Tabs } from 'antd'
import TabPane from 'antd/es/tabs/TabPane'
import { SearchBlock, TableAction, SingleItemView } from '../../commonComponents'

// import actions
import {
	deleteCaab,
	getCaabSearchList,
	updateStatus,
} from '../../../services/actions/SimTrainingManagementActions/caabAction'
import { setActiveTab } from '../../../services/reducers/SimTrainingManagementReducers/caabReducer'

// import reducers
import { setSearchBlockValueToReducer } from '../../../services/reducers/CrewManagementReducers/employeeLeaveReducer'

const CaabTableView = () => {
	// get licence state values from redux
	const { isLoading, caabList, pagination, activeTab } = useSelector((state) => state.caab)

	const { stored_SearchBlock_Value } = useSelector((state) => state.employeeLeave)

	const dispatch = useDispatch()

	const _handlePagination = (page, pageSize) => {
		let pageWithSize = {
			page: page - 1,
			pageSize,
			stored_SearchBlock_Value,
		}
		dispatch(
			setSearchBlockValueToReducer({
				...stored_SearchBlock_Value,
				page: page - 1,
				pageSize,
				name: '',
			})
		)

		//call backend with 'page' for current data
		dispatch(getCaabSearchList(pageWithSize, activeTab === 'active'))
	}
	const columns = [
		{
			title: 'Related Crew Name',
			dataIndex: 'employeeName',
			key: 'employeeName',
			width: 140,
			fixed: 'left',
			render: (text) => <SingleItemView item={text}/>
		},
		{
			title: 'Reference No',
			dataIndex: 'refNo',
			key: 'refNo',
			fixed: 'left',
			width: 140,
			render: (text) => text ?? 'N/A',
		},
		{
			title: 'Details',
			dataIndex: 'details',
			key: 'details',
			width: 230,
			render: (text) => text ?? 'N/A',
		},
		{
			title: 'Sent Date',
			dataIndex: 'sentDate',
			key: 'sentDate',
			width: 100,
			render: (text) => text ?? 'N/A',
		},
		{
			title: 'Action from CAAB',
			dataIndex: 'actionFromCaab',
			key: 'actionFromCaab',
			width: 100,
			render: (text) => text ?? 'N/A',
		},
		{
			title: 'Approval Date',
			dataIndex: 'approvalDate',
			key: 'approvalDate',
			width: 100,
			render: (text) => text ?? 'N/A',
		},
		{
			title: 'Remark',
			dataIndex: 'remark',
			key: 'remark',
			width: 140,
			render: (text) => text ?? 'N/A',
		},
		{
			title: 'Actions',
			key: 'action',
			fixed: 'right',
			width: 120,
			render: (record) => (
				<TableAction
					statusAction={updateStatus}
					rowInfo={record}
					deleteAction={deleteCaab}
					pagination={pagination}
				/>
			),
		},
	]

	// column list for search
	const searchableColumnLists = [
		{
			id: 0,
			label: 'Name',
			value: 'name',
		},
		{
			id: 1,
			label: 'Action From Caab',
			value: 'fromCaabType',
		},
		{
			id: 2,
			label: 'Sent Date',
			value: 'sentDate',
		},
		{
			id: 3,
			label: 'Approval Date',
			value: 'approvalDate',
		},
	]

	// check if tab has updated
	useEffect(() => {
		if (activeTab) {
			dispatch(getCaabSearchList({ page: 0, pageSize: 500 }, activeTab === 'active'))
		}
	}, [activeTab, dispatch])

	const _tabs = [
		{ label: 'Active', key: 'active' },
		{ label: 'Inactive', key: 'inactive' },
	]

	const items = {
        fromCaabType: [
            {
                id: 0,
                name: 'Done',
                value: 'DONE'
            },
            {
                id: 1,
                name: 'Pending',
                value: 'PENDING'
            }
        ]
    }

	return (
		<Card className={'px-1 py-1'}>
			<Tabs
				activeKey={activeTab}
				onChange={(key) => dispatch(setActiveTab(key))}
				defaultActiveKey={activeTab}
			>
				{_tabs?.length &&
					_tabs?.map((tab) => (
						<TabPane tab={tab?.label} key={tab?.key}>
							<>
								<SearchBlock
									action={getCaabSearchList}
									searchableColumnLists={searchableColumnLists}
									items={ items }
								/>
								<Table
									columns={columns}
									dataSource={caabList}
									loading={isLoading}
									bordered
									scroll={{
										y: 'calc(100vh - 299px)',
										x: 1000,
									}}
									pagination={
										caabList?.length
											? {
													size: 'small',
													onChange: (page, pageSize) =>
														_handlePagination(page, pageSize),
													defaultPageSize: 10,
													current: pagination?.currentPage,
													total: pagination?.pageSize,
													position: ['bottomRight'],
													showSizeChanger: pagination?.pageSize > 10,
													pageSizeOptions: [
														'10',
														'20',
														'50',
														'100',
														'200',
													],
											  }
											: false
									}
								/>
							</>
						</TabPane>
					))}
			</Tabs>
		</Card>
	)
}

export default CaabTableView
