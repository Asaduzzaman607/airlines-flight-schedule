import axios from 'axios'
import dayjs from 'dayjs'

// import actions
import { showAlert, getErrorMsg } from '../actions/commonActions'

// import reducers
import { aircrafts, dailyFlights, dailySelectedFlight } from '../reducers/aircraftAssignReducer'

// import API config
import { FLIGHTINFO } from '../../config'

const sortFlights = (flights, sortBy) => {
	let array = [...flights]
	array.sort((a, b) => {
		if (sortBy === 'departureTime' || sortBy === 'arrivalTime') {
			let aTime, bTime
			aTime = a[sortBy] ? a[sortBy].split(':') : null
			bTime = b[sortBy] ? b[sortBy].split(':') : null

			if (aTime === null || bTime === null) {
				return 0
			}

			let a_isToday = a.isArrivalDateToday && a.isDepartDateToday
			let a_isPrevDay = a.isArrivalDateToday && !a.isDepartDateToday
			let a_isNextDay = !a.isArrivalDateToday && a.isDepartDateToday

			let b_isToday = b.isArrivalDateToday && b.isDepartDateToday
			let b_isPrevDay = b.isArrivalDateToday && !b.isDepartDateToday
			let b_isNextDay = !b.isArrivalDateToday && b.isDepartDateToday

			if (
				(a_isToday && b_isToday) ||
				(a_isPrevDay && b_isPrevDay) ||
				a_isNextDay ||
				b_isNextDay
			) {
				for (let i = 0; i < aTime.length; i++) {
					if (aTime[i] !== bTime[i]) {
						return aTime[i] - bTime[i]
					}
				}
			}

			if ((a_isToday || a_isNextDay) && b_isPrevDay) {
				return 1
			}

			if ((b_isToday || b_isNextDay) && a_isPrevDay) {
				return -1
			}
		}

		if (sortBy === 'flightNo') {
			const tempA = Number(a[sortBy].split(' ')[1])
			const tempB = Number(b[sortBy].split(' ')[1])

			if (tempA < tempB) return -1
			if (tempA > tempB) return 1
		} else {
			if (a[sortBy] < b[sortBy]) return -1
			if (a[sortBy] > b[sortBy]) return 1
		}
		return 0
	})
	return array
}

// GET DAY WISE FLIGHTS
const getDailyFlights = (params) => {
	return async (dispatch) => {
		// set loading to true
		dispatch(dailyFlights.setIsFlightsLoading(true))
		try {
			// get response from API
			const { data } = await axios.get(FLIGHTINFO.DAILY_FLIGHTS, { params })

			// check if response is valid and set to redux or set empty array
			dispatch(dailyFlights.setPreservedDailyFlights(data?.length ? data : []))
			dispatch(dailyFlights.setFlights(data?.length ? data : []))
			dispatch(dailyFlights.setRawFlights(data?.length ? data : []))
		} catch (err) {
			console.error(err)

			// get error msg, then show error alert
			const errMsg = getErrorMsg(err)
			showAlert('error', errMsg)
		} finally {
			// set loading to false
			dispatch(dailyFlights.setIsFlightsLoading(false))
		}
	}
}

// GET AIRCRAFT TYPE
const getAircraftType = () => {
	return async (dispatch) => {
		// set loading state to true
		dispatch(aircrafts.setIsAircraftTypeListLoading(true))

		try {
			// get aircraft type
			const {
				data: { model },
			} = await axios.get(FLIGHTINFO.GET_AIRCRAFT_TYPE)

			// transform model into antd select pattern
			const _model = model?.length
				? model.map((item) => ({
						id: item?.id ?? -1,
						label: item?.name ?? 'N/A',
						value: item?.id ?? -1,
				  }))
				: []

			// set aircraft list to redux
			dispatch(aircrafts.setAircraftTypeList(_model))
		} catch (err) {
			console.error(err)

			// get error msg, then show error alert
			const errMsg = getErrorMsg(err)
			showAlert('error', errMsg)
		} finally {
			// set loading state to false
			dispatch(aircrafts.setIsAircraftTypeListLoading(false))
		}
	}
}

// GET AIRCRAFT LIST BY AIRCRAFT TYPE
const getAircraftList = (params) => {
	return async (dispatch) => {
		// set loading state to true
		dispatch(aircrafts.setIsAircraftListLoading(true))
		try {
			// fetch data
			const { data } = await axios.get(FLIGHTINFO.GET_AIRCRAFT_LIST, { params })

			// set flightList to redux
			dispatch(aircrafts.setAircraftList(data?.length ? data : []))
		} catch (err) {
			console.error(err)

			// get error msg, then show error alert
			const errMsg = getErrorMsg(err)
			showAlert('error', errMsg)
		} finally {
			// set loading state to false
			dispatch(aircrafts.setIsAircraftListLoading(false))
		}
	}
}

// transform daily flights
const transformFlights = ({
	departureTime,
	departureLegName,
	arrivalTime,
	arrivalLegName,
	flights,
	isArrivalDateToday,
	isDepartDateToday,
}) => {
	let tempArray = []

	const _convertTimeToDate = (type, time, isToday) => {
		if (!time) {
			return null
		}
		if (type === 'nextDay' && !isToday) {
			return dayjs(time, 'HH:mm').add(1, 'day')
		}

		if (type === 'prevDay' && !isToday) {
			return dayjs(time, 'HH:mm').subtract(1, 'day')
		}
		return dayjs(time, 'HH:mm')
	}

	const _startTime = _convertTimeToDate('prevDay', departureTime, isDepartDateToday)
	const _endTime = _convertTimeToDate('nextDay', arrivalTime, isArrivalDateToday)

	for (let i = 0; i < flights.length; i++) {
		const _updatedFlight = {
			...flights[i],
			disabled: true,
		}

		const _currentDepatureTime = _convertTimeToDate(
			flights[i]?.isDepartDateToday ? 'today' : 'prevDay',
			flights[i]?.departureTime,
			flights[i]?.isDepartDateToday
		)
		const _currentArrivalTime = _convertTimeToDate(
			flights[i]?.isArrivalDateToday ? 'today' : 'nextDay',
			flights[i]?.arrivalTime,
			flights[i]?.isArrivalDateToday
		)

		const _prevArrived =
			_currentArrivalTime.isBefore(_startTime) &&
			flights[i]?.arrivalLegName === departureLegName &&
			flights[i]?.isDepartDateToday

		const _nextDepature =
			_currentDepatureTime.isAfter(_endTime) &&
			flights[i]?.departureLegName === arrivalLegName

		if (_prevArrived || _nextDepature || (!departureTime && !arrivalTime)) {
			_updatedFlight.disabled = false
		}

		tempArray.push(_updatedFlight)
	}
	return tempArray
}

// assign daily flights
const assignDailyFlight = (params, selectedDate) => {
	return async (dispatch) => {
		// set loader to true
		dispatch(dailyFlights.setIsAssignLoading(true))
		try {
			const { data } = await axios.post(FLIGHTINFO.ASSIGN_DAILY_FLIGHTS, params)

			// clear other data
			dispatch(aircrafts.setSelectedAircraftType(null))
			dispatch(aircrafts.setSelectedAircraft(null))
			dispatch(dailySelectedFlight.setSelectedFlights([]))

			// get daily flight list
			dispatch(getDailyFlights({ date: selectedDate }))

			// get updated aircraft list with updated assigned flights count
			dispatch(getAircraftList({ ids: '', date: selectedDate }))

			// show success message
			showAlert('success', data?.message ?? 'Created successfully.')
		} catch (err) {
			console.error(err)

			// get error msg, then show error alert
			const errMsg = getErrorMsg(err)
			showAlert('error', errMsg)
		} finally {
			// set loader to true
			dispatch(dailyFlights.setIsAssignLoading(false))
		}
	}
}

// get assigned flights by date and aircraft id
const getAssignedFlights = (params, selectedFlights) => {
	return async (dispatch, getState) => {
		try {
			// set loading
			// fetch data
			const { data } = await axios.get(FLIGHTINFO.GET_ASSIGNED_FLIGHTS, { params })

			const _selectedFlights = data?.length
				? data.map((item) => ({ ...item, isSelected: true }))
				: []

			const { flights: prevDailyFlights } = getState().aircraftAssign

			dispatch(dailySelectedFlight.setSelectedFlights(_selectedFlights))

			const filteredData = filterDataById(prevDailyFlights, _selectedFlights)
			dispatch(dailyFlights.setFlights(filteredData))
		} catch (err) {
			console.error(err)

			// get error msg, then show error alert
			const errMsg = getErrorMsg(err)
			showAlert('error', errMsg)
		} finally {
			// set loading to false
		}
	}
}

function filterDataById(data, selected) {
	return data.filter((item) => !selected.some((sel) => sel.id === item.id))
}

export {
	sortFlights,
	getDailyFlights,
	getAircraftType,
	getAircraftList,
	transformFlights,
	assignDailyFlight,
	getAssignedFlights,
}
