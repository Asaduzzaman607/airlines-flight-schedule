import { createSlice } from '@reduxjs/toolkit'

// initialize role state
const initialState = {
    isLoading: false,
    columns: [],
    approvalMenuList: [],
    errorMsg: null,
    success: false,
    pagination: {},
}

// create reducer actions
const approvalConfigSlice = createSlice({
    name: 'approvalConfig',
    initialState,
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setErrorMsg: (state, action) => {
            state.errorMsg = action.payload
        },
        setApprovalMenuList: (state, action) => {
            state.approvalMenuList = action.payload
        },
        setSuccess: (state, {payload}) => {
            state.success = payload
        },
    }
})

// export actions
export const { 
    setApprovalMenuList,
    setErrorMsg,
    setIsLoading,
    setSuccess,
} = approvalConfigSlice.actions
export default approvalConfigSlice.reducer