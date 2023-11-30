import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// import components
import { DatePicker, Input, Select, Space } from 'antd'
import { CustomSelectBox } from '../commonComponents'
import { CustomDateRangePicker } from './CustomFormField'

// import reducer
import { setSearchBlockValueToReducer } from '../../services/reducers/CrewManagementReducers/employeeLeaveReducer'
import { setCurrentDate as setCurrentDateFlight, setFlightStatusList } from '../../services/reducers/FlightManagementReducers/flightStatusReducer'
import {
	setCurrentDate as setCurrentDateJourneyLog,
	setJourneyLogList,
} from '../../services/reducers/JourneyLog/journeyLogReducer'

const { Search } = Input

// type means crew type
// items format will be items={a: [], b: [], ...}
const SearchBlock = ({
	action,
	searchableColumnLists = [],
	type = null,
	aircraftTypePermission = [],
	from = '',
	items = null,
}) => {
	const [columnName, setColumnName] = useState({})
	const [searchHandlerValue, setSearchHandlerValue] = useState('')
	const [typeHandlerValue, setTypeHandlerValue] = useState('')

	// initialize dispatch func.
	const dispatch = useDispatch()

	// get value from store
	const { stored_SearchBlock_Value } = useSelector((state) => state.employeeLeave)

	// select column haandler
	const _SelectColumnHandler = (value) => {
		setColumnName(value)
	}

	// date picker search handler
	const _DateSearchHandler = (value) => {
		// store data from data search handler
		dispatch(
			setSearchBlockValueToReducer({
				...stored_SearchBlock_Value,
				dataSearchValue: value?.format('YYYY-MM-DD') ?? '',
				typeSearchValue: null,
				inputFieldValue: null,
				columnName: columnName?.value,
			})
		)

		let newValue = {
			value: value?.format('YYYY-MM-DD') ?? '',
			columnName: columnName?.value,
			page: 0,
			stored_SearchBlock_Value,
		}
		dispatch(action(newValue))
	}

	// Date range picker search handler
	const _dateRangeSearchHandler = (_, dateStrings) => {
		const currentDate = dayjs().format('YYYY-MM-DD')
		const payload = {
			fromDate: dateStrings?.[0] ? dateStrings?.[0] : currentDate,
			toDate: dateStrings?.[1] ? dateStrings?.[1] : currentDate,
		}

		if (from === 'journeyLog') {
			dispatch(setJourneyLogList([]))
			dispatch(setCurrentDateJourneyLog(payload))
			dispatch(action(payload))
			return
		}

		if (from === 'flight_status') {
			dispatch(setFlightStatusList([]))
			dispatch(setCurrentDateFlight(payload))
			dispatch(action(payload))
			return
		}
		// store data from data search handler
		dispatch(
			setSearchBlockValueToReducer({
				...stored_SearchBlock_Value,
				dataSearchValue: {
					startDate: dateStrings?.[0],
					endDate: dateStrings?.[1],
				},
				typeSearchValue: null,
				inputFieldValue: null,
				columnName: columnName?.value,
			})
		)

		let newValue = {
			value: {
				startDate: dateStrings?.[0],
				endDate: dateStrings?.[1],
			},
			columnName: columnName?.value,
			page: 0,
			stored_SearchBlock_Value,
		}
		dispatch(action(newValue))
	}

	// select type search handler
	const _TypeSearchHandler = (value) => {
		// store data from type search handler
		dispatch(
			setSearchBlockValueToReducer({
				...stored_SearchBlock_Value,
				typeSearchValue: value,
				dataSearchValue: null,
				inputFieldValue: null,
				columnName: columnName?.value,
			})
		)

		let newValue
		if (from === 'EmployeeLeave') {
			newValue = {
				employeeName: searchHandlerValue,
				leaveType: value,
				page: 0,
				aircraftTypePermission,
				stored_SearchBlock_Value,
			}
		} else {
			newValue = {
				value,
				type: value,
				columnName: columnName?.value,
				page: 0,
				stored_SearchBlock_Value,
			}
		}
		setTypeHandlerValue(value)
		dispatch(action(newValue))
	}

	// search button action
	const onSearch = (value) => {
		// Check value is Empty or Not
		value = value?.trim()

		// store data from onsearch method
		dispatch(
			setSearchBlockValueToReducer({
				...stored_SearchBlock_Value,
				inputFieldValue: value,
				typeSearchValue: null,
				dataSearchValue: null,
				columnName: columnName?.value,
			})
		)

		let newValue
		if (from === 'EmployeeLeave') {
			newValue = {
				employeeName: value,
				leaveType: typeHandlerValue,
				aircraftTypePermission,
				page: 0,
				stored_SearchBlock_Value,
			}
		} else if (type) {
			newValue = {
				value: value.trim(),
				columnName: columnName?.value,
				page: 0,
				crewType: type._crewType,
				aircraftType: type._aircraftType,
				stored_SearchBlock_Value,
			}
		} else {
			newValue = {
				value: value.trim(),
				columnName: columnName?.value,
				page: 0,
				aircraftTypePermission,
				stored_SearchBlock_Value,
			}
		}
		setSearchHandlerValue(value)
		dispatch(action(newValue))
	}

	// onChange Handler for get default table data
	const InputFieldOnchangeHandler = (e) => {
		// console.log(e.target.value,'from onchange')
		if (e.target.value === '') {
			// store data from onchange handler
			dispatch(
				setSearchBlockValueToReducer({
					...stored_SearchBlock_Value,
					inputFieldValue: e.target.value,
					typeSearchValue: null,
					dataSearchValue: null,
					columnName: columnName?.value,
				})
			)

			const newValue = {
				value: e.target.value,
				columnName: columnName?.value,
				page: 0,
				aircraftTypePermission,
				stored_SearchBlock_Value,
			}

			// dispatch action
			dispatch(action(newValue))
		}
	}

	// Date Range PreSets
	const rangePresets = [
		{
			label: 'Last 7 Days',
			value: [dayjs().subtract(7, 'd'), dayjs()],
		},
		{
			label: 'Last 14 Days',
			value: [dayjs().subtract(14, 'd'), dayjs()],
		},
		{
			label: 'Last 30 Days',
			value: [dayjs().subtract(30, 'd'), dayjs()],
		},
		{
			label: 'Last 1 Years',
			value: [dayjs().subtract(365, 'd'), dayjs()],
		},
	]

	useEffect(() => {
		setColumnName(searchableColumnLists?.[0])
	}, [])

	return (
		<div className='flex'>
			{searchableColumnLists?.length > 0 && (
				<div className='pr-2 w-50'>
					<Select
						labelInValue
						placeholder={'Select Search Column Name'}
						style={{ width: '100%', minWidth: '150px' }}
						onChange={_SelectColumnHandler}
						defaultValue={searchableColumnLists?.[0]}
					>
						{searchableColumnLists?.map((item) => (
							<Select.Option value={item.value} key={item.id}>
								{item.label}
							</Select.Option>
						))}
					</Select>
				</div>
			)}

			{columnName?.value === 'flightDate' ||
				columnName?.value === 'date' ||
				columnName?.value === 'startDate' ||
				columnName?.value === 'sentDate' ||
				columnName?.value === 'approvalDate' ||
				columnName?.value === 'endDate' ? (
				<div className='pb-4'>
					<DatePicker
						allowClear={
							from === 'journeyLog' || from === 'flight_status' ? false : true
						}
						format={'YYYY-MM-DD'}
						defaultValue={
							from === 'journeyLog' || from === 'flight_status' ? dayjs() : null
						}
						onChange={_DateSearchHandler}
						placeholder='Select date for search'
						className=' w-52'
					/>
				</div>
			) : columnName?.value === 'dateRange' ||
				from === 'journeyLog' ||
				from === 'flight_status' ? (
				<div className={'mb-4'}>
					<CustomDateRangePicker
						defaultValue={
							from === 'journeyLog' || from === 'flight_status' ? [dayjs(), dayjs()] : null
						}
						rangePresets={rangePresets}
						onChange={_dateRangeSearchHandler}
					/>
				</div>
			) : columnName?.value?.toLowerCase()?.includes('type') ? (
				<div className={'mb-4'}>
					<CustomSelectBox
						itemList={items?.[columnName?.value] ?? []}
						label={'name'}
						dataIndex={'value'}
						mode={'single'}
						tagRender={null}
						placeholder={`Select ${columnName?.label}`}
						onChange={_TypeSearchHandler}
					/>
				</div>
			) : (
				<div className='pb-4'>
					<Space>
						<Search
							title={`Search by ${columnName?.label ?? 'Name'}`}
							className={' border-l-0'}
							placeholder={`${columnName ? `Search by ${columnName?.label}` : 'Search by Name'
								}`}
							onSearch={onSearch}
							onChange={InputFieldOnchangeHandler}
							enterButton
						/>
					</Space>
				</div>
			)}

			{from === 'EmployeeLeave' && (
				<div className='mb-4 ml-4'>
					<Select
						placeholder='Select Leave Type'
						allowClear
						style={{ width: '100%', minWidth: '217px' }}
						onChange={_TypeSearchHandler}
					>
						<Select.Option value={'EARNED_LEAVE'}>{'EARNED LEAVE'}</Select.Option>
						<Select.Option value={'SICK_LEAVE'}>{'SICK LEAVE'}</Select.Option>
						<Select.Option value={'CASUAL_LEAVE'}>{'CASUAL LEAVE'}</Select.Option>
						<Select.Option value={'MATERNITY_LEAVE'}>{'MATERNITY LEAVE'}</Select.Option>
						<Select.Option value={'PARENTAL_LEAVE'}>{'PARENTAL LEAVE'}</Select.Option>
						<Select.Option value={'COMPENSATORY_LEAVE'}>
							{'COMPENSATORY LEAVE'}
						</Select.Option>
					</Select>
				</div>
			)}
		</div>
	)
}

export default SearchBlock
