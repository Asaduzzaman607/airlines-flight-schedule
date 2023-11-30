import { createSlice } from '@reduxjs/toolkit'

// initialize area state
const initialState = {
    isLoading: false,
    columns: [],
    areaList: [],
    errorMsg: null,
    success: false,
    pagination: {},
}

// create reducer actions
const areaSlice = createSlice({
    name: 'area',
    initialState,
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setErrorMsg: (state, action) => {
            state.errorMsg = action.payload
        },
        setAreaList: (state, action) => {
            state.areaList = action.payload
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
export const { setPagination, setIsLoading, setErrorMsg, setAreaList, setSuccess } = areaSlice.actions
export default areaSlice.reducer