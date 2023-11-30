import { createSlice } from '@reduxjs/toolkit'

// initialize crew state
const initialState = {
    isLoading: false,
    isLoadingAddUser: false,
    columns: [],
    recencyList: [],
    errorMsg: null,
    success: false,
    pagination: {},
}

// create reducer actions
const recencySlice = createSlice({
    name: 'recency',
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
        setRecencyList: (state, action) => {
            state.recencyList = action.payload
        },
        deleteRecency: (state, action) => {
            let Index = state.recencyList?.findIndex(value => value.id === action.payload)
            state.recencyList.splice(Index, 1)
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
export const { setPagination, setIsLoading, setErrorMsg, setIsLoadingAddUser, setRecencyList, setSuccess, deleteRecency } = recencySlice.actions
export default recencySlice.reducer