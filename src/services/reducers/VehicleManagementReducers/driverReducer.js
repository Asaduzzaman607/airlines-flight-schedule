import { createSlice } from '@reduxjs/toolkit'

// initialize state
const initialState = {
    isLoading: false,
    isLoadingAddUser: false,
    columns: [],
    driverList: [],
    errorMsg: null,
    success: false,
    pagination: {} 
}

// create reducer actions
const driverSlice = createSlice({
    name: 'driver',
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
        setDriverList: (state, action) => {
            state.driverList = action.payload
        },
        deletedriver: (state, action) => {
            let Index = state.driverList?.findIndex(value => value.id === action.payload)
            state.driverList.splice(Index, 1)
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
export const { setPagination, setIsLoading, setErrorMsg, setIsLoadingAddUser, setDriverList, setSuccess, deleteDriver } = driverSlice.actions
export default driverSlice.reducer