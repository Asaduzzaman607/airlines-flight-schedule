import { createSlice } from '@reduxjs/toolkit'

// initialize flight location state
const initialState = {
    isLoading: false,
    isLoadingAddUser: false,
    columns: [],
    flightLocationList: [],
    flightLocationDetails: {},
    errorMsg: null,
    success: false,
    pagination: {},
}

// create reducer actions
const flightLocationSlice = createSlice({
    name: 'flightlocation',
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
        setFlightLocationList: (state, action) => {
            state.flightLocationList = action.payload
        },
        setFlightLocationDetails: (state, action) => {
            state.flightLocationDetails = action.payload
        },
        setSuccess: (state, {payload}) => {
            state.success = payload
        },
        deleteData: (state, action) => {
            let Index = state.flightLocationList?.findIndex(value => value.id === action.payload)
            state.flightLocationList.splice(Index, 1)
        },
        setPagination: (state, action) => {
            state.pagination = action.payload
        }
    }
})

// export actions
export const { setPagination, setIsLoading, setErrorMsg, setIsLoadingAddUser, setFlightLocationList, setFlightLocationDetails, setSuccess, deleteData } = flightLocationSlice.actions
export default flightLocationSlice.reducer