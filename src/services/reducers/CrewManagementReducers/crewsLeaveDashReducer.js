import { createSlice } from '@reduxjs/toolkit'

// initialize crews leave dashboard state
const initialState = {
    isLoading: false,
    crewsLeaveDashDataList: [],
    errorMsg: null,
    success: false,
    pagination: {},
}

// create reducer actions
const crewsLeaveDasSlice = createSlice({
    name: 'crewsLeaveDash',
    initialState,
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setErrorMsg: (state, action) => {
            state.errorMsg = action.payload
        },
        setCrewsLeaveDashDataList: (state, action) => {
            state.crewsLeaveDashDataList = action.payload
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
    setCrewsLeaveDashDataList, 
    setSuccess 
} = crewsLeaveDasSlice.actions
export default crewsLeaveDasSlice.reducer