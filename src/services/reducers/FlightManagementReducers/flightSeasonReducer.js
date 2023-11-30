import { createSlice } from '@reduxjs/toolkit'

// initialize state
const initialState = {
    isLoading: false,
    columns: [],
    flightSeasonList: [],
    errorMsg: null,
    success: false,
    pagination: {},
}

// create reducer actions
const flightSeasonReducer = createSlice({
    name: 'flightSeason',
    initialState,
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setErrorMsg: (state, action) => {
            state.errorMsg = action.payload
        },
        setFlightSeasonList: (state, action) => {
            state.flightSeasonList = action.payload
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
export const { setPagination, setIsLoading, setErrorMsg, setFlightSeasonList, setSuccess } = flightSeasonReducer.actions
export default flightSeasonReducer.reducer