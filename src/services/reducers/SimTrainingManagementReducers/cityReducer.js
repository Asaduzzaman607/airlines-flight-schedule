import { createSlice } from '@reduxjs/toolkit'

// initialize city state
const initialState = {
    isLoading: false,
    columns: [],
    cityList: [],
    errorMsg: null,
    success: false,
    pagination: {},
}

// create reducer actions
const citySlice = createSlice({
    name: 'city',
    initialState,
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setErrorMsg: (state, action) => {
            state.errorMsg = action.payload
        },
        setCityList: (state, action) => {
            state.cityList = action.payload
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
export const { setPagination, setIsLoading, setErrorMsg, setCityList, setSuccess } = citySlice.actions
export default citySlice.reducer