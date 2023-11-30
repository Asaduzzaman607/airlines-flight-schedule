import { createSlice } from '@reduxjs/toolkit'

// initialize airport state
const initialState = {
    isLoading: false,
    isLoadingAddUser: false,
    columns: [],
    airportList: [],
    airportDetails: {},
    errorMsg: null,
    success: false,
    pagination: {},
}

// create reducer actions
const airportSlice = createSlice({
    name: 'airport',
    initialState,
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setErrorMsg: (state, action) => {
            state.errorMsg = action.payload
        },
        setIsLoadingAddUser: (state, action) => {
            state.isLoadingAddUser = action.payload
        },
        setAirportList: (state, action) => {
            state.airportList = action.payload
        },
        setAirportDetails: (state, action) => {
            state.airportDetails = action.payload
        },
        setSuccess: (state, {payload}) => {
            state.success = payload
        },
        deleteData: (state, action) => {
            let Index = state.airportList?.findIndex(value => value.id === action.payload)
            state.airportList.splice(Index, 1)
        },
        setPagination: (state, action) => {
            state.pagination = action.payload
        }
    }
})

// export actions
export const { setPagination, setIsLoading, setErrorMsg, setIsLoadingAddUser, setAirportList, setAirportDetails, setSuccess, deleteData } = airportSlice.actions
export default airportSlice.reducer