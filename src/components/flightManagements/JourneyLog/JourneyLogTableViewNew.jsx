import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'

// import components
import EditableCell from './EditableCell'

// import actions and reducers
import {
	getJourneyLogList,
	saveJourneyLog,
} from '../../../services/actions/FlightManagementActions/journeyLogAction'
import { AdvanceTable, InputFieldFilter, SearchBlock, TableTitle } from '../../commonComponents'
import { setSuccess } from '../../../services/reducers/JourneyLog/journeyLogReducer'
import { SlCalender } from 'react-icons/sl'

function JourneyLogTableViewNew() {
	const { JourneyLogList, isLoading, search_date, success } = useSelector(
		(state) => state.journeyLog
	)

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
					enableColumnFilter: false,
					Cell: ({ renderedCellValue }) => (
						<div className={'flex justify-start items-center gap-1 font-bold'}>
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
			],
		},
		{
			header: 'SECTOR',
			columns: [
				{
					header: 'FRM',
					accessorKey: 'fromIcaoCode',
					key: 'fromIcaoCode',
					width: 160,
					filterFn: 'fuzzy',
					Filter: ({ header }) => InputFieldFilter(header, 'text'),
				},
				{
					header: 'TO',
					accessorKey: 'toIcaoCode',
					key: 'toIcaoCode',
					filterFn: 'fuzzy',
					width: 150,
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
					header: <RenderTitle title={'BLOCK OFF'} />,
					accessorKey: 'blockOffTime',
					key: 'blockOffTime',
					width: 160,
					enableColumnFilter: false,
					Cell: ({ renderedCellValue, row }) => (
						<EditableCell
							value={renderedCellValue}
							onSave={(value) => handleEdit('blockOffTime', value, row?.original)}
							type='date'
							success={success}
						/>
					),
				},
				{
					header: <RenderTitle title={'BLOCK ON'} />,
					accessorKey: 'blockOnTime',
					key: 'blockOnTime',
					width: 150,
					enableColumnFilter: false,
					Cell: ({ renderedCellValue, row }) => (
						<EditableCell
							value={renderedCellValue}
							onSave={(value) => handleEdit('blockOnTime', value, row?.original)}
							type='date'
							success={success}
						/>
					),
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
			header: 'AIR TIME',
			columns: [
				{
					header: <RenderTitle title={'T/O TIME'} />,
					accessorKey: 'takeOffTime',
					key: 'takeOffTime',
					width: 160,
					enableColumnFilter: false,
					Cell: ({ renderedCellValue, row }) => (
						<EditableCell
							value={renderedCellValue}
							onSave={(value) => handleEdit('takeOffTime', value, row?.original)}
							type='date'
							success={success}
						/>
					),
				},
				{
					header: <RenderTitle title={'LAND TIME'} />,
					accessorKey: 'landTime',
					key: 'landTime',
					width: 150,
					enableColumnFilter: false,
					Cell: ({ renderedCellValue, row }) => (
						<EditableCell
							value={renderedCellValue}
							onSave={(value) => handleEdit('landTime', value, row?.original)}
							type='date'
							success={success}
						/>
					),
				},
				{
					header: 'FLT TIME',
					accessorKey: 'flightTime',
					key: 'flightTime',
					width: 150,
					enableColumnFilter: false,
				},
			],
		},
		{
			header: 'PILOT AIR TIME',
			columns: [
				{
					header: 'TAKE OFF TIME',
					accessorKey: 'picTakeOffTime',
					key: 'picTakeOffTime',
					enableColumnFilter: false,
					width: 150,
				},
				{
					header: 'LAND TIME',
					accessorKey: 'picLandTime',
					key: 'picLandTime',
					enableColumnFilter: false,
					width: 160,
				},
			],
		},
		{
			header: 'CREW RECORDS',
			columns: [
				{
					header: 'NAV TIME',
					accessorKey: 'navTime',
					key: 'navTime',
					enableColumnFilter: false,
					width: 160,
				},
				{
					header: 'INSTR TIME',
					accessorKey: 'instrTime',
					key: 'instrTime',
					enableColumnFilter: false,
					width: 150,
				},
				{
					header: <RenderTitle title={'NIGHT TIME'} />,
					accessorKey: 'nightTime',
					key: 'nightTime',
					width: 150,
					enableColumnFilter: false,
					Cell: ({ renderedCellValue, row }) => (
						<EditableCell
							value={renderedCellValue}
							onSave={(value) => handleEdit('nightTime', value, row?.original)}
							type='date'
							success={success}
						/>
					),
				},
				{
					header: <RenderTitle title={'T/O - P1/P2'} />,
					accessorKey: 'takeOffPilot',
					key: 'takeOffPilot',
					enableColumnFilter: false,
					width: 160,
					Cell: ({ renderedCellValue, row }) => (
						<EditableCell
							value={renderedCellValue}
							onSave={(value) => handleEdit('takeOffPilot', value, row?.original)}
							type='select'
							success={success}
						/>
					),
				},
				{
					header: <RenderTitle title={'LDG - P1/P2'} />,
					accessorKey: 'landingPilot',
					key: 'landingPilot',
					width: 160,
					enableColumnFilter: false,
					Cell: ({ renderedCellValue, row }) => (
						<EditableCell
							value={renderedCellValue}
							onSave={(value) => handleEdit('landingPilot', value, row?.original)}
							type='select'
							success={success}
						/>
					),
				},
			],
		},
		{
			header: 'FUEL RECORD',
			columns: [
				{
					header: <RenderTitle title={'RAMP FUEL'} />,
					accessorKey: 'rampFuel',
					key: 'rampFuel',
					width: 160,
					enableColumnFilter: false,
					Cell: ({ renderedCellValue, row }) => (
						<EditableCell
							value={renderedCellValue}
							onSave={(value) => handleEdit('rampFuel', value, row?.original)}
							type='number'
							success={success}
						/>
					),
				},
				{
					header: <RenderTitle title={'ACTL FUEL'} />,
					accessorKey: 'actualFuel',
					key: 'actualFuel',
					width: 150,
					enableColumnFilter: false,
					Cell: ({ renderedCellValue, row }) => (
						<EditableCell
							value={renderedCellValue}
							onSave={(value) => handleEdit('actualFuel', value, row?.original)}
							type='number'
							success={success}
						/>
					),
				},
				{
					header: <RenderTitle title={'ARR'} />,
					accessorKey: 'arr',
					key: 'arr',
					width: 150,
					enableColumnFilter: false,
					Cell: ({ renderedCellValue, row }) => (
						<EditableCell
							value={renderedCellValue}
							onSave={(value) => handleEdit('arr', value, row?.original)}
							type='number'
							success={success}
						/>
					),
				},
				{
					enableColumnFilter: false,
					header: 'CONSUMED',
					accessorKey: 'consumed',
					key: 'consumed',
					width: 150,
				},
			],
		},
		{
			header: 'WIND DATA',
			columns: [
				{
					header: <RenderTitle title={'IN BOUND'} />,
					accessorKey: 'inBound',
					key: 'inBound',
					enableColumnFilter: false,
					width: 160,
					Cell: ({ renderedCellValue, row }) => (
						<EditableCell
							value={renderedCellValue}
							onSave={(value) => handleEdit('inBound', value, row?.original)}
							type='text'
							success={success}
						/>
					),
				},
				{
					header: <RenderTitle title={'OUT BOUND'} />,
					accessorKey: 'outBound',
					key: 'outBound',
					enableColumnFilter: false,
					width: 150,
					Cell: ({ renderedCellValue, row }) => (
						<EditableCell
							value={renderedCellValue}
							onSave={(value) => handleEdit('outBound', value, row?.original)}
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
		dispatch(saveJourneyLog(data))
	}

	useEffect(() => {
		dispatch(
			getJourneyLogList({
				fromDate: currentDate.format('YYYY-MM-DD'),
				toDate: currentDate.format('YYYY-MM-DD'),
			})
		)
	}, [])

	return (
		<AdvanceTable
			leftRenderToolbar={<TableTitle title={'Journey Log'} />}
			rightRenderToolbar={<SearchBlock action={getJourneyLogList} from='journeyLog' />}
			enableGlobalFilter={false}
			enableGroupColumns={true}
			columns={columns}
			data={JourneyLogList}
			isLoading={isLoading}
			enablePagination={false}
			enableCheckbox={false}
		/>
	)
}

// Cell title component
export const RenderTitle = ({ title }) => {
	return (
		<div
			style={{
				backgroundColor: '#e0e0de',
				padding: '12px',
				fontWeight: 'bold',
				color: 'black',
			}}
		>
			{' '}
			{title}{' '}
		</div>
	)
}
export default JourneyLogTableViewNew
