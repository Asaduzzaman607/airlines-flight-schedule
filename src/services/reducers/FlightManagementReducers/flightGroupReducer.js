import { createSlice } from '@reduxjs/toolkit'

// initialize flight group state
const initialState = {
    isLoading: false,
    isLoadingAddUser: false,
    columns: [],
    flightGroupList: [],
    flightGroupDetails: {},
    errorMsg: null,
    success: false,
    pagination: {}
}

// create reducer actions
const flightGroupSlice = createSlice({
    name: 'flightgroup',
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
        setFlightGroupList: (state, action) => {
            state.flightGroupList = action.payload
        },
        setFlightGroupDetails: (state, action) => {
            state.flightGroupDetails = action.payload
        },
        setSuccess: (state, {payload}) => {
            state.success = payload
        },
        deleteData: (state, action) => {
            let Index = state.flightGroupList?.findIndex(value => value.id === action.payload)
            state.flightGroupList.splice(Index, 1)
        },
        setPagination: (state, action) => {
            state.pagination = action.payload
        }
    }
})

// export actions
export const { setIsLoading, setErrorMsg, setIsLoadingAddUser, setFlightGroupList, setFlightGroupDetails, setSuccess, deleteData, setPagination } = flightGroupSlice.actions
export default flightGroupSlice.reducer