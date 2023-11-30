import { useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'

// import components
import {
	AdvanceTable,
	TableAction,
	InputFieldFilter,
	DateTimeFilter,
	TableTitle,
} from '../../commonComponents'
import { RenderApprovalStatus } from '../../commonComponents/RenderStatus'

//import icons
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai'
import { SlCalender } from 'react-icons/sl'

// import actions
import {
	deleteFlightInfo,
	getFlightInfoSearchList,
} from '../../../services/actions/FlightManagementActions/flightInfoAction'

const TableView = () => {
	// get flight state values from redux
	const { isLoading, flightInfoList, pagination } = useSelector((state) => state.flightinfo)

	const flightType = [
		{
			id: 1,
			value: 'DOMESTIC',
			name: 'DOMESTIC',
		},
		{
			id: 2,
			value: 'INTERNATIONAL',
			name: 'INTERNATIONAL',
		},
	]
	const statusType = [
		{
			id: 1,
			value: 'PENDING',
			name: 'PENDING',
		},
		{
			id: 2,
			value: 'ACCEPTED',
			name: 'ACCEPTED',
		},
		{
			id: 3,
			value: 'REQUESTED',
			name: 'REQUESTED',
		},
	]

	// initialize dispatch func.
	const dispatch = useDispatch()

	const columns = useMemo(
		() => [
			{
				header: 'Flight No',
				accessorKey: 'flightNo',
				Filter: ({ header }) => InputFieldFilter(header, 'text', 'text'),
				Cell: ({ renderedCellValue }) => (
					<span className='font-bold'>{renderedCellValue}</span>
				),
			},
			{
				header: 'Aircraft Name',
				accessorKey: 'aircraftName',
				Filter: ({ header }) => InputFieldFilter(header, 'text'),
			},
			{
				header: 'Flight Season Name',
				accessorKey: 'flightSeasonName',
				Filter: ({ header }) => InputFieldFilter(header, 'text'),
				Cell: ({ renderedCellValue }) => <span>{renderedCellValue ?? 'N/A'}</span>,
			},
			{
				header: 'Flight Date',
				accessorKey: 'flightDate',
				accessorFn: (row) =>
					row?.flightDate && dayjs(row?.flightDate).format('DD-MMM-YYYY'),
				Filter: ({ header }) => InputFieldFilter(header, 'date'),
				Cell: ({ renderedCellValue }) => (
					<div>
						<SlCalender /> {renderedCellValue}
					</div>
				),
				filterFn: (row, _columnIds, filterValue) =>
					row?.original?.flightDate === filterValue,
			},
			{
				header: 'Standard Departure Time',
				accessorKey: 'standardDepartureTime',
				enableColumnFilter: false,
				Cell: ({ renderedCellValue }) => <DateTimeFilter value={renderedCellValue} />,
				size: 200,
			},
			{
				header: 'Standard Arrival Time',
				accessorKey: 'standardArrivalTime',
				enableColumnFilter: false,
				Cell: ({ renderedCellValue }) => <DateTimeFilter value={renderedCellValue} />,
			},
			{
				header: 'Actual Departure Time',
				accessorKey: 'actualDepartureTime',
				enableColumnFilter: false,
				Cell: ({ renderedCellValue }) => <DateTimeFilter value={renderedCellValue} />,
			},
			{
				header: 'Actual Arrival Time',
				accessorKey: 'actualArrivalTime',
				enableColumnFilter: false,
				Cell: ({ renderedCellValue }) => <DateTimeFilter value={renderedCellValue} />,
			},
			{
				header: 'Leg',
				accessorKey: 'leg',
				Filter: ({ header }) => InputFieldFilter(header, 'text'),
				Cell: ({ renderedCellValue }) => (
					<span className='font-bold'>{renderedCellValue}</span>
				),
			},
			{
				header: 'Duration (H:M)',
				accessorKey: 'duration',
				enableColumnFilter: false,
				Cell: ({ renderedCellValue }) => (
					<span>{renderedCellValue?.replace(':', 'h : ') + 'min'}</span>
				),
			},
			{
				header: 'Flight Type',
				accessorKey: 'flightType',
				Filter: ({ header }) => InputFieldFilter(header, 'commonSelect', flightType),
			},
			{
				header: 'Status',
				accessorKey: 'flightStatus',
				Filter: ({ header }) => InputFieldFilter(header, 'commonSelect', statusType),
				Cell: ({ cell }) => <RenderApprovalStatus text={cell.getValue()} />,
			},
			{
				header: 'Layover',
				accessorKey: 'isLayover',
				enableColumnFilter: false,
				Cell: ({ cell }) => (
					<span className='flex justify-center items-center w-12'>
						{cell.getValue() ? (
							<AiOutlineCheckCircle className='w-5 h-5 text-[#389E0D]' />
						) : (
							<AiOutlineCloseCircle className='w-5 h-5 text-[#B71D18]' />
						)}
					</span>
				),
			},
			{
				header: 'Actions',
				accessorKey: 'action',
				enableColumnFilter: false,
				Cell: ({ row }) => {
					return (
						<TableAction
							rowInfo={row?.original}
							deleteAction={deleteFlightInfo}
							pagination={pagination}
						/>
					)
				},
			},
		],
		[]
	)

	// get Data List initially.
	useEffect(() => {
		dispatch(getFlightInfoSearchList({ page: 0, pageSize: 20 }))
	}, [])

	// Handle Pagination
	const _handlePagination = (page, pageSize, payload) => {
		let pageWithSize = {
			page: page,
			pageSize,
			payload,
		}
		dispatch(getFlightInfoSearchList(pageWithSize))
	}

	return (
		<AdvanceTable
			leftRenderToolbar={<TableTitle title={'Flight Information'} />}
			enableGlobalFilter={false}
			columns={columns}
			data={flightInfoList}
			isLoading={isLoading}
			action={getFlightInfoSearchList}
			enableCheckbox={false}
			enablePagination={true}
			pagination={{
				onChange: (page, pageSize, payload) => _handlePagination(page, pageSize, payload),
				pageIndex: pagination?.currentPage,
				defaultPageSize: 20,
				pageSize: pagination?.currentPageSize,
				totalPage: pagination?.totalPage,
				totalElements: pagination?.pageSize,
				pageSizeOptions: ['10', '20', '50', '100', '200'],
			}}
		/>
	)
}

export default TableView
