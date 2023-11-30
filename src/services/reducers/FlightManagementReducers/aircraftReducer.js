import { createSlice } from '@reduxjs/toolkit'

// initialize aircraft state
const initialState = {
    isLoading: false,
    isLoadingAddUser: false,
    columns: [],
    aircraftList: [],
    aircraftDetailsList: {},
    errorMsg: null,
    success: false,
    pagination: {},
}

// create reducer actions
const aircraftSlice = createSlice({
    name: 'aircraft',
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
        setAircraftList: (state, action) => {
            state.aircraftList = action.payload
        },
        deleteAircraftList: (state, action) => {
            let Index = state.aircraftList?.findIndex(value => value.id === action.payload)
            state.aircraftList.splice(Index, 1)
        },
        setAircraftDetails: (state, action) => {
            state.aircraftDetailsList = action.payload
        },
        setSuccess: (state, {payload}) => {
            state.success = payload
        },
        setPagination: (state, action) => {
            state.pagination = action.payload
        }
    }
})

// export actions
export const { setPagination, setIsLoading, setErrorMsg, setIsLoadingAddUser, setAircraftList, setAircraftDetails, setSuccess, deleteAircraftList } = aircraftSlice.actions
export default aircraftSlice.reducer