import { createSlice } from '@reduxjs/toolkit'

// initialize recency assign state
const initialState = {
    isLoading: false,
    isLoadingAddUser: false,
    columns: [],
    recency_assignList: [],
    errorMsg: null,
    success: false,
    pagination: {},
}

// create reducer actions
const recencyAssignSlice = createSlice({
    name: 'recencyassign',
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
        setRecencyAssignList: (state, action) => {
            state.recency_assignList = action.payload
        },
        setDeleteRecencyAssign: (state, action) => {
            let Index = state.recency_assignList?.findIndex(value => value.id === action.payload)
            state.recency_assignList.splice(Index, 1)
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
export const { setPagination, setIsLoading, setErrorMsg, setIsLoadingAddUser, setRecencyAssignList, setSuccess, setDeleteRecencyAssign } = recencyAssignSlice.actions
export default recencyAssignSlice.reducer