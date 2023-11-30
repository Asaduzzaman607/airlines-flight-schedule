import { createSlice } from '@reduxjs/toolkit'

// initialize employeeGroup state
const initialState = {
    isLoading: false,
    columns: [],
    employeeGroupList: [],
    errorMsg: null,
    success: false,
    pagination: {},
}

// create reducer actions
const employeeGroupSlice = createSlice({
    name: 'employeeGroup',
    initialState,
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setErrorMsg: (state, action) => {
            state.errorMsg = action.payload
        },
        setEmployeeGroupList: (state, action) => {
            state.employeeGroupList = action.payload
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
export const { 
    setPagination, 
    setIsLoading, 
    setErrorMsg, 
    setEmployeeGroupList, 
    setSuccess 
} = employeeGroupSlice.actions
export default employeeGroupSlice.reducer