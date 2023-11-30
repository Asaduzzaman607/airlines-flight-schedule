import { createSlice } from '@reduxjs/toolkit'

// initialize state
const initialState = {
    isLoading: false,
    isLoadingAddUser: false,
    columns: [],
    leaveTypeList: [],
    leaveConfigList: [],
    errorMsg: null,
    success: false,
    pagination: {} ,
    periodList:[],
    employeeTypeList:[]
}

// create reducer actions
const leaveConfigSlice = createSlice({
    name: 'leaveConfig',
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
        setLeaveConfigList: (state, action) => {
            state.leaveConfigList = action.payload
        },
        setLeaveTypeList: (state, action) => {
            state.leaveTypeList = action.payload
        },
        setEmployeeTypeList: (state, action) => {
            state.employeeTypeList = action.payload
        },
        deleteLeaveConfig: (state, action) => {
            let Index = state.leaveConfigList?.findIndex(value => value.id === action.payload)
            state.leaveConfigList.splice(Index, 1)
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
        setIsLoadingAddUser,
        setLeaveConfigList,
        setLeaveTypeList,
        setEmployeeTypeList,
        setSuccess,
        deleteLeaveConfig 
        } = leaveConfigSlice.actions
export default leaveConfigSlice.reducer