import { createSlice } from '@reduxjs/toolkit'

// initialize flight info state
const initialState = {
	isLoading: false,
	columns: [],
	flightScheduleList: [],
	filterdFlightScheduleList: [],
	flightScheduleDetailsList: [],
	errorMsg: null,
	success: false,
	pagination: {},

	// ADD FLIGHT TO SHCEDULE
	firstPhaseValues: {
		selectedDayOrDate: {
			selectedDayOrDateType: 'days',
		},
	},
	selectedIndex: 0,
	aircraftTypeList: [],
	isAircraftTypeListLoading: false,
	aircraftList: [],
	isAircraftListLoading: false,
	dynamicAircraftListOption: [
		{
			restrictedArrLegIdList: {},
			aircraftList: [],
		},
	],
	secondPhaseValues: {
		legType: 'regular',
		legDepArr: [{ legField: { leg: null } }],
	},
}

// create reducer actions
const flightScheduleSlice = createSlice({
	name: 'flightSchedule',
	initialState,
	reducers: {
		setIsLoading: (state, action) => {
			state.isLoading = action.payload
		},
		setErrorMsg: (state, action) => {
			state.errorMsg = action.payload
		},
		setFlightScheduleList: (state, action) => {
			state.flightScheduleList = action.payload
		},
		setFilterdFlightScheduleList: (state, action) => {
			state.filterdFlightScheduleList = action.payload
		},
		setFlightScheduleDetailsList: (state, action) => {
			state.flightScheduleDetailsList = action.payload
		},
		setSuccess: (state, { payload }) => {
			state.success = payload
		},
		deleteData: (state, action) => {
			let Index = state.flightScheduleList?.findIndex((value) => value.id === action.payload)
			state.flightScheduleList.splice(Index, 1)
		},
		setPagination: (state, action) => {
			state.pagination = action.payload
		},
		setSelectedIndex: (state, action) => {
			state.selectedIndex = action.payload
		},
		setAircraftTypeList: (state, action) => {
			state.aircraftTypeList = action.payload
		},
		setIsAircraftTypeListLoading: (state, action) => {
			state.isAircraftTypeListLoading = action.payload
		},
		setAircraftList: (state, action) => {
			state.aircraftList = action.payload
		},
		setIsAircraftListLoading: (state, action) => {
			state.isAircraftListLoading = action.payload
		},
		setFirstPhaseValues: (state, action) => {
			state.firstPhaseValues = action.payload
		},
		setDynamicAircraftListOption: (state, action) => {
			state.dynamicAircraftListOption = action.payload
		},
		setSecondPhaseValues: (state, action) => {
			state.secondPhaseValues = action.payload
		},
	},
})

// export actions
export const {
	setPagination,
	setFilterdFlightScheduleList,
	setIsLoading,
	setErrorMsg,
	setFlightScheduleList,
	setFlightScheduleDetailsList,
	setSuccess,
	deleteData,
	setSelectedIndex,
	setAircraftTypeList,
	setIsAircraftTypeListLoading,
	setAircraftList,
	setIsAircraftListLoading,
	setFirstPhaseValues,
	setDynamicAircraftListOption,
	setSecondPhaseValues,
} = flightScheduleSlice.actions
export default flightScheduleSlice.reducer
