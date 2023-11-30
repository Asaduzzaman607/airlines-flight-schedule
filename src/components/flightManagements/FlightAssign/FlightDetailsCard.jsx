import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import dayjs from 'dayjs'

// import components
import { Button, Divider, Popconfirm } from 'antd'

// import icons
import { IoAirplane } from 'react-icons/io5'

// import actions
import { dailySelectedFlight, dailyFlights } from '../../../services/reducers/aircraftAssignReducer'
import { showAlert } from '../../../services/actions/commonActions'
import { getAssignedFlights } from '../../../services/actions/aircraftAssignAction'

const FlightDetailsCard = ({ flightDetails }) => {
	const {
		flightNo,
		departureLegName,
		arrivalLegName,
		departureTime,
		arrivalTime,
		permissibleAircrafts,
		scheduledAircraftTypeId,
		assignedAircraft,
		isSelected,
		disabled,
		isArrivalDateToday,
		assignedAircraftId,
		isDepartDateToday,
		id,
	} = flightDetails

	const [isConfirmMsgOpen, setIsConfirmMsgOpen] = useState(false)

	const { flights, selectedFlights, selectedDate, selectedAircraft, searchedId } = useSelector(
		(state) => state.aircraftAssign
	)

	const dispatch = useDispatch()

	// handle on select flight
	const handleOnSelectFlight = (selectedFlight) => {
		// check if selected flights are already 10 or not
		if (selectedFlights?.length === 10) {
			// show alert about max flight selection
			showAlert('warning', 'You have already selected maximum 10 flights.')
			return
		}

		const _updatedFlights = flights?.filter((flight) => flight.id !== selectedFlight?.id)
		const _selectedFlight = {
			...selectedFlight,
			isSelected: true,
		}

		dispatch(dailySelectedFlight.setSelectedFlights([...selectedFlights, _selectedFlight]))
		dispatch(dailyFlights.setFlights(_updatedFlights))
	}

	// check every leg pair
	const _checkEveryPair = (toCheckFlights) => {
		if (toCheckFlights?.length > 1) {
			let _conflictedFlights = ''
			let _temp = [toCheckFlights[0]]
			let toAddIntoDailyFlights = []
			for (let i = 1; i < toCheckFlights.length; i++) {
				const _last_valid_arrival_leg = _temp[_temp.length - 1]?.arrivalLegName
				const _next_departure_leg = toCheckFlights[i]?.departureLegName
				if (_last_valid_arrival_leg === _next_departure_leg) {
					_temp.push(toCheckFlights[i])
				} else {
					_conflictedFlights = _conflictedFlights.concat(
						_conflictedFlights && ', ',
						toCheckFlights[i]?.flightNo
					)
					const flight = {
						...toCheckFlights[i],
						isSelected: false,
					}
					toAddIntoDailyFlights.push(flight)
				}
			}

			// check if there are any conflicted flights
			if (_conflictedFlights?.length > 0) {
				// show alert
				showAlert('warning', _conflictedFlights + ' removed due to conflicts.')
			}

			return { updated: _temp, toAddIntoDailyFlights }
			// return _temp
		}
		return { updated: toCheckFlights, toAddIntoDailyFlights: [] }
	}

	// handle remove from selected flight
	const handleOnRemoveSelectedFlight = (selectedFlight) => {
		const _selectedFlight = {
			...selectedFlight,
			isSelected: false,
		}

		// filter out selected flight from selected flights
		const _updatedSelectedFlights = selectedFlights?.filter(
			(flight) => flight.id !== _selectedFlight?.id
		)

		const _filteredEveryLegPair = _checkEveryPair(_updatedSelectedFlights ?? [])
		const toAddIntoDailyFlights =
			_filteredEveryLegPair?.toAddIntoDailyFlights?.length > 0
				? _filteredEveryLegPair?.toAddIntoDailyFlights
				: []

		dispatch(dailySelectedFlight.setSelectedFlights(_filteredEveryLegPair?.updated))

		const _updatedFlights = [...flights, _selectedFlight, ...toAddIntoDailyFlights]

		dispatch(dailyFlights.setFlights(_updatedFlights))
	}

	// calculate duration between start time and end time
	const calculateDuration = (startTime, endTime) => {
		if (!startTime || !endTime) {
			return 'N/A'
		}
		const start = dayjs(startTime, 'HH:mm')
		const end = dayjs(endTime, 'HH:mm')
		let duration = end.diff(start, 'minute')

		if (duration < 0) {
			duration = 24 * 60 + duration
		}

		const hours = Math.floor(duration / 60)
		const minutes = duration % 60

		let result = ''
		if (hours > 0) {
			result += `${hours}h `
		}
		if (minutes > 0) {
			result += `${minutes}m`
		}

		return result.trim()
	}

	// handle update
	const _handleUpdate = (value) => {
		// check if the selected flights are empty then fetch flights from that aircraft
		if (!selectedFlights || selectedFlights?.length === 0) {
			dispatch(getAssignedFlights({ id: assignedAircraftId, date: selectedDate }, []))
		}

		// if no, then show alert
		if (selectedFlights?.length > 0) {
			setIsConfirmMsgOpen(value)
			return
		}
	}

	// handle onclick
	const _handleOnClick = (value) => {
		// check if selected flight is disabled, then do nothing, return
		if (disabled) {
			return
		}

		// check if the selected flight
		if (!assignedAircraft && !isSelected) {
			handleOnSelectFlight(flightDetails)
		}

		// check if flight is already selected to assign, then remove func will be enabled.
		if (isSelected) {
			handleOnRemoveSelectedFlight(flightDetails)
		}

		// check if the flight is already assigned, then go for update func.
		if (assignedAircraft) {
			_handleUpdate(value)
		}
	}

	return (
		<div
			className={`${
				assignedAircraft
					? 'bg-green-200 hover:bg-green-300'
					: isSelected
					? 'bg-blue-200 hover:bg-blue-300'
					: disabled
					? 'bg-slate-200 hover:bg-slate-300'
					: 'bg-amber-200 hover:bg-amber-300'
			} space-y-1 px-3 py-3 shadow rounded-md ${
				searchedId === id && 'border border-solid border-blue-500 drop-shadow animate-pulse'
			}`}
			id={id}
		>
			<div className={'flex justify-between items-center'}>
				<span className={'text-lg font-bold text-slate-600'}>{flightNo ?? 'N/A'}</span>
				<div
					className={`${
						assignedAircraft && 'px-2 py-0.5 rounded bg-green-600 text-white'
					}`}
				>
					{assignedAircraft ?? '-'}
				</div>
			</div>
			<Divider />
			<div className={'flex justify-between text-xs'}>
				<span>{'Departure'}</span>
				<span>{'Arrival'}</span>
			</div>
			<div className={'flex justify-between items-center font-semibold text-lg'}>
				<span>{departureLegName}</span>
				<div className={'flex space-x-2'}>
					<IoAirplane className={'text-slate-600'} />
				</div>
				<span>{arrivalLegName}</span>
			</div>
			<div className={'grid grid-cols-3 text-lg pb-2'}>
				<div className={'place-self-start relative pr-2'}>
					<span>{departureTime}</span>
					{!isDepartDateToday && (
						<span
							className={
								'absolute -bottom-2.5 left-0 text-[10px] font-medium text-red-500 leading-none px-1 py-0.5 bg-red-100 rounded-sm shadow'
							}
						>
							{'Prev day'}
						</span>
					)}
				</div>
				<div className={'place-self-center text-sm text-slate-600'}>
					{calculateDuration(departureTime, arrivalTime)}
				</div>
				<div className={'place-self-end relative pl-2'}>
					<span>{arrivalTime}</span>
					{!isArrivalDateToday && (
						<span
							className={
								'absolute -bottom-2.5 right-0 text-[10px] font-medium text-red-500 leading-none px-1 py-0.5 bg-red-100 rounded-sm shadow'
							}
						>
							{'Next day'}
						</span>
					)}
				</div>
			</div>
			<Divider />
			<div
				className={'flex justify-between'}
				// className={'flex justify-between items-center border border-solid'}
			>
				{permissibleAircrafts && permissibleAircrafts?.length > 0 && (
					<div className={`flex flex-wrap justify-start items-center gap-1`}>
						{permissibleAircrafts.map((item) => (
							<div key={item?.id}>
								<div
									className={`text-xs px-1 py-.5 rounded text-lime-700 border border-solid ${
										scheduledAircraftTypeId === item?.id
											? 'bg-lime-300 border-lime-600'
											: 'bg-lime-100 border-lime-400'
									}`}
								>
									{item?.label}
								</div>
							</div>
						))}
					</div>
				)}
				{selectedAircraft && isDepartDateToday && (
					<Popconfirm
						title={'Are you sure to update this flight?'}
						description={`This flight is already assigned to ${assignedAircraft}.`}
						open={isConfirmMsgOpen}
						onOpenChange={_handleOnClick}
						okText={'Continue'}
						cancelText={'Cancel'}
						onCancel={() => setIsConfirmMsgOpen(false)}
						onConfirm={() => handleOnSelectFlight(flightDetails)}
					>
						<Button
							type={isSelected ? 'primary' : 'default'}
							size={'middle'}
							disabled={disabled}
						>
							{isSelected ? 'Remove' : assignedAircraft ? 'Update' : 'Select'}
						</Button>
					</Popconfirm>
				)}
			</div>
		</div>
	)
}

export default FlightDetailsCard
