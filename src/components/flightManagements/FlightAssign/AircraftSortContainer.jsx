import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// import components
import { Select, Button, Space } from 'antd'

// import actions
import {
	getAircraftType,
	getAircraftList,
	assignDailyFlight,
	getAssignedFlights,
} from '../../../services/actions/aircraftAssignAction'
import {
	aircrafts,
	dailyFlights,
	dailySelectedFlight,
} from '../../../services/reducers/aircraftAssignReducer'
import { showAlert } from '../../../services/actions/commonActions'

const AircraftSortContainer = () => {
	const {
		aircraftTypeList,
		isAircraftTypeListLoading,
		selectedAircraftType,
		aircraftList,
		isAircraftListLoading,
		selectedAircraft,
		selectedFlights,
		isAssignLoading,
		selectedDate,
		flights,
	} = useSelector((state) => state.aircraftAssign)

	const dispatch = useDispatch()

	// clean up everything while unmount
	useEffect(() => {
		return () => {
			dispatch(dailySelectedFlight.setSelectedFlights([]))
			dispatch(aircrafts.setSelectedAircraft(null))
			dispatch(aircrafts.setSelectedAircraftType(null))
		}
	}, [dispatch])

	// init state
	useEffect(() => {
		dispatch(getAircraftType())
		if (selectedDate) {
			dispatch(getAircraftList({ ids: '', date: selectedDate }))
		}
	}, [dispatch, selectedDate])

	// handle aircraft list when selected aircraft type has updated
	useEffect(() => {
		if (selectedDate) {
			dispatch(getAircraftList({ ids: selectedAircraftType ?? '', date: selectedDate }))
		}
	}, [selectedAircraftType, dispatch, selectedDate])

	// handle selected flights assign
	const _handleSelectedFlightsAssign = () => {
		// check if there are no aircraft selected yet
		if (selectedFlights?.length === 0 || !selectedFlights) {
			showAlert('warning', 'Please select flights to assign.')
			return
		}

		// check if selectedAircraftType is not selected, then show alert
		if (!selectedAircraftType || !selectedAircraft) {
			showAlert('warning', 'Please select your aircraft type and aircraft first.')
			return
		}

		// create params object with desired params, then dispatch for assign daily flights
		const params = {
			aircraftId: selectedAircraft,
			flights: selectedFlights.map((item) => item.id),
			legs: selectedFlights.map((item) => item.legId),
			date: selectedDate,
		}

		dispatch(assignDailyFlight(params, selectedDate))
	}

	// handle aircraft type change
	const _handleAircraftTypeChange = (value) => {
		// clear selected aircraft list
		_clearSelectedAircraftList()

		// clear if there is any selected aircraft
		dispatch(aircrafts.setSelectedAircraft(null))

		// dispatch selected aircraft type
		dispatch(aircrafts.setSelectedAircraftType(value))
	}

	// handle aircraft change
	const _handleAircraftChange = (value) => {
		// clear selected aircraft list
		_clearSelectedAircraftList()

		// dispatch selected aircraft
		dispatch(aircrafts.setSelectedAircraft(value))

		// select aircraft type
		const _aircraftTypeId = aircraftList.find(
			(aircraft) =>
				aircraft.options?.length > 0 &&
				aircraft.options?.length > 0 &&
				aircraft.options.find((item) => item?.value === value)
		)?.aircraftTypeId

		dispatch(aircrafts.setSelectedAircraftType(_aircraftTypeId ?? null))

		// check if value and date is valid then fetch assigned flights
		if (selectedDate && value) {
			dispatch(getAssignedFlights({ id: value, date: selectedDate }, selectedFlights))
		}
	}

	// clear aircraft list while aircraft type or aircraft has updated
	const _clearSelectedAircraftList = () => {
		// clear selected flight list
		dispatch(dailySelectedFlight.setSelectedFlights([]))

		// unselect selected flights
		const _unSelectSelectedFlights =
			selectedFlights?.length > 0
				? selectedFlights.map((item) => ({
						...item,
						isSelected: false,
				  }))
				: []

		// update flight list
		dispatch(dailyFlights.setFlights([..._unSelectSelectedFlights, ...flights]))
	}

	return (
		<div className={`z-10 bg-blue-100 p-1 rounded shadow`}>
			<Space.Compact className={'w-full'}>
				<Select
					style={{ width: 'calc(50% - 74px)' }}
					showSearch={true}
					placeholder={'Select aircraft type'}
					options={aircraftTypeList}
					allowClear={true}
					filterOption={(input, option) =>
						(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
					}
					loading={isAircraftTypeListLoading}
					onChange={_handleAircraftTypeChange}
					value={selectedAircraftType}
					onClear={() => {
						dispatch(aircrafts.setSelectedAircraftType(null))
						_clearSelectedAircraftList()
					}}
				/>
				<Select
					style={{ width: 'calc(50% - 0px)' }}
					showSearch={true}
					placeholder={'Select aircraft'}
					options={aircraftList}
					allowClear={true}
					filterOption={(input, option) =>
						(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
					}
					loading={isAircraftListLoading}
					onChange={_handleAircraftChange}
					value={selectedAircraft}
					onClear={() => {
						dispatch(aircrafts.setSelectedAircraft(null))
						_clearSelectedAircraftList()
					}}
				/>
				<Button
					type={'primary'}
					onClick={_handleSelectedFlightsAssign}
					loading={isAssignLoading}
				>
					{'Assign'}
				</Button>
			</Space.Compact>
		</div>
	)
}

export default AircraftSortContainer
