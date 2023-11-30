import { createSlice } from '@reduxjs/toolkit'

// initialize flight info state
const initialState = {
    isLoading: false,
    isLoadingAddUser: false,
    columns: [],
    flightInfoList: [],
    flightInfoDetailsList: [],
    errorMsg: null,
    success: false,
    pagination: {},
}

// create reducer actions
const flightInfoSlice = createSlice({
    name: 'flightinfo',
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
        setFlightInfoList: (state, action) => {
            state.flightInfoList = action.payload
        },
        setFlightInfoDetailsList: (state, action) => {
            state.flightInfoDetailsList = action.payload
        },
        setSuccess: (state, {payload}) => {
            state.success = payload
        },
        deleteData: (state, action) => {
            let Index = state.flightInfoList?.findIndex(value => value.id === action.payload)
            state.flightInfoList.splice(Index, 1)
        },
        setPagination: (state, action) => {
            state.pagination = action.payload
        }
    }
})

// export actions
export const { setPagination, setIsLoading, setErrorMsg, setIsLoadingAddUser, setFlightInfoList, setFlightInfoDetailsList, setSuccess, deleteData } = flightInfoSlice.actions
export default flightInfoSlice.reducer