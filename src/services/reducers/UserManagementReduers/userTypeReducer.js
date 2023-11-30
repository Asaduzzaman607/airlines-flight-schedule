import { createSlice } from '@reduxjs/toolkit'

// initialize user state
const initialState = {
    isLoading: false,
    columns: [],
    userTypeList: [],
    errorMsg: null,
    success: false,
    pagination: {},
}

// create reducer actions
const userTypeSlice = createSlice({
    name: 'userType',
    initialState,
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setErrorMsg: (state, action) => {
            state.errorMsg = action.payload
        },
        setUserTypeList: (state, action) => {
            state.userTypeList = action.payload
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
export const { setPagination, setSuccess, setIsLoading, setErrorMsg, setUserTypeList } = userTypeSlice.actions
export default userTypeSlice.reducer