import { createSlice, current } from '@reduxjs/toolkit'

// import actions
import { sortFlights, transformFlights } from '../actions/aircraftAssignAction'

const initialState = {
	flights: [],
	rawFlights: [],
	isFlightsLoading: false,
	selectedFlights: [],
	isSelectedFlightsLoading: false,
	preservedDailyFlights: [],
	selectedSortOption: 'flightNo',
	aircraftTypeList: [],
	isAircraftTypeListLoading: false,
	selectedAircraftType: null,
	aircraftList: [],
	isAircraftListLoading: false,
	selectedAircraft: null,
	selectedDate: null,
	isAssignLoading: false,
	searchedId: null,
}

const aircraftAssignSlice = createSlice({
	name: 'aircraftAssign',
	initialState,
	reducers: {
		setFlights: (state, action) => {
			// get current state of selected flights and selected sort option
			const { selectedFlights, selectedSortOption } = current(state)

			// sort by diparture time selected flights
			const _selectedFlights = sortFlights(selectedFlights, 'departureTime')

			// transform flights for disabled true/false
			const _transformFlights = transformFlights({
				flights: action.payload,
				departureTime:
					_selectedFlights?.length > 0 ? _selectedFlights[0]?.departureTime : null,
				departureLegName:
					_selectedFlights?.length > 0 ? _selectedFlights[0]?.departureLegName : null,
				arrivalTime:
					_selectedFlights?.length > 0
						? _selectedFlights[_selectedFlights.length - 1]?.arrivalTime
						: null,
				arrivalLegName:
					_selectedFlights?.length > 0
						? _selectedFlights[_selectedFlights.length - 1]?.arrivalLegName
						: null,
				isArrivalDateToday:
					_selectedFlights?.length > 0
						? _selectedFlights[_selectedFlights.length - 1]?.isArrivalDateToday
						: null,
				isDepartDateToday:
					_selectedFlights?.length > 0 ? _selectedFlights[0]?.isDepartDateToday : null,
			})

			// sort transformed flights accordingly
			const _sortedFlights = sortFlights(_transformFlights, selectedSortOption)

			// set sorted flights
			state.flights = _sortedFlights
		},
		setIsFlightsLoading: (state, action) => {
			state.isFlightsLoading = action.payload
		},
		setSelectedFlights: (state, action) => {
			// sort selected flights accordingly
			const _sortedSelectedFlights = sortFlights(action.payload, 'departureTime')

			// set to state selected flights
			state.selectedFlights = _sortedSelectedFlights
		},
		setIsSelectedFlightsLoading: (state, action) => {
			state.isSelectedFlightsLoading = action.payload
		},
		setPreservedDailyFlights: (state, action) => {
			state.preservedDailyFlights = action.payload
		},
		setSelectedSortOption: (state, action) => {
			state.selectedSortOption = action.payload
		},
		setAircraftTypeList: (state, action) => {
			state.aircraftTypeList = action.payload
		},
		setIsAircraftTypeListLoading: (state, action) => {
			state.isAircraftTypeListLoading = action.payload
		},
		setSelectedAircraftType: (state, action) => {
			state.selectedAircraftType = action.payload
		},
		setAircraftList: (state, action) => {
			state.aircraftList = action.payload
		},
		setIsAircraftListLoading: (state, action) => {
			state.isAircraftListLoading = action.payload
		},
		setSelectedAircraft: (state, action) => {
			state.selectedAircraft = action.payload
		},
		setSelectedDate: (state, action) => {
			state.selectedDate = action.payload
		},
		setIsAssignLoading: (state, action) => {
			state.isAssignLoading = action.payload
		},
		setSearchedId: (state, action) => {
			state.searchedId = action.payload
		},
		setRawFlights: (state, action) => {
			state.rawFlights = action.payload
		},
	},
})

const {
	setFlights,
	setIsFlightsLoading,
	setSelectedFlights,
	setIsSelectedFlightsLoading,
	setPreservedDailyFlights,
	setSelectedSortOption,
	setAircraftTypeList,
	setIsAircraftTypeListLoading,
	setSelectedAircraftType,
	setAircraftList,
	setIsAircraftListLoading,
	setSelectedAircraft,
	setSelectedDate,
	setIsAssignLoading,
	setSearchedId,
	setRawFlights,
} = aircraftAssignSlice.actions

const dailyFlights = {
	setFlights,
	setIsFlightsLoading,
	setPreservedDailyFlights,
	setSelectedSortOption,
	setSelectedDate,
	setIsAssignLoading,
	setSearchedId,
	setRawFlights,
}

const dailySelectedFlight = {
	setSelectedFlights,
	setIsSelectedFlightsLoading,
}

const aircrafts = {
	setAircraftTypeList,
	setIsAircraftTypeListLoading,
	setSelectedAircraftType,
	setAircraftList,
	setIsAircraftListLoading,
	setSelectedAircraft,
}

export { dailyFlights, dailySelectedFlight, aircrafts }

export default aircraftAssignSlice.reducer
