import React, { Suspense, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'

// import components
import { Button } from 'antd'
import { AdvanceTable, CustomDrawer, InputFieldFilter, TableTitle } from '../commonComponents'
import CabinCrewCell from './CabinCrewCell'
import CabinCrewAddEdit from './CabinCrewAddEdit'
import { CustomTag } from '../commonComponents/CommonItems'

// import actions
import { getAssignCabinCrewFlights } from '../../services/actions/dashboardAction'

//import icons
import { CloseOutlined } from '@ant-design/icons'

//import reducer
import {
	setCabinCrewdetails,
	setInitialFormValuesForUpdateCabinCrew,
	setInitialValuesLeave,
	setInitialValuesStandBy,
	setIsCabinCrewDrawerOpen,
	setSelectedCabinCrewActionKey,
	setSelectedCabinCrewFlights,
    setViolatedRuels,
} from '../../services/reducers/dashboardReducer'

//import config
import { DATE_FORMAT } from '../../config'

const CabinCrewDashboard = () => {
	const {
		cabinCrewFlights,
		isCabinCrewFlightsLoading,
		isCabinCrewDrawerOpen,
		selectedCabinCrewActionKey,
	} = useSelector((state) => state.dashboard)
	const { headerList, dataList } = cabinCrewFlights

	const dispatch = useDispatch()
	//common filter func
	const isIncludes = (_value, _includeString) =>
		_value &&
		_includeString &&
		_value.toString().toLowerCase().includes(_includeString.toLowerCase())

	// filtering with employee name
	const filterByEmployee = useCallback((row, _columnIds, filterValue) => {
		const { name, batchId, short_address } = row?.original?.employee ?? {
			name: '',
			batchId: '',
			short_address: '',
		}
		return (
			isIncludes(name, filterValue) ||
			isIncludes(short_address, filterValue) ||
			isIncludes(`B-${batchId}`, filterValue)
		)
	}, [])

	// filtering with date fields
	const filterByDates = useMemo(
		() => (row, _columnIds, filterValue) => {
			const roleTypeLookup = {
				PURSER: 'P',
				JUNIOR_PURSER: 'JP',
				GENERAL_CREW: 'GC',
			}
			const filterByValue = (value) => {
				if (value?.length) {
					return value.some((item) => {
						// validate layover
						if (item?.type === 'layover') return isIncludes('lo', filterValue)

						// validate leave
						if (item?.type === 'leave') return isIncludes('leave', filterValue)

						// validate flight
						if (item?.type === 'flight') {
							return item?.flight?.some(
								(i) => i?.flightNo && isIncludes(i?.flightNo, filterValue)
							)
						}

						// validate standby
						if (item?.type === 'stand_by') {
							return Object.values(item?.stand_by)?.some(
								(item) =>
									isIncludes(roleTypeLookup[item] || item, filterValue) ||
									isIncludes('sb', filterValue)
							)
						}
						return false
					})
				}
				return false
			}
			return filterValue.toLowerCase() === '-'
				? row?.original?.[_columnIds] === undefined
				: filterByValue(row?.original?.[_columnIds])
		},
		[]
	)

	// //should be memoized or stable
	const columns = useMemo(() => {
		if (headerList?.length) {
			return headerList.map((item) => {
				const header = {
					accessorKey: item?.accessorKey,
					columnDefType: 'data',
					header: item?.header,
					id: item?.accessorKey,
					Filter: ({ header }) => InputFieldFilter(header, 'text'),
				}
				if (item?.accessorKey === 'id') {
					return {
						...header,
						size: 100,
						enableColumnFilter: false,
					}
				}
				if (item?.accessorKey === 'employee.name') {
					return {
						...header,
						size: 200,
						filterFn: filterByEmployee,
						Cell: ({ cell }) => {
							return (
								<div className={'font-bold'}>
									<div>{cell?.getValue() ?? 'N/A'}</div>
									<CustomTag color='blue'>
										B-{cell?.row?.original?.employee?.batchId ?? 'N/A'}
									</CustomTag>
									<CustomTag color='cyan'>
										{cell?.row?.original?.employee?.short_address ?? 'N/A'}
									</CustomTag>
								</div>
							)
						},
					}
				}
				if (item?.accessorKey === 'employee.rated') {
					return {
						...header,
						Cell: ({ cell }) => (
							<CustomTag color={'green'}>{cell?.getValue() ?? 'N/A'}</CustomTag>
						),
					}
				}
				if (dayjs(item?.accessorKey)?.isValid()) {
					return {
						...header,
						size: 300,
						filterFn: filterByDates,
						Cell: ({ cell }) => (
							<CabinCrewCell
								onClick={() => {
									const { column, row } = cell

									// For the FlightAddEdit start
									const createInitFormValue = row?.original?.[column?.id]?.find(
										(item) => item?.type === 'flight'
									)
									const hasUpdate = row?.original?.[column?.id]
										?.map((item) => item?.flight?.length)
										?.some((length) => length > 0)

									if (createInitFormValue?.flight?.length > 0) {
										const isLayoverAvailable = createInitFormValue?.flight.find(
											(item) => item?.layover
										)
										const transformInitValue = {
											regular:
												createInitFormValue?.flight?.length > 0
													? createInitFormValue?.flight
															.filter(
																(item) =>
																	!item?.layover &&
																	item?.cabinCrewRoleType
															)
															.map((item) => ({
																dailyFlightPlanId: item?.flightId,
																cabinCrewFlightRoleType:
																	item?.cabinCrewRoleType,
															}))
													: [
															{
																dailyFlightPlanId: null,
																cabinCrewFlightRoleType: null,
															},
													  ],
											layover: isLayoverAvailable && {
												dailyFlightPlanId: isLayoverAvailable?.flightId,
												cabinCrewFlightRoleType:
													isLayoverAvailable?.cabinCrewRoleType,
												layoverHours: isLayoverAvailable?.layoverHours ?? 0,
											},
										}
										dispatch(
											setInitialFormValuesForUpdateCabinCrew(
												transformInitValue
											)
										)
									}

									// request payload of post/get cabinCrew flights
									const payload = {
										flightDate: column?.id,
										employeeId: row?.original?.employee?.id,
									}

									// set value of cabinCrew details
									dispatch(
										setCabinCrewdetails({
											...row?.original?.employee,
											flightDate: column?.id,
										})
									)

									if (hasUpdate && payload?.flightDate && payload?.employeeId) {
										// check is requested for updating the value and if employee id is available and then get flight list and role list of that employee
										dispatch(setIsCabinCrewDrawerOpen(true))
										dispatch(
											setSelectedCabinCrewActionKey(
												'update_cabin_crew_flight'
											)
										)
										dispatch(setSelectedCabinCrewFlights(payload))

										dispatch(getAssignCabinCrewFlights(payload))
									} else if (payload?.flightDate && payload?.employeeId) {
										dispatch(setIsCabinCrewDrawerOpen(true))
										dispatch(
											setSelectedCabinCrewActionKey(
												'add_new_cabin_crew_flight'
											)
										)
										dispatch(setSelectedCabinCrewFlights(payload))

										dispatch(getAssignCabinCrewFlights(payload))
									}

									// For the FlightAddEdit end

									// For the StandByAddEdit start
									const createInitFormValueStandBy = row?.original?.[
										column?.id
									]?.find((item) => item?.type === 'stand_by')
									if (createInitFormValueStandBy) {
										dispatch(
											setInitialValuesStandBy({
												shift:
													createInitFormValueStandBy?.stand_by?.shift ??
													'MORNING',
												cabinCrewRoleType:
													createInitFormValueStandBy?.stand_by
														?.cabinCrewRoleType ?? 'GENERAL_CREW',
											})
										)
									}

									// For the StandByAddEdit end

									// For the leavesAddEdit start
									const createInitFormValueLeave = row?.original?.[
										column?.id
									]?.find((item) => item?.type === 'leave')
									if (createInitFormValueLeave) {
										dispatch(
											setInitialValuesLeave({
												leaveTypeId:
													createInitFormValueStandBy?.leave?.leaveTypeId,
												date: [
													createInitFormValueStandBy?.leave?.fromDate
														? dayjs(
																createInitFormValueStandBy?.leave
																	?.fromDate,
																DATE_FORMAT
														  )
														: null,
													createInitFormValueStandBy?.leave?.toDate
														? dayjs(
																createInitFormValueStandBy?.leave
																	?.toDate,
																DATE_FORMAT
														  )
														: null,
												],
												isEmergency:
													createInitFormValueStandBy?.leave?.isEmergency,
												note: createInitFormValueStandBy?.leave?.note,
											})
										)
									}
									// For the leavesAddEdit end
								}}
								cellDetails={cell.getValue()}
							/>
						),
					}
				}
				return header
			})
		}
		return []
	}, [headerList, dispatch])

	const handleDrawerOnClose = () => {
		dispatch(setIsCabinCrewDrawerOpen(false))
        dispatch(setViolatedRuels([]))
	}

	// transform Data for excel download file
	const excelFormatedDataList = useMemo(
		() => (selectedColumnList) => {
			const selectedList = selectedColumnList.map((item) =>
				item?.replace(/\s/g, '_').toLowerCase()
			)
			// transforming data for excel download
			const transformDataList = dataList.length
				? dataList?.map((item) => {
						//transform common data
						let preObj = {
							sl_no: item.id,
							employee_id: item?.employee?.code,
							cabin_crew_name: `${item?.employee?.name}, B-${
								item?.employee?.batchId ?? 'N/A'
							},  ${item?.employee?.short_address ?? 'N/A'}`,
							rated: item?.employee?.rated,
							hours: item?.employee?.flying_hours ?? 'N/A',
							layover: item?.layover ? 'YES' : 'NO',
							off: item?.off ?? 0,
						}

						// transform date data of flight, layover, leave etc.
						Object.keys(item).length &&
							Object.keys(item)
								?.filter((key) => dayjs(key)?.isValid())
								.forEach((dataIndex) => {
									// create a string data from column info
									const columnInfo = {
										[dayjs(dataIndex).format('DD-MMM-YY').toString()]: item[
											dataIndex
										]
											?.map((item, index) =>
												item?.type === 'flight'
													? item?.flight?.length &&
													  item.flight
															.map(
																(item) =>
																	`${
																		item?.domestic
																			? item?.legInfo
																			: item?.flightNo
																	}`
															)
															.join(', ')
													: item?.type === 'layover'
													? `LO - ${item?.layover?.airport} - ${item?.layover?.startTime} -
									${item?.layover?.endTime}`
													: item?.type === 'leave'
													? `${item.leave}`
													: item?.type === 'stand_by' &&
													  `SB - ${
															item?.stand_by?.cabinCrewRoleType ===
															'PURSER'
																? 'P'
																: item?.stand_by
																		?.cabinCrewRoleType ===
																  'JUNIOR_PURSER'
																? 'JP'
																: 'GC'
													  }, ${item?.stand_by?.shiftName}, ${
															item?.stand_by?.startTime
													  } - ${item?.stand_by?.endTime}`
											)
											.join(', '),
									}
									Object.assign(preObj, columnInfo)
								})

						// checking the properties is selected column list or not
						const transformObj = {}
						Object.keys(preObj).length &&
							Object.keys(preObj).forEach((prop) => {
								if (selectedList?.includes(prop?.toLocaleLowerCase())) {
									transformObj[prop] = preObj[prop]
								}
							})
						return transformObj
				  })
				: []
			return transformDataList
		},
		[]
	)
	return (
		<Suspense fallback={<div>progressing..</div>}>
			<AdvanceTable
				excelFormatedDataFunc={excelFormatedDataList}
				columns={columns}
				data={dataList?.length ? dataList : []}
				enableStickyHeader={true}
				isLoading={isCabinCrewFlightsLoading}
				enableRowNumbers={false}
				leftRenderToolbar={<TableTitle title={'Cabin Crew - Flights'} />}
			/>
			<CustomDrawer
				open={isCabinCrewDrawerOpen}
				title={`${
					selectedCabinCrewActionKey === 'update_cabin_crew_flight' ? 'Update' : 'Assign'
				} Flights for Cabin Crew`}
				onClose={handleDrawerOnClose}
				closable={false}
				destroyOnClose={true}
				extra={
					<Button
						type={'primary'}
						size={'small'}
						icon={<CloseOutlined />}
						danger
						onClick={handleDrawerOnClose}
					/>
				}
			>
				<CabinCrewAddEdit />
			</CustomDrawer>
		</Suspense>
	)
}

export default CabinCrewDashboard
