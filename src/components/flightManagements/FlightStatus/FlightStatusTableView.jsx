import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'

//import icon
import { SlCalender } from 'react-icons/sl'

// import components
import EditableCell from '../JourneyLog/EditableCell'
import { AdvanceTable, InputFieldFilter, SearchBlock, TableTitle } from '../../commonComponents'
import { Tag } from 'antd'

// import custom css
import '../../../styles/JourneyLog.css'

// import actions and reducers
import {
	getFlightStatusList,
	saveFlightStatus,
} from '../../../services/actions/FlightManagementActions/flightStatusAction'
import { setSuccess } from '../../../services/reducers/FlightManagementReducers/flightStatusReducer'

function FlightStatusTableView() {
	const { FlightStatusList, isLoading, search_date, success } = useSelector(
		(state) => state.flightStatus
	)

	// initialize dispatch func.
	const dispatch = useDispatch()
	const currentDate = dayjs()

	const _setColor = {
		0: '#6554AF',
		1: '#2E8A99',
		2: '#F29727',
		3: '#66347F',
		4: '#884A39',
		5: '#5C8984',
		6: '#8D7B68',
		7: '#1B9C85',
		8: '#643843',
		9: '#B71375',
		10: '#557153',
		11: '#576CBC',
		12: '#002B5B',
		13: '#DF7857',
	}

	// structrue table column
	const columns = [
		{
			id: 'date',
			header: '',
			columns: [
				{
					header: 'DATE',
					accessorKey: 'date',
					Filter: ({ header }) => InputFieldFilter(header, 'date'),
					Cell: ({ renderedCellValue }) => (
						<div className={'flex justify-start items-center gap-1 font-bold'}>
							{' '}
							<SlCalender className={'w-4 h-4'} /> {renderedCellValue}
						</div>
					),
					enableColumnFilter: false,
				},
			],
		},
		{
			header: 'FLT DATA',
			columns: [
				{
					header: 'FLTNO',
					accessorKey: 'flightNo',
					key: 'flightNo',
					width: 160,
					filterFn: 'fuzzy',
					Cell: ({ renderedCellValue }) => (
						<span className='font-bold'>{renderedCellValue}</span>
					),
					Filter: ({ header }) => InputFieldFilter(header, 'text'),
				},
				{
					header: 'ACFT',
					accessorKey: 'aircraftName',
					key: 'aircraftName',
					filterFn: 'fuzzy',
					width: 150,
					Filter: ({ header }) => InputFieldFilter(header, 'text'),
				},
				{
					header: 'ACFT TYPE',
					accessorKey: 'aircraftTypeName',
					key: 'aircraftTypeName',
					filterFn: 'fuzzy',
					width: 150,
					Filter: ({ header }) => InputFieldFilter(header, 'text'),
				},
			],
		},
		{
			id: 'pic',
			header: '',
			columns: [
				{
					header: 'PIC',
					accessorKey: 'pic',
					key: 'pic',
					filterFn: 'fuzzy',
					width: 150,
					Cell: ({ renderedCellValue }) => (
						<span className='font-bold'>{renderedCellValue}</span>
					),
					Filter: ({ header }) => InputFieldFilter(header, 'text'),
				},
			],
		},
		{
			header: 'SKD TIME',
			columns: [
				{
					header: 'STD',
					accessorKey: 'standardDepartTime',
					key: 'standardDepartTime',
					width: 160,
					enableColumnFilter: false,
				},
				{
					header: 'STA',
					accessorKey: 'standardArriveTime',
					key: 'standardArriveTime',
					width: 150,
					enableColumnFilter: false,
				},
			],
		},
		{
			header: 'BLOCK TIME',
			columns: [
				{
					header: 'BLOCK OFF',
					accessorKey: 'blockOffTime',
					key: 'blockOffTime',
					width: 160,
					enableColumnFilter: false,
				},
				{
					header: 'BLOCK ON',
					accessorKey: 'blockOnTime',
					key: 'blockOnTime',
					width: 150,
					enableColumnFilter: false,
				},
				{
					header: 'BLOCK TIME',
					accessorKey: 'blockTime',
					key: 'blockTime',
					width: 150,
					enableColumnFilter: false,
				},
			],
		},
		{
			header: 'DEPARTURE',
			columns: [
				{
					header: 'EARLY',
					accessorKey: 'deptEarlyTime',
					key: 'deptEarlyTime',
					width: 160,
					enableColumnFilter: false,
					Cell: ({ renderedCellValue }) => (
						<Tag color='green'>
							{renderedCellValue === 'N/A' ? '' : renderedCellValue}
						</Tag>
					),
				},
				{
					header: 'DELAY',
					accessorKey: 'deptDelayTime',
					key: 'deptDelayTime',
					width: 150,
					enableColumnFilter: false,
					Cell: ({ renderedCellValue }) => (
						<Tag color='red'>
							{renderedCellValue === 'N/A' ? '' : renderedCellValue}
						</Tag>
					),
				},
			],
		},
		{
			header: 'ARRIVAL',
			columns: [
				{
					header: 'EARLY',
					accessorKey: 'arriveEarlyTime',
					key: 'arriveEarlyTime',
					width: 160,
					enableColumnFilter: false,
					Cell: ({ renderedCellValue }) => (
						<Tag color='green'>
							{renderedCellValue === 'N/A' ? '' : renderedCellValue}
						</Tag>
					),
				},
				{
					header: 'DELAY',
					accessorKey: 'arriveDelayTime',
					key: 'arriveDelayTime',
					width: 150,
					enableColumnFilter: false,
					Cell: ({ renderedCellValue }) => (
						<Tag color='red'>
							{renderedCellValue === 'N/A' ? '' : renderedCellValue}
						</Tag>
					),
				},
			],
		},
		{
			id: 'remarks',
			header: '',
			columns: [
				{
					header: 'REMARKS',
					accessorKey: 'remarks',
					key: 'remarks',
					width: 250,
					editable: true,
					enableColumnFilter: false,
					Cell: ({ renderedCellValue, row }) => (
						<EditableCell
							value={renderedCellValue}
							onSave={(value) => handleEdit('remarks', value, row?.original)}
							type='text'
							success={success}
						/>
					),
				},
			],
		},
	]?.map((item) => ({
		...item,
		muiTableHeadCellProps: {
			sx: {
				backgroundColor: _setColor[Math.floor(Math.random() * 14)],
				padding: '12px',
				fontWeight: 'bold',
				color: 'white',
			},
		},
	}))

	// save or submit handler
	function handleEdit(column, value, key) {
		// Handle the cell value change here
		const data = {
			id: key?.id,
			dailyFlightPlanId: key?.dailyFlightPlanId,
			[column]: value,
			date: search_date ?? currentDate.format('YYYY-MM-DD'),
		}

		if (value === 'N/A' || key[column] == value || value <= 0) {
			dispatch(setSuccess(false))
			return
		}
		dispatch(saveFlightStatus(data))
	}

	useEffect(() => {
		dispatch(
			getFlightStatusList({
				fromDate: currentDate.format('YYYY-MM-DD'),
				toDate: currentDate.format('YYYY-MM-DD'),
			})
		)
	}, [])

	return (
		<AdvanceTable
			leftRenderToolbar={<TableTitle title={'Flight Status'} />}
			rightRenderToolbar={<SearchBlock action={getFlightStatusList} from='flight_status' />}
			enableGlobalFilter={false}
			enableGroupColumns={true}
			columns={columns}
			data={FlightStatusList}
			isLoading={isLoading}
			enablePagination={false}
			action={getFlightStatusList}
			enableCheckbox={false}
		/>
	)
}

export default FlightStatusTableView
