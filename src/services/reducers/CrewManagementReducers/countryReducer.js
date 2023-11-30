import { createSlice } from '@reduxjs/toolkit'

// initialize country state
const initialState = {
    isLoading: false,
    columns: [],
    countryList: [],
    errorMsg: null,
    success: false,
    pagination: {},
}

// create reducer actions
const countrySlice = createSlice({
    name: 'country',
    initialState,
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setErrorMsg: (state, action) => {
            state.errorMsg = action.payload
        },
        setCountryList: (state, action) => {
            state.countryList = action.payload
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
export const { setPagination, setIsLoading, setErrorMsg, setCountryList, setSuccess } = countrySlice.actions
export default countrySlice.reducer