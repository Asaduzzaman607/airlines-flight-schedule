import { createSlice } from '@reduxjs/toolkit'

// initialize trainer state
const initialState = {
    isLoading: false,
    columns: [],
    trainerList: [],
    errorMsg: null,
    success: false,
    pagination: {},
}

// create reducer actions
const trainerReducer = createSlice({
    name: 'trainer',
    initialState,
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setErrorMsg: (state, action) => {
            state.errorMsg = action.payload
        },
        setTrainerList: (state, action) => {
            state.trainerList = action.payload
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
export const { setPagination, setIsLoading, setErrorMsg, setTrainerList, setSuccess } = trainerReducer.actions
export default trainerReducer.reducer