import { createSlice } from '@reduxjs/toolkit'

// initialize aircraft type state
const initialState = {
    isLoading: false,
    isLoadingAddUser: false,
    columns: [],
    aircraftTypeList: [],
    aircraftTypeDetailsList: {},
    errorMsg: null,
    success: false,
    pagination: {}
}

// create reducer actions
const aircraftTypeSlice = createSlice({
    name: 'aircrafttype',
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
        setAircraftTypeList: (state, action) => {
            state.aircraftTypeList = action.payload
        },
        deleteData: (state, action) => {
            let Index = state.aircraftTypeList?.findIndex(value => value.id === action.payload)
            state.aircraftTypeList.splice(Index, 1)
        },
        setAircraftTypeDetails: (state, action) => {
            state.aircraftTypeDetailsList = action.payload
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
export const { setIsLoading, setErrorMsg, setIsLoadingAddUser, setAircraftTypeList, setAircraftTypeDetails, setSuccess, deleteData, setPagination } = aircraftTypeSlice.actions
export default aircraftTypeSlice.reducer