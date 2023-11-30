import { createSlice } from '@reduxjs/toolkit'

// initialize caab info state
const initialState = {
	isLoading: false,
	columns: [],
	caabList: [],
	filterdCaabList: [],
	caabDetailsList: [],
	errorMsg: null,
	success: false,
	pagination: {},
	crewType: '',
	cockpitCrewType: '',
	cabinCrewType: '',
	idNo: '',
	licenceno: '',
	activeStatus: false,
	status: [],
	activeTab: 'active',
}

// create reducer actions
const caabSlice = createSlice({
	name: 'caab',
	initialState,
	reducers: {
		setIsLoading: (state, action) => {
			state.isLoading = action.payload
		},
		setStatus: (state, action) => {
			state.status = action.payload
		},
		setActiveStatus: (state, action) => {
			state.activeStatus = action.payload
		},
		setErrorMsg: (state, action) => {
			state.errorMsg = action.payload
		},
		setCaabList: (state, action) => {
			state.caabList = action.payload
		},
		setFilterdCaabList: (state, action) => {
			state.filterdCaabList = action.payload
		},
		setCaabDetailsList: (state, action) => {
			state.caabDetailsList = action.payload
		},
		setCrewType: (state, action) => {
			state.crewType = action.payload
		},
		setCockpitCrewType: (state, action) => {
			state.cockpitCrewType = action.payload
		},
		setCabinCrewType: (state, action) => {
			state.cabinCrewType = action.payload
		},
		setLicenceno: (state, action) => {
			state.licenceno = action.payload
		},
		setIdNo: (state, action) => {
			state.idNo = action.payload
		},
		setSuccess: (state, { payload }) => {
			state.success = payload
		},
		deleteData: (state, action) => {
			let Index = state.caabList?.findIndex((value) => value.id === action.payload)
			state.caabList.splice(Index, 1)
		},
		setPagination: (state, action) => {
			state.pagination = action.payload
		},
		setActiveTab: (state, action) => {
			state.activeTab = action.payload
		},
	},
})

// export actions
export const {
	setIsActive,
	licenceno,
	idNo,
	setCrewType,
	setCockpitCrewType,
	setCabinCrewType,
	setLicenceno,
	setIdNo,
	crewType,
	cockpitCrewType,
	cabinCrewType,
	setPagination,
	setFilterdCaabList,
	setIsLoading,
	setErrorMsg,
	setCaabList,
	setCaabDetailsList,
	setSuccess,
	deleteData,
	setActiveStatus,
	setStatus,
	setActiveTab,
} = caabSlice.actions
export default caabSlice.reducer
