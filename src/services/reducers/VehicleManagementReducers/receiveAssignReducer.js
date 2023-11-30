import { createSlice } from '@reduxjs/toolkit'

// initialize state
const initialState = {
    isLoading: false,
    isLoadingAddUser: false,
    columns: [],
    receiveAssignList: [],
    errorMsg: null,
    success: false,
    pagination: {},
}

// create reducer actions
const receiveAssignReducer = createSlice({
    name: 'receiveassign',
    initialState,
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setErrorMsg: (state, action) => {
            state.errorMsg = action.payload
        },
        setIsLoadingAddUser: (state, action) => {
            state.isLoadingAddUser = action.payload
        },
        setReceiveAssignList: (state, action) => {
            state.receiveAssignList = action.payload
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
export const { setPagination, setIsLoading, setErrorMsg, setIsLoadingAddUser, setReceiveAssignList, setSuccess } = receiveAssignReducer.actions
export default receiveAssignReducer.reducer