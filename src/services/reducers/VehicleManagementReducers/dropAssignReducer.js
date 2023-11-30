import { createSlice } from '@reduxjs/toolkit'

// initialize state
const initialState = {
    isLoading: false,
    isLoadingAddUser: false,
    columns: [],
    dropAssignList: [],
    errorMsg: null,
    success: false,
    pagination: {},
}

// create reducer actions
const dropAssignReducer = createSlice({
    name: 'dropassign',
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
        setDropAssignList: (state, action) => {
            state.dropAssignList = action.payload
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
export const { setPagination, setIsLoading, setErrorMsg, setIsLoadingAddUser, setDropAssignList, setSuccess } = dropAssignReducer.actions
export default dropAssignReducer.reducer