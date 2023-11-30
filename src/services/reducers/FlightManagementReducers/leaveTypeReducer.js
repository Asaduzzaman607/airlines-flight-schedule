import { createSlice } from '@reduxjs/toolkit'

// initialize state
const initialState = {
    isLoading: false,
    isLoadingAddUser: false,
    columns: [],
    leaveTypeList: [],
    errorMsg: null,
    success: false,
    pagination: {} ,
    periodList:[]
}

// create reducer actions
const leaveTypeSlice = createSlice({
    name: 'leaveType',
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
        setLeaveTypeList: (state, action) => {
            state.leaveTypeList = action.payload
        },
        setPeriodList: (state, action) => {
            state.periodList = action.payload
        },
        deleteLeaveType: (state, action) => {
            let Index = state.leaveTypeList?.findIndex(value => value.id === action.payload)
            state.leaveTypeList.splice(Index, 1)
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
export const { setPagination, setIsLoading, setErrorMsg, setIsLoadingAddUser, setLeaveTypeList, setPeriodList, setSuccess, deleteLeaveType } = leaveTypeSlice.actions
export default leaveTypeSlice.reducer