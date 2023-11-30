import { createSlice } from '@reduxjs/toolkit'

// initialize journey log state
const initialState = {
    isLoading: false,
    columns: [],
    FlightStatusList: [],
    errorMsg: null,
    success: false,
    pagination: {},
    isEditable: true,
    search_date: null,
}

// create reducer actions
const flightStatusSlice = createSlice({
    name: 'flightStatus',
    initialState,
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setErrorMsg: (state, action) => {
            state.errorMsg = action.payload
        },
        setFlightStatusList: (state, action) => {
            state.FlightStatusList = action.payload
        },
        setSuccess: (state, {payload}) => {
            state.success = payload
        },
        setIsEditable: (state, {payload}) => {
            state.isEditable = payload
        },
        setPagination: (state, action) => {
            state.pagination = action.payload
        },
        setCurrentDate: (state, action) => {
            state.search_date = action.payload
        }
    }
})

// export actions
export const { setPagination, setIsLoading, setErrorMsg, setFlightStatusList, setSuccess, setIsEditable, setCurrentDate } = flightStatusSlice.actions
export default flightStatusSlice.reducer