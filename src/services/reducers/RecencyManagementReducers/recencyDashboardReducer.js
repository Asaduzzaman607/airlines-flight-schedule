import { createSlice } from '@reduxjs/toolkit'

// initialize recency assign state
const initialState = {
    isLoading: false,
    columns: [],
    recency_dashboard_data: [],
    errorMsg: null,
    success: false,
    pagination: {},
}

// create reducer actions
const recencyDashboardSlice = createSlice({
    name: 'recencyDashboard',
    initialState,
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setErrorMsg: (state, action) => {
            state.errorMsg = action.payload
        },
        setRecencyDashboardData: (state, action) => {
            state.recency_dashboard_data = action.payload
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
export const { setPagination, setIsLoading, setErrorMsg, setRecencyDashboardData, setSuccess } = recencyDashboardSlice.actions
export default recencyDashboardSlice.reducer