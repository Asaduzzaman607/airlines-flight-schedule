import { createSlice } from '@reduxjs/toolkit'

// initialize journey log state
const initialState = {
    isLoading: false,
    columns: [],
    JourneyLogList: [],
    errorMsg: null,
    success: false,
    pagination: {},
    isEditable: true,
    search_date: null,
}

// create reducer actions
const journeyLogSlice = createSlice({
    name: 'journeyLog',
    initialState,
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setErrorMsg: (state, action) => {
            state.errorMsg = action.payload
        },
        setJourneyLogList: (state, action) => {
            state.JourneyLogList = action.payload
        },
        setSuccess: (state, {payload}) => {
            state.success = payload
        },
        setIsEditable: (state, {payload}) => {
            state.isEditable = payload
        },
        setPagination: (state, action) => {
            state.pagination = action.payload
        },
        setCurrentDate: (state, action) => {
            state.search_date = action.payload
        }
    }
})

// export actions
export const { setPagination, setIsLoading, setErrorMsg, setJourneyLogList, setSuccess, setIsEditable, setCurrentDate } = journeyLogSlice.actions
export default journeyLogSlice.reducer