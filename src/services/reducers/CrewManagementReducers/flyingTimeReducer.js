import { createSlice } from '@reduxjs/toolkit'

// initialize state
const initialState = {
    isLoading: false,
    isLoadingDashboard: false,
    isLoadingAddUser: false,
    columns: [],
    flyingTimeList: [],
    flyingDashboardDataList: [],
    updatedFlyingTime: [],
    errorMsg: null,
    success: false,
    success_for_add: false,
    pagination: {}
}

// create reducer actions
const flyingTimeSlice = createSlice({
    name: 'flyingTime',
    initialState,
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setIsLoadingDashboard: (state, action) => {
            state.isLoadingDashboard = action.payload
        },
        setErrorMsg: (state, action) => {
            state.errorMsg = action.payload
        },
        setIsLoadingAddUser: (state, action) => {
            state.isLoadingAddUser = action.payload
        },
        setFlyingTimeList: (state, action) => {
            state.flyingTimeList = action.payload
        },
        setFlyingDashboardData: (state, action) => {
            state.flyingDashboardDataList = action.payload
        },
        setUpdatedFlyingTime: (state, action) => {
            state.updatedFlyingTime = action.payload
        },
        deleteflyingTime: (state, action) => {
            let Index = state.flyingTimeList?.findIndex(value => value.id === action.payload)
            state.flyingTimeList.splice(Index, 1)
        },
        setSuccess: (state, {payload}) => {
            state.success = payload
        },
        setSuccessForAdd: (state, {payload}) => {
            state.success_for_add = payload
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
    setFlyingTimeList, 
    setSuccess, 
    setSuccessForAdd, 
    setUpdatedFlyingTime,
    setIsLoadingDashboard,
    setFlyingDashboardData 
} = flyingTimeSlice.actions
export default flyingTimeSlice.reducer