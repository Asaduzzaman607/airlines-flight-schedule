import { useSelector } from 'react-redux'

// import components
import { ScrollTableBlock, SearchBlock, TableAction } from '../../commonComponents'
import { MultipleEmployeeView } from '../../commonComponents/CommonItems'
import { RenderApprovalStatus } from '../../commonComponents/RenderStatus'

// import icons
import { UserOutlined } from '@ant-design/icons'

// import redux actions
import {
	getSimPlanSearchList,
	deleteSimPlan,
} from '../../../services/actions/SimTrainingManagementActions/simPlanAction'

const SimPlanTableView = () => {
	// get Sim Plan state values from redux
	const { isLoading, simPlanList, pagination } = useSelector((state) => state.simPlan)
    
	// column list for search
	const searchableColumnLists = [
		{
			id: 0,
			label: 'Flight Crews',
			value: 'employeeName',
		},
	]

	const columns = [
		{
			title: 'Flight Crews',
			dataIndex: 'employees',
			key: 'employees',
			fixed: 'left',
			width: 250,
			render: (text) => <MultipleEmployeeView items={text} Icon={UserOutlined} size={25} />,
		},
		{
			title: 'Departure Date',
			dataIndex: 'depDate',
			key: 'depDate',
			width: 120,
		},
		{
			title: 'Arrival Date',
			dataIndex: 'arrDate',
			key: 'arrDate',
			width: 120,
		},
		{
			title: 'Slot Sessions',
			children: [
				{
					title: 'Slot Date',
					dataIndex: 'slotSessionss',
					key: 'slotSessionss',
					width: 170,
					render: (text) => (
						<span>
							{text && text.length
								? text.map((item) => <p> {item.slotDate} </p>)
								: ''}
						</span>
					),
				},
				{
					title: 'Session',
					dataIndex: 'slotSessionss',
					key: 'slotSessionss',
					width: 170,
					render: (text) => (
						<span>
							{text && text.length ? text.map((item) => <p> {item.session} </p>) : ''}
						</span>
					),
				},
			],
		},
		{
			title: 'Aircraft Type',
			dataIndex: 'aircraftType',
			key: 'aircraftType',
			width: 150,
			render: (item) => <span> {item?.aircraftTypeName} </span>,
		},
		{
			title: 'SIM Module',
			dataIndex: 'simModule',
			key: 'simModule',
			width: 170,
		},
		{
			title: 'Doc Request',
			dataIndex: 'docRequest',
			key: 'docRequest',
			width: 120,
		},
		{
			title: 'Doc Submit',
			dataIndex: 'docSubmit',
			key: 'docSubmit',
			width: 120,
		},
		{
			title: 'Seat Block',
			dataIndex: 'seatBlock',
			key: 'seatBlock',
			width: 120,
		},
		{
			title: 'GD Book',
			dataIndex: 'gdBlock',
			key: 'gdBlock',
			width: 120,
		},
		{
			title: 'Hotel Book',
			dataIndex: 'hotelBook',
			key: 'hotelBook',
			width: 120,
		},
		{
			title: 'OCC (DAC-BKK)',
			dataIndex: 'occDacBkk',
			key: 'occDacBkk',
			width: 120,
		},
		{
			title: 'OCC (BKK-DAC)',
			dataIndex: 'occBkkDac',
			key: 'occBkkDac',
			width: 120,
		},
		{
			title: 'Fund Requisition',
			dataIndex: 'fundRequisition',
			key: 'fundRequisition',
			width: 120,
		},
		{
			title: 'Fund Receive',
			dataIndex: 'fundReceive',
			key: 'fundReceive',
			width: 120,
		},
		{
			title: 'Doc Handover',
			dataIndex: 'docHandover',
			key: 'docHandover',
			width: 120,
		},
		{
			title: 'Bill Receive',
			dataIndex: 'billReceive',
			key: 'billReceive',
			width: 120,
		},
		{
			title: 'Adjustment',
			dataIndex: 'adjustment',
			key: 'adjustment',
			width: 120,
		},
		{
			title: 'Last PPC & IR endorsement',
			dataIndex: 'lastPpcIrEndorsement',
			key: 'lastPpcIrEndorsement',
			width: 120,
		},
		{
			title: 'New PPC & IR endorsement',
			dataIndex: 'newPpcIrEndorsement',
			key: 'newPpcIrEndorsement',
			width: 120,
		},
		{
			title: 'Approval Status',
			dataIndex: 'approvalStatus',
			key: 'approvalStatus',
			width: 150,
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
					deleteAction={deleteSimPlan}
					pagination={pagination}
                    getTableDataAction={getSimPlanSearchList}
				/>
			),
		},
	]

	return (
		<div className={'bg-white px-4 py-3 rounded-md'}>
			<SearchBlock
				action={getSimPlanSearchList}
				searchableColumnLists={searchableColumnLists}
			/>
			<ScrollTableBlock
				action={getSimPlanSearchList}
				columns={columns}
				dataList={simPlanList}
				pagination={pagination}
				isLoading={isLoading}
			/>
		</div>
	)
}

export default SimPlanTableView
