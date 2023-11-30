import { createSlice } from '@reduxjs/toolkit'

// initialize simModule state
const initialState = {
    isLoading: false,
    columns: [],
    simModuleList: [],
    errorMsg: null,
    success: false,
    pagination: {},
}

// create reducer actions
const simModuleSlice = createSlice({
    name: 'simModule',
    initialState,
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setErrorMsg: (state, action) => {
            state.errorMsg = action.payload
        },
        setSimModuleList: (state, action) => {
            state.simModuleList = action.payload
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
export const { setPagination, setIsLoading, setErrorMsg, setSimModuleList, setSuccess } = simModuleSlice.actions
export default simModuleSlice.reducer