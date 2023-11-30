import { createSlice } from '@reduxjs/toolkit'

// initialize employeeLeave state
const initialState = {
    isLoading: false,
    columns: [],
    employeeLeaveList: [],
    stored_SearchBlock_Value: {},
    errorMsg: null,
    success: false,
    pagination: {},
    leaveList: [],
    isLeaveListLoading: false,
    employeeList:[],
    employeeLeaveApprovalHistory:[],
    approvalHistoryModalOpen: false,
}

// create reducer actions
const employeeLeaveSlice = createSlice({
    name: 'employeeLeave',
    initialState,
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setErrorMsg: (state, action) => {
            state.errorMsg = action.payload
        },
        setEmployeeLeaveList: (state, action) => {
            state.employeeLeaveList = action.payload
        },
        setEmployeeList: (state, action) => {
            state.employeeList = action.payload
        },
        setSearchBlockValueToReducer: (state, action) => {
            state.stored_SearchBlock_Value = action.payload
        },
        setSuccess: (state, {payload}) => {
            state.success = payload
        },
        setPagination: (state, action) => {
            state.pagination = action.payload
        },
        setLeaveList: (state, action) => {
            state.leaveList = action.payload
        },
        setIsLeaveListLoading: (state, action) => {
            state.isLeaveListLoading = action.payload
        },
    }
})

// export actions
export const {
    setPagination,
    setIsLoading,
    setErrorMsg,
    setEmployeeLeaveList,
    setSuccess,
    setSearchBlockValueToReducer,
    setLeaveList,
    setIsLeaveListLoading,
    setEmployeeList,
} = employeeLeaveSlice.actions
export default employeeLeaveSlice.reducer