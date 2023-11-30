import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'

// import components
import { Select, DatePicker, Button, Space } from 'antd'

// import actions
import { sortFlights, getDailyFlights } from '../../../services/actions/aircraftAssignAction'
import {
	dailyFlights,
	dailySelectedFlight,
	aircrafts,
} from '../../../services/reducers/aircraftAssignReducer'

const DailyFlightSortAndDate = () => {
	const [selectedDate, setSelectedDate] = useState(null)

	// data from redux
	const { flights, selectedSortOption, selectedFlights } = useSelector(
		(state) => state.aircraftAssign
	)

	const dispatch = useDispatch()

	// get daily flights initially
	useEffect(() => {
		// generate next day, then set to redux store
		const _nextDay = dayjs().add(1, 'day').format('YYYY-MM-DD')
		setSelectedDate(_nextDay)

		// dispatch date
		dispatch(dailyFlights.setSelectedDate(_nextDay))

		// convert date into normal format from dayjs object, then get daily flights
		dispatch(getDailyFlights({ date: _nextDay }))
	}, [dispatch])

	// handle on change sort by
	const _handleSortBy = (value) => {
		// dispatch sort option to redux
		dispatch(dailyFlights.setSelectedSortOption(value))

		// sort flights and dispatch to redux
		const _localSortedFlights = sortFlights(flights ?? [], value)
		dispatch(dailyFlights.setFlights(_localSortedFlights))

		// check if selectedFlights have flights
		// sort selected flights and dispatch to redux
		const _selectedFlights = sortFlights(selectedFlights ?? [], value)
		dispatch(dailySelectedFlight.setSelectedFlights(_selectedFlights))
	}

	// handle getFlight
	const _getFlight = () => {
		// clear selected flights if there are any
		if (selectedFlights || selectedFlights.length > 0) {
			dispatch(dailySelectedFlight.setSelectedFlights([]))
			dispatch(aircrafts.setSelectedAircraftType(null))
			dispatch(aircrafts.setSelectedAircraft(null))
		}

		// dispatch selected date
		dispatch(
			dailyFlights.setSelectedDate(
				selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : null
			)
		)

		// convert date into normal format from dayjs object, then get daily flights
		dispatch(
			getDailyFlights({ date: selectedDate && dayjs(selectedDate).format('YYYY-MM-DD') })
		)
	}

	return (
		<div
			className={'grid grid-cols-1 lg:grid-cols-2 gap-1 z-10 bg-blue-100 p-1 rounded shadow'}
		>
			<Select
				options={sortByOptions}
				style={{ width: '100%' }}
				showSearch={true}
				placeholder={'Select to sort by'}
				filterOption={(input, option) =>
					(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
				}
				onChange={_handleSortBy}
				allowClear={false}
				value={selectedSortOption}
			/>
			<Space.Compact className={'w-full'}>
				<DatePicker
					format={'DD-MMM-YYYY'}
					disabledDate={(current) =>
						current && current < dayjs().add(-1, 'd').endOf('day')
					}
					value={selectedDate && dayjs(selectedDate)}
					onChange={(_, dateString) => setSelectedDate(dateString)}
					allowClear={false}
					style={{ width: 'calc(100% - 76px)' }}
					placeholder={'Select a date'}
				/>
				<Button type={'primary'} onClick={_getFlight}>
					{'Search'}
				</Button>
			</Space.Compact>
		</div>
	)
}

const sortByOptions = [
	{
		id: 1,
		label: 'Flight No',
		value: 'flightNo',
	},
	{
		id: 2,
		label: 'Departure Time',
		value: 'departureTime',
	},
	// will enable later
	// {
	// 	id: 3,
	// 	label: 'Arrival Time',
	// 	value: 'arrivalTime',
	// },
	{
		id: 4,
		label: 'Departure Place',
		value: 'departureLegName',
	},
	{
		id: 5,
		label: 'Arrival Place',
		value: 'arrivalLegName',
	},
	{
		id: 6,
		label: 'Assigned Aircraft',
		value: 'assignedAircraft',
	},
]

export default DailyFlightSortAndDate
